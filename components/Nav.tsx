import { session, signIn, signOut, useSession } from "next-auth/client";
import gavel from "../assets/svg/gavel.svg";
import music from "../assets/svg/music.svg";
import economy from "../assets/svg/sack-dollar.svg";
import styles from "../styles/nav.module.scss";
import NavItem from "./NavItem";
import Link from 'next/link';

const Nav = () => {
  const [session, loading] = useSession();
  return (
    <header className={styles.navHeader}>
      <Link href="/">
        <a>
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
      </ul>

      <SignInOut session={session} loading={loading}></SignInOut>
    </header>
  );
};

interface SignInOutProps {
  session: session;
  loading: boolean;
}

function SignInButton(_props: {}) {
  return (
    <button
      onClick={() => {
        signIn();
      }}
    >
      Sign in
    </button>
  );
}

function SignOutButton(_props: {}) {
  return (
    <button
      onClick={() => {
        signOut();
      }}
    >
      Sign out
    </button>
  );
}

function SignInOut(props: SignInOutProps) {
  return isNull(props.session) ? <SignInButton /> : <SignOutButton />;
}

export default Nav;

function isNull(obj: any) {
  return obj === undefined || obj === null;
}