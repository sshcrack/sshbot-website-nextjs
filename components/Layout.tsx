import React, { ReactNode } from 'react'
import Nav from "./Nav";
//import Link from 'next/link'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'Title not given.' }: Props) => (
  <div id={"content-wrapper"}>

    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <script src="https://kit-pro.fontawesome.com/releases/v5.12.1/js/pro.min.js" data-auto-fetch-svg=""></script>
    </Head>
    <Nav></Nav>

    <div id={"page-container"} className={"center"}>
      {children}
    </div>

    <footer>
      <span>© 2020 sshbot</span>
    </footer>
  </div>
)

export default Layout