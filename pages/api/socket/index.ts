import { NextApiRequest, NextApiResponse } from 'next'
import Socket from 'socket.io'
import client from "socket.io-client";
import { Server as HttpServer } from "http"
import { State } from 'interfaces/musicEvents';

const connections = new Map<string, Socket.Socket>();
const listeners = new Map<string, Socket.Socket>();
const registered = new Map<string, boolean>();

const { BOT_URI } = process.env;
if (typeof BOT_URI !== "string") {
  console.log("No Bot URI set")
  process.exit(-1)
}

const bot = client(BOT_URI as string);
bot.on("error", (error: Error) => console.log("Error", error))
bot.on("reconnect", (attempt: number) => console.log("Reconnected with attempt", attempt))
bot.on("ping", () => console.log("Bot Ping"))
bot.on("reconnect_attempt", (attempt: number) => console.log("Reconnecting with attempt", attempt))

const ioHandler = (_req: NextApiRequest, res: ResponseSocket) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')
    const io = new Socket.Server(res.socket.server)
    const events: State[] = ['getQueue', 'queueInfo', 'result', 'setPaused', 'startListening', 'stopListening', 'getPlaying', 'guildID'];

    io.on('connection', (socket: Socket.Socket) => {
      console.log("IO Connection")
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

      events.forEach(event => {
        socket.on(event, (...args) => {
          bot.emit(event, ...args)
        })
        bot.on(event, (...args: any) => socket.emit(event, ...args));
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