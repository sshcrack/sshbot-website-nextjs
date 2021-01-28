import BuildPage from 'components/BuildPage'
import DashNav from 'components/DashNav'
import Layout from 'components/Layout'
import { useRouter } from 'next/router'
import { isNull } from 'utils/tools'
import { ResponseInterface } from '../index'

const Guild = () => {
  const router = useRouter();
  const { guild, mode } = router.query;
  const baseUrl = `/dashboard/${guild}`;


  if (typeof window === "undefined") return null;
  if (!guild) return <></>;
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

  return <>
    <Layout title="Settings | ecomody" nav={<DashNav mode={mode as Mode} baseUrl={baseUrl}/>} style={{justifyContent: "start"}}>
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