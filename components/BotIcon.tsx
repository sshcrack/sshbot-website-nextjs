import Link from 'next/link'
import { isNull } from 'utils/tools';
import styles from "../styles/botIcon.module.scss";

const BotIcon =({className}: Props) =>  (
  <Link href="/" >
    <a className={isNull(className) ? styles.linkBotLogo : className}>
      <div className={styles.botLogo}>
        <img src="/imgs/botIcon.png"></img>
        <h1>sshbot</h1>
      </div>
    </a>
  </Link>
)

interface Props {
  className?: string
}

export default BotIcon