import axios from "axios";
import {appConfig} from "../utils/app-config";
import {authStore} from "../state/auth-state";
import {Follower} from "../models/follower";
import {FollowerActionType, followerStore} from "../state/follower-state";
import {VacationActionType, vacationStore} from "../state/vacation-state";

class FollowerService {

    isFetched: boolean = false;

    public resetCache(): void {
        this.isFetched = false;
    }

    public async addFollower(userId: number, vacationId: number): Promise<Follower> {
        const follower = new Follower(userId, vacationId);
        try {
            const response = await axios.post<Follower>(appConfig.apiAddress + "follower", follower, {headers: {Authorization: "Bearer " + authStore.getState().token}});
            followerStore.dispatch({type: FollowerActionType.AddFollower, payload: response.data});
            vacationStore.dispatch({type: VacationActionType.AddFollower, payload: vacationId});
            return response.data;
        }
        catch(error) {
            console.log("error in addFollower", error);
            throw error;
        }
    }

    public async deleteFollower(userId: number, vacationId: number): Promise<void> {
        try {
            const response = await axios.delete(appConfig.apiAddress + "follower/user/" + userId + "/vacation/" + vacationId, {headers: {Authorization: "Bearer " + authStore.getState().token}});
            followerStore.dispatch({type: FollowerActionType.DeleteFollower, payload: {userId, vacationId}});
            vacationStore.dispatch({type: VacationActionType.DeleteFollower, payload: vacationId});
            return response.data;
        }
        catch (error) {
            console.log("error in deleteFollower", error);
            throw error;
        }
    }

    public async getFollowerListByUserId(userId: number, forceFetch: boolean = false): Promise<Follower[]> {
        if (!this.isFetched || forceFetch) {
            try {
                const response = await axios.get<Follower[]>(appConfig.apiAddress + "follower-list/follower/" + userId, {headers: {Authorization: "Bearer " + authStore.getState().token}});
                this.isFetched = true;
                followerStore.dispatch({type: FollowerActionType.GetFollowerList, payload: response.data});
                return response.data;
            } catch (error) {
                console.log("error in getFollowersList", error);
                throw error;
            }
        }
        return followerStore.getState().followerList;
    }

}

export const followerService = new FollowerService();
