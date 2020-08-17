import styles from "../styles/nav.module.scss";
import NavItem from "./NavItem";

const Nav = () => (
  <header className={styles.navHeader}>
        <div className={styles.botLogo} onClick={toHome}>
          <img src="/imgs/botIcon.png"></img>
          <h1>sshbot</h1>
        </div>
        <NavItem>
          
        </NavItem>
  </header>
);

export default Nav

function toHome() {
  window.location.href = '/'
}