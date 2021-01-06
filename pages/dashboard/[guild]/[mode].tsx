import BuildPage from 'components/BuildPage'
import DashNav from 'components/DashNav'
import Layout from 'components/Layout'
import { TharButton } from 'components/TharButton'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loader from 'react-loader-spinner'
import { isNull } from 'utils/tools'
import { ResponseInterface } from '../index'

const Guild = () => {
  const [response, setGuilds] = useState<any | string>()
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const { guild, mode } = router.query;
  const baseUrl = `/dashboard/${guild}`;


  useEffect(() => {
    if (!loading && typeof window !== "undefined" && guild) {
      setLoading(true)
      fetch(`${window.location.protocol}//${window.location.host}/api/discord/info?id=${guild}`).then(res => {
        res.json().then(t => setGuilds(t));
      })
    }
  })
  if (typeof window === "undefined") return null;

  if (!response) return <Layout title="Dashboard | sshbot" key="Waiting">
    <h1>Loading</h1>
    <Loader type="Bars" color="#00BFFF" height={80} width={80} />
  </Layout>

  if (typeof response === "string") return <h1>{response}</h1>
  const infoResp: InfoInterface = response

  if (typeof window !== "undefined") {
    if (isNull(mode?.length)) {
      router.push(baseUrl)
      return <h1>Redirecting</h1>
    }


    if (!Object.keys(Mode).map(v => v.toLowerCase()).includes((mode as string).toLowerCase())) {
      router.push(baseUrl)
      return <h1>Redirecting</h1>
    }
  }

  if (infoResp.error === "No session") {
    router.push("/");
    return <h1>Redirecting No session</h1>
  }

  if (!isNull(infoResp.error)) {
    return <Layout title="Settings | sshbot">
      <h1>ERROR</h1>
      <span>{JSON.stringify(infoResp.error)}</span>
      <TharButton color="white" anim="green" width={"100px"} height={"50px"} onClick={() => {window?.history?.back()}}>Back</TharButton>
    </Layout>
  }


  return <>
    <Layout title="Settings | sshbot" nav={<DashNav mode={mode as Mode} baseUrl={baseUrl}/>} style={{justifyContent: "start"}}>
      {<BuildPage mode={mode as string} guild={guild as string} />}
    </Layout>
  </>
}

export default Guild

export interface InfoInterface {
  found: ResponseInterface,
  data: GuildInterface,
  error?: string
}

export interface GuildInterface {
  joinMSG: string,
  leaveMSG: string,
  welcomeChannel: string,
  welcomeImage: boolean,
  privateChannel: string,
  disableDetailedLogging: boolean,
  levelUpChannel: string,
  prefix: string,
  channels: DiscordChannel[]
}

export interface DiscordChannel {
  id:                    string;
  type:                  number;
  name:                  string;
  position:              number;
  parent_id:             null | string;
  guild_id:              string;
  permission_overwrites: PermissionOverwrite[];
  nsfw:                  boolean;
  last_message_id?:      null | string;
  last_pin_timestamp?:   string;
  topic?:                null;
  rate_limit_per_user?:  number;
  bitrate?:              number;
  user_limit?:           number;
}

export interface PermissionOverwrite {
  id:    string;
  type:  number;
  allow: string;
  deny:  string;
}


export enum Mode {
  Basic = "basic",
  Moderation = "moderation",
  Alerts = "alerts",
  Miscellaneous = "miscellaneous"
}