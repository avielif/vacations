import {io, Socket} from "socket.io-client";
import {appConfig} from "../utils/app-config";
import {authStore} from "../state/auth-state";

class SocketService {

    private _socket: Socket = null!;

    public connect(): void {
        if (!this._socket) {
            this._socket = io(appConfig.serverAddress, {
                // query: {
                //     firstName: authStore.getState().user?.firstName,
                //     lastName: authStore.getState().user?.lastName,
                //     email: authStore.getState().user?.email,
                //     roleId: authStore.getState().user?.roleId,
                // },
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
