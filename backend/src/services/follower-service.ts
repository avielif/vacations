import {dal} from "../utils/dal";
import {ResultSetHeader} from "mysql2";
import {Follower} from "../models/follower";
import {ResourceNotFound} from "../models/client-error";
import {vacationService} from "./vacation-service";
import {authService} from "./auth-service";

interface CountRow {
    numberOfFollowers: number;
}

class FollowerService {

    public async addFollower(follower: Follower): Promise<Follower> {
        follower.validate();
        await vacationService.getSingleVacation(follower.vacationId);
        await authService.getSingleUser(follower.userId);
        const sql = "insert into follower (userId, vacationId) values (?, ?)";
        const result = await dal.execute(sql, [follower.userId, follower.vacationId]) as ResultSetHeader;
        follower = await this.getSingleFollower(result.insertId);
        return follower;
    }

    public async getSingleFollower(id: number): Promise<Follower> {
        const sql = "select * from follower where id = ?";
        const followerList = await dal.execute(sql, [id]) as Follower[];
        const follower = followerList[0];
        if (!follower) {
            throw new ResourceNotFound(id);
        }
        return follower;
    }

    public async deleteFollower(userId: number, vacationId: number): Promise<void> {
        await authService.getSingleUser(userId);
        await vacationService.getSingleVacation(vacationId);
        const sql = "delete from follower where userId = ? and vacationId = ?";
        const result = await dal.execute(sql, [userId, vacationId]) as ResultSetHeader;
        if (result.affectedRows === 0) {
            throw new ResourceNotFound(userId, vacationId);
        }
    }

    public async getFollowerList(userId: number): Promise<Follower[]> {
        const sql = "select * from follower where userId = ?";
        return await dal.execute(sql, [userId]) as Follower[];
    }

}

export const followerService = new FollowerService();
