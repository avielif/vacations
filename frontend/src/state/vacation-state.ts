import {createStore} from "redux";
import {Vacation} from "../models/vacation";

export class VacationState {
    vacationList: Vacation[] = [];
    vacationCount: number = 0;
}

export enum VacationActionType{
    GetVacationList = "GetVacationList",
    AddVacation = "AddVacation",
    UpdateVacation = "UpdateVacation",
    DeleteVacation = "DeleteVacation",
    GetVacationsCount = "GetVacationsCount",
    AddFollower = "AddFollower",
    DeleteFollower = "DeleteFollower",
}

export interface VacationAction {
    type: VacationActionType;
    payload: any;
}

export function vacationReducer(vacationState: VacationState = new VacationState(), action: VacationAction) {

    const newState: VacationState = {...vacationState};
    newState.vacationList = [...newState.vacationList];

    switch (action.type) {
        case VacationActionType.GetVacationList:
            newState.vacationList = action.payload;
            break;
        case VacationActionType.AddVacation:
            newState.vacationList.push(action.payload);
            break;
        case VacationActionType.UpdateVacation:
            const indexToUpdate = newState.vacationList.findIndex((item) => item.id === action.payload.id);
            newState.vacationList[indexToUpdate] = action.payload;
            break;
        case VacationActionType.DeleteVacation:
            const indexToDelete = newState.vacationList.findIndex((item) => item.id === action.payload);
            newState.vacationList.splice(indexToDelete, 1);
            break;
        case VacationActionType.GetVacationsCount:
            newState.vacationCount = action.payload;
            break;
        case VacationActionType.AddFollower:
            const indexToAddFollower = newState.vacationList.findIndex((item) => item.id === action.payload);
            newState.vacationList[indexToAddFollower].numberOfFollowers = newState.vacationList[indexToAddFollower].numberOfFollowers! + 1;
            break;
        case VacationActionType.DeleteFollower:
            const indexToDeleteFollower = newState.vacationList.findIndex((item) => item.id === action.payload);
            newState.vacationList[indexToDeleteFollower].numberOfFollowers = newState.vacationList[indexToDeleteFollower].numberOfFollowers! - 1;
            break;
    }

    return newState;
}

export const vacationStore = createStore(vacationReducer);
