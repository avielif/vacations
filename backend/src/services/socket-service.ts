import { Server as HttpServer} from "http";
import { Server as SocketServer } from "socket.io";
import {secureService} from "./secure-service";
import {jwtDecode} from "jwt-decode";

class SocketService {

    private _socketServer: SocketServer = null!;
    private _connectedUsers: any[] = [];

    public init(httpServer: HttpServer): void {
        const options = {cors: {origin: "*"}};
        this._socketServer = new SocketServer(httpServer, options);
        this._socketServer.on("connection", (socket) => {
            const token = socket.handshake.auth.token;
            const user = token ? jwtDecode<{ user: any }>(token).user : null;
            if (secureService.validateAdmin(token)) {
                socket.join("Admin");
            }
            console.log("Connection: " + socket.id);

            socket.on("disconnect", () => {
                if (user) {
                    this._connectedUsers = this._connectedUsers.filter(u => String(u.id) !== String(user.id));
                }
                this._socketServer.emit("disconnectUser", user);
            });

            if (user) {
                if (!this._connectedUsers.find(u => String(u.id) === String(user.id!))) {
                    this._connectedUsers.push(user);
                    this._socketServer.to("Admin").emit("connectUser", user);
                }
            }

            socket.on("getUsersConnected", () => {
                socket.emit("getUsersConnected", this._connectedUsers);
            });
        })
    }

    public get socketServer() {
        return this._socketServer;
    }

}

export const socketService = new SocketService();
