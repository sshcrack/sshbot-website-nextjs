import Head from 'next/head';
import { parseCookies, setCookie } from 'nookies';
import React, { CSSProperties, ReactNode } from 'react';
import hat from "hat"
import Nav from "./Nav";
const rack = hat.rack();

type Props = {
  children?: ReactNode
  title?: string,
  nav?: JSX.Element,
  style?: CSSProperties
}

const Layout = ({ children, title = 'Title not given.', nav: customNav, style = {} }: Props) => {
  const cookie = parseCookies();

  if (!cookie?.websocketSession)
    setCookie(null, 'websocketSession', rack(), {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      sameSite: true
    });

  if (!cookie?.botSession)
    setCookie(null, 'botSession', rack(), {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      sameSite: true
    });

  const Cnav = customNav ? customNav : <Nav></Nav>
  return <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:title" content="sshbot" />
      <meta property="og:url" content="https://sshbot.ddnss.de" />
      <meta property="og:image" content="https://sshbot.ddnss.de/imgs/og_image.png" />
    </Head>

    <div id={"content-wrapper"}>
      {Cnav}

      <div id={"page-container"} className={"center"} key={hat()} style={style}>
        {children}
      </div>

      <footer>
        <span>© 2021 sshbot</span>
      </footer>
    </div>
  </>
}

export default Layout