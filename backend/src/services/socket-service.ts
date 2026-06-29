import { Server as HttpServer} from "http";
import { Server as SocketServer } from "socket.io";
import {secureService} from "./secure-service";
import {RoleId, StatusCode} from "../models/enums";
import {jwtDecode} from "jwt-decode";

class SocketService {

    private _socketServer: SocketServer = null!;
    private _connectedUsers: any[] = [];

    public init(httpServer: HttpServer): void {
        const options = {cors: {origin: "*"}};
        this._socketServer = new SocketServer(httpServer, options);
        this._socketServer.on("connection", (socket) => {
            // const firstName = socket.handshake.query.firstName as string;
            // const lastName = socket.handshake.query.lastName as string;
            // const email = socket.handshake.query.email as string;
            // const roleId = socket.handshake.query.roleId as string;
            // const role = +roleId === 2 ? "User" : +roleId === 1 ? "Admin" : "";
            const token = socket.handshake.auth.token;
            const user = token ? jwtDecode<{ user: any }>(token).user : null;
            if (secureService.validateAdmin(token)) {
                socket.join("Admin");
            }
            console.log("Connection: " + socket.id);

            socket.on("disconnect", () => {
                // this._socketServer.emit("disconnectUser", user);
                // console.log("Disconnected");
                if (user) {
                    this._connectedUsers = this._connectedUsers.filter(u => u.id !== user.id);
                }
                this._socketServer.emit("disconnectUser", user);
            });

            if (user) {
                this._connectedUsers.push(user);
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
