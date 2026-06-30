import {socketService} from "./socket-service";
import {UserActionType, userStore} from "../state/user-state";
import {User} from "../models/user";

class UserSocketService {

    public usersConnected() {
        socketService.socket.on("connectUser", (user) => {
            console.log("connectUser event received:", user);
            userStore.dispatch({type: UserActionType.AddUser, payload: user});
        })

        socketService.socket.on("disconnectUser", (user) => {
            userStore.dispatch({type: UserActionType.RemoveUser, payload: user.id});
        })
    }

    public getUsersConnected() {
        const socket = socketService.socket;
        if (socket.connected) {
            socket.emit("getUsersConnected");
        } else {
            socket.once("connect", () => {
                socket.emit("getUsersConnected");
            });
        }
        socket.once("getUsersConnected", (users: User[]) => {
            userStore.dispatch({ type: UserActionType.GetUserList, payload: users });
        });
    }

}

export const userSocketService = new UserSocketService();
