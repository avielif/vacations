import {io, Socket} from "socket.io-client";
import {appConfig} from "../utils/app-config";
import {authStore} from "../state/auth-state";

class SocketService {

    private _socket: Socket = null!;

    public connect(): void {
        if (!this._socket) {
            this._socket = io(appConfig.serverAddress, {
                query: {
                    firstName: authStore.getState().user?.firstName,
                }
            });
        }
    }

    public get socket () {
        return this._socket;
    }

}

export const socketService = new SocketService();
