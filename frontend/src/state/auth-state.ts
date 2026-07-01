import {User} from "../models/user";
import {jwtDecode} from "jwt-decode";
import {createStore} from "redux";

interface UserWrapper {
    user: User;
}

export class AuthState {

    user: User | null = null;
    token: string | null = null;

    constructor() {
        const tokenFromLocalStorage = localStorage.getItem("token");
        if (tokenFromLocalStorage) {
            const decoded = jwtDecode<{ exp: number } & UserWrapper>(tokenFromLocalStorage);
            if (decoded.exp * 1000 > Date.now()) {
                this.token = tokenFromLocalStorage;
                this.user = decoded.user;
            } else {
                localStorage.removeItem("token");
            }
        }
    }
}

export enum AuthActionType{
    Register = "Register",
    Login = "Login",
    Logout = "Logout",
}

export interface AuthAction {
    type: AuthActionType;
    payload: any;
}

export function authReducer(authState: AuthState = new AuthState(), action: AuthAction) {

    const newState = {...authState};

    switch (action.type) {
        case AuthActionType.Login: case AuthActionType.Register:
            const token = action.payload;
            newState.token = token;
            const userWrapper = jwtDecode<UserWrapper>(token);
            newState.user = userWrapper.user;
            localStorage.setItem("token", token);
            break;
        case AuthActionType.Logout:
            localStorage.removeItem("token");
            newState.token = null;
            newState.user = null;
            break;
    }

    return newState;
}

export const authStore = createStore(authReducer);
