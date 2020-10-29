import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket: SocketIOClient.Socket;

function SocketPage() {
  const [data, setData] = useState<Data>();
  const cookies = parseCookies();

  useEffect(() => {
    if (!data?.emitted) {
      fetch('/api/socket').finally(() => {
        socket = io()

        socket.on('connect', () => {
          setData({
            emitted: true,
            connected: true,
            data: "Connected"
          });
        })

        socket.on('disconnect', () => {
          setData({
            emitted: true,
            data: "Disconnected"
          })
        })

        socket.on("callbackResult", (res: boolean) => {
          setData({
            emitted: true,
            connected: false,
            data: `Callback ${res ? "sent" : "error"}`,
            finished: true
          })
        })
      })
    }
  })

  if(data?.connected) socket?.emit("callback", cookies.websocketSession)
  if (data?.finished && typeof window !== "undefined") window.close();

  return <>
    <h1>{data?.data}</h1>
  </>
}

interface Data {
  emitted: boolean,
  data: string,
  connected?: boolean,
  finished?: boolean;
}

export default SocketPage;