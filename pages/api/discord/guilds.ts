import accounts from 'database/constructs/accounts';
import sessions from 'database/constructs/sessions';
import initializeDatabase from 'database/initialize';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, Session } from 'next-auth/client';
import { isNull, RejectType } from 'utils/tools';
import fetch from "node-fetch"
import hat from "hat"
import { checkToken } from 'utils/serverTools';
import rateLimit from 'utils/rateLimit';
import dotenv from "dotenv"
dotenv.config()

const limiter = rateLimit()
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

  const rateLimited = await limiter.check(res, 10, "CACHE_TOKEN")
  if(rateLimited) return res.send(rateLimited);

  const conn = await initializeDatabase(hat());

  const session = await getSession({ req }) as Session;
  if (isNull(session) || isNull(session?.accessToken)) return res.send({ error: "No session" })
  const dbSession = await new sessions(conn, { where: { access_token: session.accessToken } }).get()
  if (isNull(dbSession)) return res.status(401).send({ error: "No Database entry found" })

  let dbAcc = await new accounts(conn, { where: { user_id: dbSession?.user_id } }).get()
  if (!dbAcc) return res.status(401).send({ error: "Account not found" })
  const sql = await checkToken(dbAcc, conn).catch((e: RejectType) => {
    res.status(e.status).send({ error: JSON.parse(e.response.text).error_description });
  })
  if (sql === undefined)
    if (res.writableEnded) return;
    else return res.status(500).send({ error: "Internal Server Error" });

  dbAcc = sql;

  const discordObj: DiscordGuilds[] | RateLimit = await (await fetch(`https://discord.com/api/v8/users/@me/guilds`, {
    headers: {
      "Authorization": `Bearer ${dbAcc.access_token}`
    }
  })).json()

  //@ts-ignore
  if (isNull(discordObj.map)) return res.send({ error: discordObj });

  const inGuilds = discordObj as DiscordGuilds[];

  const toFetch = `${process.env.BOT_URI}/permLevels?member=${dbAcc?.provider_account_id}`
  let permLevels;
  try {
    permLevels = await (await fetch(toFetch, {
      method: "POST",
      body: JSON.stringify({ check: inGuilds.map(e => e.id) }),
      headers: {
        "Content-Type": "application/json"
      }
     })).json()
  } catch (e) {
     return res.status(500).send({error: "Bot API is offline."})
  }
  await conn.close()

  res.send({
    permLevels: permLevels,
    guilds: inGuilds
  });
}


// Generated by https://quicktype.io

export interface DiscordGuilds {
  id: string;
  name: string;
  icon: null | string;
  owner: boolean;
  permissions: string;
  features: string[];
}

export interface RateLimit {
  global: boolean,
  message: string,
  retry_after: number
}

export default handler
