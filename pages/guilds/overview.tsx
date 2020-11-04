import GuildsList, { FilteredGuilds } from 'components/GuildsList'
import { useRouter } from 'next/router'
import { DiscordGuilds } from 'pages/api/discord/guilds'
import { useEffect, useState } from 'react'
import Loader from "react-loader-spinner"
import { isNull } from 'utils/tools'
import Layout from '../../components/Layout'

const Overview = () => {
  const [response, setGuilds] = useState<ResponseInterface>()
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      setLoading(true)
      fetch(`${window.location.protocol}//${window.location.host}/api/discord/guilds`).then(res => {
        res.json().then(t => {
          setGuilds(t)
        });
      })
    }
  })

  if (typeof window === "undefined") return null;
  if (!response)
    return <Layout title="Dashboard | sshbot" key="Waiting">
    <h1>Loading</h1>
    <Loader type="Bars" color="#00BFFF" height={80} width={80} />
  </Layout>

  if (response.error === "No session") {
    router.push("/");
    return <h1>Redirecting</h1>
  }

  if (!isNull(response.error)) {
    return <Layout title="Overview | sshbot" key="Error">
      <h1>ERROR</h1>
      <span>{JSON.stringify(response.error)}</span>
    </Layout>
  }

  if (isNull(response.permLevels)) {
    return <Layout title="Overview | sshbot" key="PermLevels">
      <h1>permLevels null</h1>
      <span>{response.permLevels}</span>
    </Layout>
  }

  const filtered: FilteredGuilds[] = []
  response.guilds.forEach(guild => {
    const permLevel = response.permLevels[guild.id]

    if (!isNull(permLevel))
      if (permLevel >= PermLevels.Administrator) {
        const filteredGuilds = guild as FilteredGuilds;
        filteredGuilds.permLevel = permLevel

        filtered.push(filteredGuilds)
      }

    if (isAdmin(parseInt(guild.permissions))) {
      const filteredGuilds = guild as FilteredGuilds;
      filteredGuilds.permLevel = permLevel

      filtered.push(filteredGuilds)
    }

    return undefined
  })




  return <Layout title="Overview | sshbot" key="Overview">
    <h1>Overview</h1>
    <GuildsList guilds={filtered}/>
  </Layout>
}

export function isAdmin(permCode: number) {
  return (permCode & 0x8) !== 0;
}

export interface ResponseInterface {
  permLevels: { [key: string]: PermLevels },
  guilds: DiscordGuilds[],
  error: undefined | string
}

export enum PermLevels {
  User = 0,
  Moderator = 1,
  Administrator = 2,
  ServerOwner = 3,
  BotSupporter = 4,
  BotDeveloper = 5,
  BotOwner = 6
}

export default Overview