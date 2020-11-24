import accounts from 'database/constructs/accounts';
import sessions from 'database/constructs/sessions';
import { AccountSQL } from 'database/entities/Account';
import moment from 'moment';
import fetch from "superagent"
import { Connection } from 'typeorm';
import { DiscordRefresh, isNull, RejectType } from './tools';

export function checkToken(user: AccountSQL, conn: Connection): Promise<AccountSQL> {
  return new Promise(async (resolve, reject) => {
    let expiresAt;
    const updatedAt = moment(new Date(user.updated_at.toString()));
    if (isNull(user.access_token_expires))
      expiresAt = updatedAt.add(604800, "milliseconds");
    else expiresAt = moment(new Date(user.access_token_expires.toString()))
    const Accounts = new accounts(conn, { where: { user_id: user.user_id } });

    const now = moment()
    if (expiresAt.isBefore(now)) return resolve(user)

    const res = (await fetch.post(`https://discord.com/api/v8/oauth2/token`)
      .field('client_id', process.env.CLIENT_ID as string)
      .field('client_secret', process.env.CLIENT_SECRET as string)
      .field('refresh_token', user.refresh_token)
      .field('grant_type', 'refresh_token')
      .field('scope', 'identify guilds').catch(async (e: RejectType) => {
        await Accounts.delete({ user_id: user.user_id });
        (new sessions(conn, {where: {user_id: user.user_id}})).delete({user_id: user.user_id})
        reject(e)
      })) || undefined;


    if (res === undefined ) return;
    if (res.status !== 200) return reject(new Error(res.text))
    const json: DiscordRefresh = JSON.parse(res.text)

    const newExpires = now.clone()
    newExpires.add(json.expires_in, "millisecond")

    let sql: AccountSQL = {
      access_token: json.access_token,
      access_token_expires: dateToTimezone(newExpires.toDate()),
      updated_at: dateToTimezone(now.toDate()),
      compound_id: user.compound_id,
      created_at: user.created_at,
      id: user.id,
      provider_account_id: user.provider_account_id,
      provider_id: user.provider_id,
      provider_type: user.provider_type,
      refresh_token: json.refresh_token,
      user_id: user.id
    }

    await Accounts.set(sql);

    resolve(sql)
  });
}

export function dateToTimezone(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}+${formatNumber(Math.floor(date.getTimezoneOffset() / -60), 2)}`
}

export function formatNumber(numb: number, decimals: number) {
  const str = numb.toString();
  const diff = decimals - str.length;
  return diff <= 0 ? str : "0".repeat(diff) + str;
}