import {User} from "../models/user";
import axios, {AxiosError} from "axios";
import {appConfig} from "../utils/app-config";
import {UserCredentials} from "../models/user-credentials";
import {AuthActionType, authStore} from "../state/auth-state";
import {RoleId} from "../models/enums";
import {vacationSocketService} from "./vacation-socket-service";
import {userSocketService} from "./user-socket-service";
import {socketService} from "./socket-service";
import {UserActionType, userStore} from "../state/user-state";

class AuthService {

    public async register(user: User): Promise<void> {
        try {
            user.roleId = RoleId.User;
            const response = await axios.post(appConfig.apiAddress + "auth/register", user);
            authStore.dispatch({type: AuthActionType.Register, payload: response.data.token});

            const registeredUser = authStore.getState().user!;
            userStore.dispatch({type: UserActionType.AddUser, payload: registeredUser});

            // socketService.connect();
        }
        catch(err) {
            const myErr = err as AxiosError<{ error: string }>;
            throw new Error(myErr.response?.data?.error ?? "Registration failed");
        }
    }

    public async login(userCredentials: UserCredentials): Promise<void> {
        try {
            const response = await axios.post(appConfig.apiAddress + "auth/login", userCredentials);
            authStore.dispatch({type: AuthActionType.Login, payload: response.data.token});

            const user = authStore.getState().user!;
            userStore.dispatch({type: UserActionType.AddUser, payload: user});

            // socketService.connect();
            // vacationSocketService.vacationAdded();
            // vacationSocketService.vacationDeleted();
            // socketService.connect();         // reconnect socket after login
            // userSocketService.usersConnected();
        }
        catch(err) {
            const myErr = err as AxiosError<{ error: string }>;
            throw new Error(myErr.response?.data?.error ?? "Login failed");
        }
    }

    // public init(): void {
    //     if (authStore.getState().token) {
    //         vacationSocketService.vacationAdded();
    //         vacationSocketService.vacationDeleted();
    //         vacationSocketService.vacationUpdated();
    //     }
    // }

}

export const authService = new AuthService;
