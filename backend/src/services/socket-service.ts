import { Server as HttpServer} from "http";
import { Server as SocketServer } from "socket.io";
import {secureService} from "./secure-service";

class SocketService {

    private _socketServer: SocketServer = null!;

    public init(httpServer: HttpServer): void {
        const options = {cors: {origin: "*"}};
        this._socketServer = new SocketServer(httpServer, options);
        this._socketServer.on("connection", (socket) => {
            const firstName = socket.handshake.query.firstName as string;
            const lastName = socket.handshake.query.lastName as string;
            const email = socket.handshake.query.email as string;
            const token = socket.handshake.auth.token;
            if (secureService.validateAdmin(token)) {
                socket.join("admin");
            }
            // console.log("Client " + firstName + " " + lastName + " has been connected!");
            console.log("Connection: " + socket.id);

            socket.on("disconnect", () => {
                console.log("Disconnected");
                this._socketServer.emit("disconnectUser");
            });

            socket.on("getUsersConnected", () => {
                this._socketServer.emit("connectUser", {firstName, lastName, email});
            });

        })


    }

    public get socketServer() {
        return this._socketServer;
    }



}

export const socketService = new SocketService();
