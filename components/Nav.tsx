import styles from "../styles/nav.module.scss"
import NavItem from "./NavItem"
import gavel from "../assets/svg/gavel.svg";
import { signIn, signOut, useSession, Session } from "next-auth/client"
import SingleText from "./SingleText";
import Link from "next/link";

const Nav = () => {
  const [session, loading] = useSession();
  return (
    <header className={styles.navHeader}>
      <div className={styles.botLogo} onClick={toHome}>
        <img src="/imgs/botIcon.png"></img>
        <h1>sshbot</h1>
      </div>

      <ul className={styles.navUl}>
        <li>
          <Link href="/moderation">
            <a>
              <NavItem svg={gavel} hoverClass={styles.moderation}>
                <SingleText text="Moderation" type="span" className={styles.singleText}/>
              </NavItem>
            </a>
          </Link>
        </li>
      </ul>

      <SignInOut session={session} loading={loading}></SignInOut>

    </header>
  )
};

interface SignInOutProps {
  session: Session,
  loading: boolean
}

function SignInButton(_props: {}) {
  return <button onClick={() => { signIn(); }}>Sign in</button>
}

function SignOutButton(_props: {}) {
  return <button onClick={() => { signOut(); }}>Sign out</button>
}

function SignInOut(props: SignInOutProps) {
  return isNull(props.session) ? <SignInButton /> : <SignOutButton />;
}

export default Nav

function toHome() {
  window.location.href = '/'
}

function isNull(obj: any) {
  return obj === undefined || obj === null;
}