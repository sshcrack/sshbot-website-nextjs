import { Session, signOut, useSession } from "next-auth/client";
import { openLoginWindow } from 'pages';
import { isNull } from 'utils/tools';
import gavel from "../assets/svg/gavel.svg";
import music from "../assets/svg/music.svg";
import economy from "../assets/svg/sack-dollar.svg";
import signInSVG from "../assets/svg/sign-in.svg";
import signOutSVG from "../assets/svg/sign-out.svg";
import styles from "../styles/nav.module.scss";
import BotIcon from './BotIcon';
import NavItem from "./NavItem";

const Nav = () => {
  const [session] = useSession();
  return (
    <header className={styles.navHeader}>
      <BotIcon />

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
  session: Session;
}

function CheckLoggedIn(props: SignInOutProps) {
  return isNull(props.session) ? <SignInMenu /> : <SignOutMenu />;
}

function SignInMenu(_props: {}) {
  return (
    <NavItem
    svg={signInSVG}
    hoverClass={styles.signIn}
    text="Sign In"
    onClick={() => {
      openLoginWindow()
    }}
    />
  );
}

function SignOutMenu(_props: {}) {
  return (
    <NavItem
    svg={signOutSVG}
    hoverClass={styles.signOut}
    text="Sign Out"
    onClick={() => {
      signOut().then(() => location.pathname = "/loggedOut");
    }}
    />
  );
}

export default Nav;
