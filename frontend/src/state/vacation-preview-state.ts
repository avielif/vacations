import { createStore } from "redux";
import { Vacation } from "../models/vacation";

export enum PreviewActionType {
    Show = "Show",
    Hide = "Hide",
}

export interface PreviewState {
    vacation: Vacation | null;
}

function previewReducer(state: PreviewState = { vacation: null }, action: any): PreviewState {
    switch (action.type) {
        case PreviewActionType.Show: return { vacation: action.payload };
        case PreviewActionType.Hide: return { vacation: null };
        default: return state;
    }
}

export const previewStore = createStore(previewReducer);
