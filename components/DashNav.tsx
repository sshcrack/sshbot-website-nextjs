import Link from 'next/link';
import { Mode } from 'pages/dashboard/[guild]/[mode]';
import styles from "../styles/dashNav.module.scss";
import BotIcon from './BotIcon';

const DashNav = ({ mode, baseUrl }: Props) => {

  const children: JSX.Element[] = [];
  const modes = Object.values(Mode)
  modes.forEach(el => {
    const lowerCase = el.toLowerCase();
    children.push(
      <Link href={`${baseUrl}/${lowerCase}`} key={`Menu-${el}`}>
        <a className={styles.navItem + get(mode, el)}>
          <span className={`${styles.gradient} ${styles[capitalizeLetter(el)]}`}>{capitalizeLetter(el)}</span>
        </a>
      </Link>
    )
  })

  return <>
    <header className={styles.nav}>
      <BotIcon className={styles.botIcon} />
      <div className={styles.navOuter}>
        {children}
      </div>
    </header>
  </>
}

function get(mode: Mode, is: Mode) {
  return mode === is ? " " + styles.active : ""
}

function capitalizeLetter(str: string) {
  const arr = str.split("");
  const capitalized = arr.shift()?.toUpperCase();
  return capitalized + arr.join("");
}

interface Props {
  mode: Mode,
  baseUrl: string
}

export default DashNav;