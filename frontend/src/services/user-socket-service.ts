import {socketService} from "./socket-service";
import {UserActionType, userStore} from "../state/user-state";
import {User} from "../models/user";

class UserSocketService {

    public usersConnected() {
        socketService.socket.on("connectUser", (user) => {
            userStore.dispatch({type: UserActionType.AddUser, payload: user});
        })

        socketService.socket.on("disconnectUser", (user) => {
            userStore.dispatch({type: UserActionType.RemoveUser, payload: user});
        })
    }

    public getUsersConnected() {
        socketService.socket.emit("getUsersConnected");
    }

}

export const userSocketService = new UserSocketService();
