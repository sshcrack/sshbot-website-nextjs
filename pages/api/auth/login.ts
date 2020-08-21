import { NextApiRequest, NextApiResponse } from 'next';

let discordBaseUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=identify%20guilds&permissions=8&response_type=code`

export default (_req: NextApiRequest, res: NextApiResponse<any>) => {
    res.redirect(`${discordBaseUrl}&redirect_uri=${process.env.NEXTAUTH_URL}/api/auth/callback/discord`);
}
