import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { InitOptions } from 'next-auth';
import { ConnectionOptions } from 'typeorm';
import DiscordProvider from "../../../interfaces/customDiscordProvider";

const port = parseInt(undefinedToString(process.env.DATABASE_PORT));
const host = undefinedToString(process.env.DATABASE_HOST);
const username = undefinedToString(process.env.DATABASE_USERNAME);
const password = undefinedToString(process.env.DATABASE_PASSWORD);
const database = undefinedToString(process.env.DATABASE_DATABASE);

let dbOptions: ConnectionOptions = {
    type: "postgres",
    port: port,
    host: host,
    username: username,
    password: password,
    database: database,
    synchronize: true
}

const options: InitOptions = {
    // Configure one or more authentication providers
    providers: [
        DiscordProvider({
            clientId: undefinedToString(process.env.CLIENT_ID),
            clientSecret: undefinedToString(process.env.CLIENT_SECRET)
        })
    ],

    // A database is optional, but required to persist accounts in a database
    database: dbOptions,
    secret: process.env.NEXT_SECRET,
    //@ts-ignore
    redirectURL: "/redirects/close",
    signOutRedirectUrl: "/loggedOut"
}

function undefinedToString(str: string | undefined): string {
    return str === undefined ? "" : str;
}

export default (req: NextApiRequest, res: NextApiResponse<any>) => NextAuth(req, res, options)