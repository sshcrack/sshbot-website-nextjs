import styles from "../styles/nav.module.scss"
import NavItem from "./NavItem"
import { signIn } from "next-auth/client"

const Nav = () => (
  <header className={styles.navHeader}>
        <div className={styles.botLogo} onClick={toHome}>
          <img src="/imgs/botIcon.png"></img>
          <h1>sshbot</h1>
        </div>
        <NavItem>
          
        </NavItem>
        
        <button onClick={signIn}>Sign in</button>
  </header>
);

export default Nav

function toHome() {
  window.location.href = '/'
}