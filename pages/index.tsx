import React, { useEffect, useState } from 'react';
import Discord from "../assets/svg/discordGradientVars.svg";
import Dashboard from "../assets/svg/toDashboard.svg";
import ConsoleText from '../components/ConsoleText';
import Layout from '../components/Layout';
import styles from "../styles/index.module.scss";
import io from "socket.io-client"
import { parseCookies } from 'nookies';
import { useSession } from 'next-auth/client';

const IndexPage = () => {
  const [session] = useSession();
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (typeof location === "undefined" || fetching) return;

    setFetching(true);
    fetch(`${window.location.protocol}//${window.location.host}/api/discord/refreshSession`).then(async res => {
      const json = await res.json().catch(() => { });
      if (json?.refreshed) location.reload();
    })
  });

  const button = session ?
    <button className={`${styles.basicActionButton} ${styles.dashboardButton}`} onClick={() => toDashboard()}>
        <Dashboard />
    </button>
    :
    <button className={`${styles.basicActionButton} ${styles.joinButton}`} onClick={() => openLoginWindow()}>
      <Discord />
    </button>

  return (
    <Layout title="Home | sshbot">
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <h1>A bot for&nbsp;</h1>
          <ConsoleText type="h1" keepMiddle={true} inputClass={styles.consoleInput} sharedClass={styles.console} text={[
            {
              rules: {
                "background-image": "linear-gradient( 106.4deg,  rgba(255,104,192,1) 11.1%, rgba(104,84,249,1) 81.3% )"
              },
              name: "Music"
            },
            {
              rules: {
                "background-image": "radial-gradient( circle farthest-corner at 10% 20%,  rgba(253,193,104,1) 0%, rgba(251,128,128,1) 90% )",

              },
              name: "Economy"
            },
            {
              rules: {
                "background-image": "linear-gradient( 109.6deg,  rgba(255,194,48,1) 11.2%, rgba(255,124,0,1) 100.2% )",
              },
              name: "Moderation"
            }
          ]} />
        </div>

        <div className={styles.buttonWrapper}>
          {button}
        </div>
      </div >
    </Layout >
  )
}

export const openLoginWindow = () => {
  fetch('/api/socket').finally(() => {
    const cookies = parseCookies();
    const socket = io()

    socket.on('connect', () =>
      socket.emit("register", cookies.websocketSession)
    )

    socket.on("logged_in", () => {
      if (typeof window !== "undefined") window.location.pathname = "/dashboard";
    })
  })

  if (typeof window !== "undefined") newWindow(`${location.protocol}//${location.host}/redirects/login`);
}

export const toDashboard = () => {
  if (typeof window !== "undefined") window.location.pathname = "/dashboard"
}


export const openJoinWindow = (guild: string) => {
  fetch('/api/socket').finally(() => {
    const cookies = parseCookies();
    const socket = io()

    socket.on('connect', () =>
      socket.emit("register", cookies.botSession)
    )

    socket.on("logged_in", () => {
      if (typeof window !== "undefined") window.location.pathname = `/dashboard/${guild}`;
    })
  })

  if (typeof window !== "undefined") newWindow(`${location.protocol}//${location.host}/redirects/guild?id=${guild}`);
}


export const newWindow = (url: string, width = 500, height = 777) => {
  return window.open(url, 'newwindow', `width=${width}, height=${height}`);
}

export default IndexPage