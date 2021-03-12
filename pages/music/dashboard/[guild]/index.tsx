import { MusicLayout, QueueList } from 'components/MusicLayout';
import { useRouter } from 'next/router';
import { Dispatch, useState } from 'react';
import ioClient from "socket.io-client";
import Layout from '../../../../components/Layout';
import { MusicData, QueueResult } from '../../../../interfaces/musicEvents';
import swal from "sweetalert2"

const IndexPage = () => {
  const router = useRouter();
  const { guild } = router.query;
  const [socket, setSocket] = useState<typeof ioClient.Socket>()
  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState<QueueResult>();
  if (!guild) return <></>;

  if (!socket && typeof location !== "undefined" && !loading) {
    fetch('/api/socket').finally(() => {
      const client = ioClient()
      client.on("connect", () => {
        console.log("Connected. Emitting guildID Event")
        console.log("Guild", guild)
        client.emit("guildID", guild);
        client.on("result", (res: MusicData) => {
          console.log(res)
          if (!res) return;
          if (res.state === "guildID")
            setSocket(client)
        })
        client.on("queueInfo", (...data: any) => console.log("Queue", ...data))
        refresh(client, setQueue);
      })
    });

    setLoading(true);
  }
  if (!socket)
    return <Layout title="Music Dashboard | ecomody">
      <h1>Connecting to websocket</h1>
    </Layout>

  return <Layout title="Music Dashboard | ecomody">
    <MusicLayout>
      <QueueList queue={queue} refresh={() => refresh(socket, queue => setQueue(queue))}>

      </QueueList>
    </MusicLayout>
  </Layout>
}

function refresh(socket: SocketIOClient.Socket, setQueue: Dispatch<QueueResult>) {
  socket.on("result", (data: SocketQueueResponse) => {
    if (data.state !== "getQueue") return;

    if (data.error || typeof data.result === "string") {
      return swal.fire({
        title: "An error occurred while refreshing",
        icon: "error",
        text: data.info ?? "No information available.",
      });
    }

    setQueue(data.result)
  })
  socket.emit("getQueue")
}


export interface SocketQueueResponse extends MusicData {
  result: QueueResult | string
}
export default IndexPage