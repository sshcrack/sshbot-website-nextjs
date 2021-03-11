
import accounts from 'database/constructs/accounts';
import sessions from 'database/constructs/sessions';
import { SessionSQL } from 'database/entities/Session';
import initializeDatabase from 'database/initialize';
import hat from 'hat';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { checkToken } from 'utils/serverTools';
import { isNull, RejectType } from 'utils/tools';
import rateLimit from 'utils/rateLimit';
import dotenv from "dotenv"
dotenv.config()

const limiter = rateLimit()
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.send("Post-Method required");

  const rateLimited = await limiter.check(res, 10, "CACHE_TOKEN")
  if(rateLimited) return res.send(rateLimited);
  const conn = await initializeDatabase(hat());

  const id = req.query.id as string
  const session = await getSession({ req });
  if (session === null || isNull(session?.accessToken)) return res.send({ error: "No session" })
  const dbSession = await new sessions(conn, { where: { access_token: session.accessToken } }).get() as SessionSQL
  if (isNull(dbSession)) return res.status(401).send({ error: "No Database entry found" })

  let dbAcc = await new accounts(conn, { where: { user_id: dbSession?.user_id } }).get()
  if (!dbAcc) return res.status(401).send({ error: "Account not found" })
  const sql = await checkToken(dbAcc, conn).catch((e: RejectType) => {
    res.status(e.status).send({ error: JSON.parse(e.response.text).error_description });
  })
  if (sql === undefined)
    if (res.writableEnded) return;
    else return res.status(500).send({ error: "Internal Server Error" });

  let resultBot: Response
  try {
    resultBot = await fetch(`${process.env.BOT_URI}/save?guild=${id}&member=${dbAcc.provider_account_id}`, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch (e) {
    return res.status(500).send({error: "Bot API is offline."})
  }

  const guild = await resultBot.json()

  res.send(guild)
}

export default handler
