import { session, signIn, signOut, useSession } from "next-auth/client";
import gavel from "../assets/svg/gavel.svg";
import music from "../assets/svg/music.svg";
import economy from "../assets/svg/sack-dollar.svg";
import styles from "../styles/nav.module.scss";
import NavItem from "./NavItem";
import Link from 'next/link';
import { isNull } from 'utils/tools';

const Nav = () => {
  const [session] = useSession();
  return (
    <header className={styles.navHeader}>
      <Link href="/" >
        <a className={styles.linkBotLogo}>
          <div className={styles.botLogo}>
            <img src="/imgs/botIcon.png"></img>
            <h1>sshbot</h1>
          </div>
        </a>
      </Link>

      <ul className={styles.navUl}>
        <li>
          <NavItem
            svg={music}
            hoverClass={styles.music}
            text="Music"
            href="/music"
          />
        </li>
        <li>
          <NavItem
            svg={economy}
            hoverClass={styles.economy}
            text="Economy"
            href="/economy"
          />
        </li>
        <li>
          <NavItem
            svg={gavel}
            hoverClass={styles.moderation}
            text="Moderation"
            href="/moderation"
          />
        </li>
        <li>
          <CheckLoggedIn session={session} />
        </li>
      </ul>
    </header>
  );
};

interface SignInOutProps {
  session: session;
}

function CheckLoggedIn(props: SignInOutProps) {
  return isNull(props.session) ? <SignInMenu /> : <SignOutMenu />;
}

function SignInMenu(_props: {}) {
  return (
    <NavItem
    svg={gavel}
    hoverClass={styles.moderation}
    text="Moderation"
    onClick={() => {
      signIn("discord");
    }}
    />
  );
}

function SignOutMenu(_props: {}) {
  return (
    <button
      onClick={() => {
        signOut({
          callbackUrl: "http://localhost:3000/loggedOut"
        });
      }}
    >
      Sign out
    </button>
  );
}

export default Nav;
