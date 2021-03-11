import GuildsList, { FilteredGuilds } from 'components/GuildsList'
import { TharButton } from 'components/TharButton'
import { signOut } from 'next-auth/client'
import { useRouter } from 'next/router'
import { DiscordGuilds } from 'pages/api/discord/guilds'
import { useEffect, useState } from 'react'
import Loader from "react-loader-spinner"
import { HTTPStatusCodes } from 'utils/statusCodes'
import { isNull } from 'utils/tools'
import Layout from '../../components/Layout'

const Dashboard = () => {
  const [response, setGuilds] = useState<ResponseInterface>()
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      setLoading(true)
      fetch(`${window.location.protocol}//${window.location.host}/api/discord/guilds`).then(res => {
        res.json().then(t => {
          setGuilds({
            status: res.status,
            ...t
          })
          //@ts-ignore
        }).catch(async (e: Object) => setGuilds({
          error: e.toString(),
        }));
      })
    }
  })

  if (typeof window === "undefined") return null;
  if (!response)
    return <Layout title="Overview | ecomody" key="Waiting">
      <h1>Loading</h1>
      <Loader type="Bars" color="#00BFFF" height={80} width={80} />
    </Layout>

  if (response.error === "No session") {
    router.push("/");
    return <h1>Redirecting</h1>
  }

  if (response.error || response.message) {
    console.log("Error", response.error);
    if (typeof response.error === "object") {
      return <Layout title="Overview | ecomody" key="Error">
        <h1>ERROR</h1>
        <p>
          {(response.error as any).message}
        </p>
        <p>Try signing out and logging back in.</p>
      </Layout>
    }
    if (response.error?.includes("unexpected character")) {
      return <Layout title="Overview | ecomody" key="Error">
        <h1>ERROR</h1>
        <span>
          500 INTERNAL SERVER ERROR
        </span>
      </Layout>
    }
  }

  if (response.error || response.status !== HTTPStatusCodes.OK) {
    return <Layout title="Overview | ecomody" key="Error">
      <h1>ERROR</h1>
      <p>
        {JSON.stringify(response.error)}
      </p>
      <p>
        Trying to resolve your problem...
        If this problem persists, please contact the developers!
      </p>
      <TharButton color="white" anim="red" width={"200px"} height={"100px"}><span onClick={() => signOut().then(() => location.pathname = "/loggedOut")}>Sign out</span></TharButton>
    </Layout>
  }

  if (isNull(response.permLevels)) {
    return <Layout title="Overview | ecomody" key="PermLevels">
      <h1>permLevels null</h1>
      <span>{response.permLevels}</span>
    </Layout>
  }

  const filtered: FilteredGuilds[] = []
  response.guilds.forEach(guild => {
    const permLevel = response.permLevels[guild.id]

    if (!isNull(permLevel))
      if (permLevel >= PermLevels.User) {
        const filteredGuilds = guild as FilteredGuilds
        filteredGuilds.permLevel = permLevel
        filteredGuilds.botJoined = true

        return filtered.push(filteredGuilds)
      }

    if (isAdmin(parseInt(guild.permissions))) {
      const filteredGuilds = guild as FilteredGuilds;
      filteredGuilds.permLevel = permLevel ?? PermLevels.Administrator
      filteredGuilds.botJoined = false

      filtered.push(filteredGuilds)
    }
    return undefined
  })




  return <Layout title="Overview | ecomody" key="Overview">
    <h1>Overview</h1>
    <GuildsList guilds={filtered} />
  </Layout>
}

export function isAdmin(permCode: number) {
  return (permCode & 0x8) !== 0;
}

export interface ResponseInterface {
  message: string | undefined
  permLevels: { [key: string]: PermLevels },
  guilds: DiscordGuilds[],
  error: undefined | string,
  status: number
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

export default Dashboard