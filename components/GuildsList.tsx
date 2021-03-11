import { DiscordGuilds } from 'pages/api/discord/guilds'
import { PermLevels } from 'pages/dashboard'
import { isNull } from 'utils/tools'
import styles from "../styles/guildsList.module.scss"
import { TharButton } from './TharButton'
import anime from "animejs"
import Link from 'next/link'
import { openJoinWindow } from 'pages'

const GuildsList = ({ guilds }: Props) => {
  return <div className={styles.root} onLoad={() => handleLoad()}>
    {guilds.map((item, index) => {
      return <GuildItem data={item} key={index} />
    })}
    {guilds.length === 0 ? <span className={styles.noServers}>You are not an admin or the server owner of any server.</span> : <></>}
  </div>
}

const handleLoad = () => {
  anime({
    targets: `.${styles.item}`,
    opacity: '1',
    autoplay: true,
    delay: function (_el, i, _l) {
      return i * 50;
    },
    endDelay: function (_el, i, l) {
      return (l - i) * 50;
    }
  });
}

const GuildItem = ({ data, className }: ItemProps) => {
  const button = data.botJoined ?
    <Link href={`/dashboard/${data.id}`}>
      <a>
        <TharButton className={styles.toDashboard}>Dashboard</TharButton>
      </a>
    </Link>
    :
    <TharButton className={styles.addBot} onClick={() => openJoinWindow(data.id)}>Add</TharButton>

  return <div className={isNull(className) ? styles.item : `${data} ${className}`}>
    <div className={styles.infoBox}>
      <img src={isNull(data.icon) ? "https://discord.com/assets/322c936a8c8be1b803cd94861bdfa868.png" : `https://cdn.discordapp.com/icons/${data.id}/${data.icon}.png`} />
      <span>{shorten(data.name, 29)}</span>
    </div>
    <div className={styles.button}>
      {button}
    </div>
  </div>

}

export const shorten = (str: string, max: number): string => str.split("").slice(0, max - 3).length < str.length ? str.split("").slice(0, max - 3).join("") + "..." : str

export default GuildsList


type Props = {
  guilds: FilteredGuilds[],
}

type ItemProps = {
  data: FilteredGuilds
  className?: string
}

export interface FilteredGuilds extends DiscordGuilds {
  permLevel: PermLevels,
  botJoined: boolean
}
