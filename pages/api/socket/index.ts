import { NextApiRequest, NextApiResponse } from 'next'
import Socket from 'socket.io'
import { Server as HttpServer } from "http"

const connections = new Map<string, Socket.Socket>();
const listeners = new Map<string, Socket.Socket>();
const registered = new Map<string, boolean>();

const ioHandler = (_req: NextApiRequest, res: ResponseSocket) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')
    const io = new Socket.Server(res.socket.server)

    io.on('connection', (socket: Socket.Socket) => {
      socket.on('register', (id: string) => {
        const listener = listeners.get(id);
        connections.set(id, socket)
        socket.emit("registered");
        registered.set(id, true);
        listener?.emit("registered")
      })

      socket.on('callback', (id: string) => {
        const targeted = connections.get(id);
        if (targeted) {
          targeted.emit('logged_in')
          socket.emit("callbackResult", true);
        } else socket.emit("callbackResult", false);
      });

      socket.on("listen", (listenTo: string) => {
        listeners.set(listenTo, socket);

        const alreadyRegistered = registered.get(listenTo)
        if (alreadyRegistered) {
          socket.emit("registered")
          registered.delete(listenTo);
        }
      })
    })

    res.socket.server.io = io
  }

  res.send({
    error: "Expected to use WS Method"
  })
  res.end()
}

export const config = {
  api: {
    bodyParser: false
  }
}

//@ts-ignore
export interface ResponseSocket extends NextApiResponse<any> {
  socket: {
    server: ServerInterface
  }
}

export interface ServerInterface extends HttpServer {
  io: Socket.Server
}

export default ioHandler