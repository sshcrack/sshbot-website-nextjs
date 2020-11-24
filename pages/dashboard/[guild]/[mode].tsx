import DashNav from 'components/DashNav'
import Layout from 'components/Layout'
import { Alerts } from 'components/Modes/Alerts'
import { Basic } from 'components/Modes/Basic'
import { Miscellaneous } from 'components/Modes/Miscellaneous'
import { Moderation } from 'components/Modes/Moderation'
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
    </Layout>
  }


  const Component = ModeComponents[mode as Mode]
  return <>
    <Layout title="Settings | sshbot" nav={<DashNav mode={mode as Mode} baseUrl={baseUrl}/>}>
      {<Component data={infoResp}/>}
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
  privateChannel: string,
  disableDetailedLogging: string,
  levelUpChannel: string
}

export enum Mode {
  Basic = "basic",
  Moderation = "moderation",
  Alerts = "alerts",
  Miscellaneous = "miscellaneous"
}

export const ModeComponents = {
  basic: Basic,
  moderation: Moderation,
  alerts: Alerts,
  miscellaneous: Miscellaneous
}