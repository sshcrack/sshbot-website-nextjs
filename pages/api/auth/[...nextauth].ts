import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { NextApiResponse, NextApiRequest } from 'next'
import { ConnectionOptions } from 'typeorm';

const port = parseInt(undefinedToString(process.env.DATABASE_PORT));
const host = undefinedToString(process.env.DATABASE_HOST);
const username = undefinedToString(process.env.DATABASE_USERNAME);
const password = undefinedToString(process.env.DATABASE_PASSWORD);
const database = undefinedToString(process.env.DATABASE_DATABASE);

let dbOptions : ConnectionOptions = {
    type: "postgres",
    port: port,
    host: host,
    username: username,
    password: password,
    database: database,
    
}

const options: InitOptions = {
    // Configure one or more authentication providers
    providers: [
        Providers.Discord({
            clientId: undefinedToString(process.env.CLIENT_ID),
            clientSecret: undefinedToString(process.env.CLIENT_SECRET)
        })
    ],

    // A database is optional, but required to persist accounts in a database
    database: dbOptions
}

function undefinedToString(str: string | undefined): string {
    return str === undefined ? "" : str;
} 

export default (req: NextApiRequest, res: NextApiResponse<any>) => NextAuth(req, res, options)