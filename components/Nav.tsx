import { customSession } from 'interfaces/customDiscordProvider';
import { Session, useSession } from "next-auth/client";
import { openLoginWindow } from 'pages';
import { isNull } from 'utils/tools';
import gavel from "../assets/svg/gavel.svg";
import music from "../assets/svg/music.svg";
import economy from "../assets/svg/sack-dollar.svg";
import signInSVG from "../assets/svg/sign-in.svg";
import Caret from "../assets/svg/caret.svg";
import styles from "../styles/nav.module.scss";
import BotIcon from './BotIcon';
import { DropdownItem, DropdownMenu } from './DropdownMenu';
import NavItem from "./NavItem";
import { Component, createRef } from 'react';

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
  return isNull(props.session) ? <SignInMenu /> : <SignOutMenu session={(props.session as any) as customSession} />;
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

class SignOutMenu extends Component<signOutProps> {
  private session: customSession;
  private menu = createRef<DropdownMenu>()

  constructor(props: signOutProps) {
    super(props)
    this.session = props.session;
  }

  private handleClick() {
    this.menu.current?.toggleEnabled();
  }

  render() {
    return <div className={styles.profileDropdown} onClick={() => this.handleClick()}>
      <img src={this.session.user.image} alt={"User-Avatar"} />
      <span>{this.session.user.name}</span>
      <Caret className={styles.caret} />
      <DropdownMenu ref={this.menu}>
      <DropdownItem>
          Dashboard
        </DropdownItem>
        <DropdownItem>
          Sign out
        </DropdownItem>
      </DropdownMenu>
    </div>
  }
}

interface signOutProps {
  session: customSession
}

export default Nav;
