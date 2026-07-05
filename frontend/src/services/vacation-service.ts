import {Vacation} from "../models/vacation";
import axios, {AxiosError} from "axios";
import {appConfig} from "../utils/app-config";
import {VacationActionType, vacationStore} from "../state/vacation-state";
import {authStore} from "../state/auth-state";

class VacationService {

    isFetched: boolean = false;
    isCountFetched: boolean = false;
    isFollowedCountFetched: boolean = false;

    public async addVacation(vacation: Vacation): Promise<Vacation> {
        const formData = new FormData();
        formData.append("vacation", JSON.stringify(vacation));
        formData.append("image", vacation.image![0]);
        try {
            const response = await axios.post<Vacation>(appConfig.apiAddress + "vacation", formData, {headers: {Authorization: "Bearer " + authStore.getState().token}});
            if (!vacationStore.getState().vacationList.find(vacation => vacation.id === response.data.id)) {
                vacationStore.dispatch({type: VacationActionType.AddVacation, payload: response.data});
            }
            return response.data;
        }

        catch(error) {
            console.log("error in addVacation", error);
            throw error;
        }
    }

    public async getVacationList(offset: number, forceFetch: boolean = false): Promise<Vacation[]> {
        if (!this.isFetched || forceFetch) {
            try {
                const response = await axios.get<Vacation[]>(appConfig.apiAddress + "vacations?offset=" + offset, {headers: {Authorization: "Bearer " + authStore.getState().token}});
                this.isFetched = true;
                vacationStore.dispatch({type: VacationActionType.GetVacationList, payload: response.data});
                return response.data;
            } catch (error) {
                console.log("error from getVacationList", error);
                throw error;
            }
        }
        return vacationStore.getState().vacationList;
    }

    public async getVacationsCount(): Promise<number> {
            try {
                const response = await axios.get<{count: number}>(appConfig.apiAddress + "vacations/count", {headers: {Authorization: "Bearer " + authStore.getState().token}});
                this.isCountFetched = true;
                vacationStore.dispatch({type: VacationActionType.GetVacationsCount, payload: response.data.count});
                return response.data.count;
            } catch (error) {
                console.log("error from getVacationsCount", error);
                throw error;
            }
    }

    public async updateVacation(vacation: Vacation): Promise<void> {
        const formData = new FormData();
        formData.append("vacation", JSON.stringify(vacation));
        if (vacation.image && vacation.image[0] instanceof File) {
            formData.append("image", vacation.image[0]);
        }
        try {
            await axios.put<Vacation>(appConfig.apiAddress + "vacation/" + vacation.id, formData, {headers: {Authorization: "Bearer " + authStore.getState().token}});
            vacationStore.dispatch({type: VacationActionType.UpdateVacation, payload: vacation});
        }
        catch(error) {
            console.log("error from updateVacation", error);
            throw error;
        }
    }

    public async getSingleVacation(id: number): Promise<Vacation> {
        try {
            const response = await axios.get<Vacation>(appConfig.apiAddress + "vacation/" + id, {headers: {Authorization: "Bearer " + authStore.getState().token}});
            return response.data;
        }
        catch (error) {
            console.log("error from getSingleVacation", error);
            const myErr = error as AxiosError<{ error: string }>;
            console.log(myErr.response);
            throw new Error(myErr.response?.data?.error ?? "getSingleVacation failed");
        }
    }

    public async deleteVacation(id: number): Promise<void> {
        try {
            await axios.delete<Vacation>(appConfig.apiAddress + "vacation/" + id, {headers: {Authorization: "Bearer " + authStore.getState().token}});
            vacationStore.dispatch({type: VacationActionType.DeleteVacation, payload: id});
        }
        catch (error) {
            console.log("error from deleteVacation", error);
            throw error;
        }
    }

    public async getFollowedVacationsCountByUserId(userId: number): Promise<number> {
            try {
                const response = await axios.get<{count: number}>(appConfig.apiAddress + "vacations/followed/count?userId=" + userId, {headers: {Authorization: "Bearer " + authStore.getState().token}});
                this.isFollowedCountFetched = true;
                vacationStore.dispatch({type: VacationActionType.GetVacationsCount, payload: response.data.count});
                return response.data.count;
            } catch (error) {
                console.log("error from getFollowedVacationsCountByUserId", error);
                throw error;
            }
    }

    public async getFollowedVacationsListByUserId(userId: number, offset: number): Promise<Vacation[]> {
        try {
            const response = await axios.get<Vacation[]>(appConfig.apiAddress + "vacations/followed?userId=" + userId + "&offset=" + offset, {headers: {Authorization: "Bearer " + authStore.getState().token}});
            vacationStore.dispatch({type: VacationActionType.GetVacationList, payload: response.data});
            return response.data;
        } catch (error) {
            console.log("error from getFollowedVacationsListByUserId", error);
            throw error;
        }
    }

    public async getFutureVacationsCount(): Promise<number> {
        try {
            const response = await axios.get<{count: number}>(appConfig.apiAddress + "vacations/future/count", {headers: {Authorization: "Bearer " + authStore.getState().token}});
            this.isCountFetched = true;
            vacationStore.dispatch({type: VacationActionType.GetVacationsCount, payload: response.data.count});
            return response.data.count;
        } catch (error) {
            console.log("error from getFutureVacationsCount", error);
            throw error;
        }
    }

    public async getFutureVacationsList(offset: number): Promise<Vacation[]> {
        try {
            const response = await axios.get<Vacation[]>(appConfig.apiAddress + "vacations/future?offset=" + offset, {headers: {Authorization: "Bearer " + authStore.getState().token}});
            this.isFetched = true;
            vacationStore.dispatch({type: VacationActionType.GetVacationList, payload: response.data});
            return response.data;
        } catch (error) {
            console.log("error from getFutureVacationsList", error);
            throw error;
        }
    }

    public async getActiveVacationsCount(): Promise<number> {
        try {
            const response = await axios.get<{count: number}>(appConfig.apiAddress + "vacations/active/count", {headers: {Authorization: "Bearer " + authStore.getState().token}});
            this.isCountFetched = true;
            vacationStore.dispatch({type: VacationActionType.GetVacationsCount, payload: response.data.count});
            return response.data.count;
        } catch (error) {
            console.log("error from getActiveVacationsCount", error);
            throw error;
        }
    }

    public async getActiveVacationsList(offset: number): Promise<Vacation[]> {
        try {
            const response = await axios.get<Vacation[]>(appConfig.apiAddress + "vacations/active?offset=" + offset, {headers: {Authorization: "Bearer " + authStore.getState().token}});
            this.isFetched = true;
            vacationStore.dispatch({type: VacationActionType.GetVacationList, payload: response.data});
            return response.data;
        } catch (error) {
            console.log("error from getFutureVacationsList", error);
            throw error;
        }
    }

    public async getAllVacationList(forceDespatch: boolean = true): Promise<Vacation[]> {
        try {
            const response = await axios.get<Vacation[]>(appConfig.apiAddress + "vacations-all", {headers: {Authorization: "Bearer " + authStore.getState().token}});
            if (forceDespatch) {
                vacationStore.dispatch({type: VacationActionType.GetVacationList, payload: response.data});
            }
            return response.data;
        } catch (error) {
            console.log("error from getAllVacationList", error);
            throw error;
        }
    }

}

export const vacationService = new VacationService();
