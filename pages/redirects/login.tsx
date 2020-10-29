import { signIn } from 'next-auth/client';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import io from "socket.io-client"

let socket: SocketIOClient.Socket;

function SocketPage() {

  const [data, setData] = useState<Data>({
    data: "Connecting...",
    emitted: false
  });
  const cookies = parseCookies();

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

  if(data?.connected) socket?.emit("listen", cookies.websocketSession)
  if (data?.registered && typeof window !== "undefined") signIn("discord", { redirect: true })

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