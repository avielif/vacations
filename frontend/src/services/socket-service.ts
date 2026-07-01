import {io, Socket} from "socket.io-client";
import {appConfig} from "../utils/app-config";
import {authStore} from "../state/auth-state";

class SocketService {

    private _socket: Socket = null!;

    public connect(): void {
        if (!this._socket) {
            this._socket = io(appConfig.serverAddress, {
                auth: {
                    token: authStore.getState().token,
                }
            });
        }
    }

    public get socket () {
        return this._socket;
    }

    public disconnect(): void {
        this.socket?.disconnect();
        this._socket = null!;
    }

}

export const socketService = new SocketService();
