import Head from 'next/head';
import { parseCookies, setCookie } from 'nookies';
import React, { ReactNode } from 'react';
import { rack as rackConstructor} from "hat"
import Nav from "./Nav";
const rack = rackConstructor();

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Title not given.' }: Props) => {
  const cookie = parseCookies();

  if (!cookie?.websocketSession)
    setCookie(null, 'websocketSession', rack(), {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
      sameSite: true
    });


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
      <Nav></Nav>

      <div id={"page-container"} className={"center"}>
        {children}
      </div>

      <footer>
        <span>© 2020 sshbot</span>
      </footer>
    </div>
  </>
}

export default Layout