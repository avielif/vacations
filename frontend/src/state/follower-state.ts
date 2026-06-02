import {createStore} from "redux";
import {Follower} from "../models/follower";

export class FollowerState {
    followerList: Follower[] = [];
}

export enum FollowerActionType{
    GetFollowerList = "GetFollowerList",
    AddFollower = "AddFollower",
    DeleteFollower = "DeleteFollower",
    LogoutFollower = "LogoutFollower",
}

export interface FollowerAction {
    type: FollowerActionType;
    payload: any;
}

export function followerReducer(followerState: FollowerState = new FollowerState(), action: FollowerAction) {

    const newState: FollowerState = {...followerState};
    newState.followerList = [...newState.followerList];

    switch (action.type) {
        case FollowerActionType.GetFollowerList:
            newState.followerList = action.payload;
            break;
        case FollowerActionType.AddFollower:
            newState.followerList.push(action.payload);
            break;
        case FollowerActionType.DeleteFollower:
            const indexToDelete = newState.followerList.findIndex((item) => item.userId === action.payload.userId && item.vacationId === action.payload.vacationId);
            newState.followerList.splice(indexToDelete, 1);
            break;
        case FollowerActionType.LogoutFollower:
            newState.followerList = [];
            break;
    }

    return newState;
}

export const followerStore = createStore(followerReducer);
