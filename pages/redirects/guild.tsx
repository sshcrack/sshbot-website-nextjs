import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import io from "socket.io-client";

let socket: SocketIOClient.Socket;
const clientID = process.env.CLIENT_ID;

function SocketPage() {
  const [data, setData] = useState<Data>({
    data: "Connecting...",
    emitted: false
  });
  const cookies = parseCookies();

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (!data?.emitted) {
      fetch('/api/socket').finally(() => {
        socket = io()

        socket.on('connect', () => {
          setData({
            emitted: true,
            connected: true,
            data: "Waiting for registration..."
          });
        })

        socket.on('disconnect', () => {
          setData({
            emitted: true,
            data: "Disconnected. Please reload this window"
          })
        })

        socket.on("registered", () => {
          console.log("Registered")
          setData({
            emitted: true,
            connected: false,
            data: `Registered. Redirecting...`,
            registered: true
          })
        })
      })
    }
  })

  if (data?.connected) socket?.emit("listen", cookies.botSession)
  if (data?.registered && typeof window !== "undefined")
    window.location.href = `https://discord.com/oauth2/authorize?client_id=${clientID}&scope=bot&permissions=8&response_type=code&redirect_uri=http://localhost:3000/redirects/close?mode=bot&guild_id=${id}&disable_guild_select=true`

  return <>
    <h1>{data?.data}</h1>
  </>
}

interface Data {
  emitted: boolean,
  data: string,
  connected?: boolean,
  registered?: boolean;
}

export default SocketPage;