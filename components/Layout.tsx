import React, { ReactNode } from 'react'
import Link from 'next/link'
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
    </Head>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
      </nav>
    </header>

    <div id={"page-container"} className={"center"}>
      {children}
    </div>

    <footer>
      <span>© 2020 sshbot</span>
    </footer>
  </div>
)

export default Layout
