import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseInterface } from 'pages/guilds/overview';
import { isNull } from 'utils/tools';


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string
  const mode = (req.query.mode as string) || "basic"
  const result = await fetch(`${process.env.NEXTAUTH_URL}/api/discord/guilds`)
  const json: ResponseInterface = await result.json()

  if(isNull(id)) return res.send({ error: "No Guild ID given"})
  if (json.error) return res.send({ error: json.error })

  const found = json.guilds.find(g => g.id === id)
  if (isNull(found)) return res.send({ error: "Access denied" })

  const resultBot = await fetch(`${process.env.BOT_URI}/guild?guild=${id}&mode=${mode}`)
  const guild = await resultBot.json()

  res.send(guild)
}

export default handler