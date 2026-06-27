import {User} from "../models/user";
import {createStore} from "redux";

export class UserState {
    userList: User[] = [];
}

export enum UserActionType{
    GetUserList = "GetUserList",
    AddUser = "AddUser",
    RemoveUser = "RemoveUser",
}

export interface UserAction {
    type: UserActionType;
    payload: any;
}

export function userReducer(userState: UserState = new UserState(), action: UserAction) {

    const newState: UserState = {...userState};
    newState.userList = [...newState.userList];

    switch (action.type) {
        case UserActionType.GetUserList:
            newState.userList = action.payload;
            break;
        case UserActionType.AddUser:
            newState.userList.push(action.payload);
            break;
        case UserActionType.RemoveUser:
            const indexToDelete = newState.userList.findIndex((item) => item.id === action.payload);
            newState.userList.splice(indexToDelete, 1);
            break;
    }

    return newState;
}

export const userStore = createStore(userReducer);
