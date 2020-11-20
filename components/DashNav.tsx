import { Mode } from 'pages/dashboard/[guild]/[mode]';
import styles from "../styles/dashNav.module.scss";
import BotIcon from './BotIcon';

const DashNav = ({ mode }: Props) => {


  return <>
    <header className={styles.nav}>
      <BotIcon className={styles.botIcon} />
      <div className={styles.navOuter}>
        <div className={styles.navItem + get(mode, Mode.Moderation)}>
          Moderation
        </div>
        <div className={styles.navItem + get(mode, Mode.Alerts)}>
          Alerts
        </div>
        <div className={styles.navItem + get(mode, Mode.Ranking)}>
          Ranking
        </div>
        <div className={styles.navItem + get(mode, Mode.Commands)}>
          Commands
        </div>
      </div>
    </header>
  </>
}

function get(mode: Mode, is: Mode) {
  return mode === is ? " " + styles.active : ""
}

interface Props {
  mode: Mode
}

export default DashNav;