import {User} from "../models/user";
import axios, {AxiosError} from "axios";
import {appConfig} from "../utils/app-config";
import {UserCredentials} from "../models/user-credentials";
import {AuthActionType, authStore} from "../state/auth-state";
import {RoleId} from "../models/enums";
import {vacationSocketService} from "./vacation-socket-service";

class AuthService {

    public async register(user: User): Promise<void> {
        try {
            user.roleId = RoleId.User;
            const response = await axios.post(appConfig.apiAddress + "auth/register", user);
            authStore.dispatch({type: AuthActionType.Register, payload: response.data.token});
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
            vacationSocketService.vacationAdded();
            vacationSocketService.vacationDeleted();
        }
        catch(err) {
            const myErr = err as AxiosError<{ error: string }>;
            throw new Error(myErr.response?.data?.error ?? "Login failed");
        }
    }

    public init(): void {
        if (authStore.getState().token) {
            vacationSocketService.vacationAdded();
            vacationSocketService.vacationDeleted();
        }
    }

}

export const authService = new AuthService;
