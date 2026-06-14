import { Server as HttpServer} from "http";
import { Server as SocketServer } from "socket.io";

class SocketService {

    private _socketServer: SocketServer = null!;

    public init(httpServer: HttpServer): void {
        const options = {cors: {origin: "*"}};
        this._socketServer = new SocketServer(httpServer, options);
        this._socketServer.on("connection", (socket) => {
            const firstName = socket.handshake.query.firstName as string;
            socket.join(firstName);
            console.log("Client " + firstName + " has been connected!");
        })

    }

    public get socketServer() {
        return this._socketServer;
    }

}

export const socketService = new SocketService();
