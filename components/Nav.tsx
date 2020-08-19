import styles from "../styles/nav.module.scss"
import NavItem from "./NavItem"
import gavel from "../assets/svg/gavel.svg";
import anime from "animejs"
import { signIn, signOut, useSession, Session } from "next-auth/client"
import SingleText from "./SingleText";
import Link from "next/link";
import { MouseEvent, CSSProperties } from "react";

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
              <NavItem svg={gavel} hoverClass={styles.moderation} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <SingleText text="Moderation" type="span" animClass={styles.moderationAnim} className={styles.singleText} />
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

interface animateProp {
  [key: string]: string
}

function getAnimation(element: Element, toAnimate: animateProp) {
  return anime({
    targets: element.children,
    direction: 'alternate',
    delay: function (_el, i, _l) {
      return i * 25
    },
    duration: 500,
    loop: false,
    easing: 'easeInOutExpo',
    ...toAnimate
  })
}

function handleMouseEnter(event: MouseEvent<HTMLDivElement>) {
  let singleText = event.currentTarget.querySelector(`div div`);
  console.log("SingleText", singleText);
  if (singleText === null) return;

  let animClassName = singleText.getAttribute("data-animclass")
  if (animClassName === null) return;

  console.log("Continue 2");
  

  let rules = getStyle(`.${animClassName}`, singleText);

  console.log("Rules", rules);
  

  if (rules === undefined) return


  let animation = getAnimation(singleText, rules);

  animation?.play();
}

function handleMouseLeave(event: MouseEvent<HTMLDivElement>) {
  let singleText = event.currentTarget.querySelector(`div div`);
  if (singleText === null) return;

  let normalClass = singleText.getAttribute("data-normalclass")
  if (normalClass === null) return;

  let rules = getStyle(`.${normalClass}`, singleText);

  console.log("Rules", rules);
  

  if (rules === undefined) return


  let animation = getAnimation(singleText, rules);

  animation?.play();
}

interface customStyle extends CSSProperties {
  [key: number]: string,
  [key: string]: any,
  length: number
}

function getStyle(selector: string, element ?: Element): { [key: string]: string } | undefined {
  let stylesheets = document.styleSheets;
  let style: customStyle | undefined = undefined;

  for (let i = 0; i < stylesheets.length; i++) {
    let stylesheet = stylesheets.item(i);

    if (stylesheet === null) continue;

    for (let i = 0; i < stylesheet.cssRules.length; i++) {
      
      let rule: any = stylesheet.cssRules.item(i);
      if (selector === rule.selectorText) {
        style = rule.style;
      }
    }
  }

  
  if (style === undefined) return;

  let rules: { [key: string]: string } = {};

  for (let i = 0; i < style.length; i++) {
    let ruleName: string = style[i];
    let anyValue = style[ruleName];
    let value = ("" + anyValue).split(" ").join("")
    console.log(value);
    

    if (value.startsWith("var(") && value.endsWith(")")) {
      value = value.replace("var(", "").replace(")", "");

      console.log("Getting name", value);

      console.log("Element is", element);

      value = getCSSVar(value, element);
    }

    value = value.split(" ").join("");

    rules[ruleName] = value;
  }

  return rules;
}

function getCSSVar(Var: string, style: Element = document.body) {
  return getComputedStyle(style)
    .getPropertyValue(Var);
}
