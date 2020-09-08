import Head from 'next/head';
import React, { ReactNode } from 'react';
import Nav from "./Nav";

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Title not given.' }: Props) => (
  <div>
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
  </div>
)

export default Layout