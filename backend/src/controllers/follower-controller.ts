import express, {Request, Response} from "express";
import {StatusCode} from "../models/enums";
import {Follower} from "../models/follower";
import {followerService} from "../services/follower-service";
import {tokenMiddleware} from "../middleware/token-middleware";

class FollowerController {

    router = express.Router();

    constructor() {
        this.router.post('/api/follower', tokenMiddleware.validateToken, this.addFollower);
        this.router.delete('/api/follower/user/:userId/vacation/:vacationId', tokenMiddleware.validateToken, this.deleteFollower);
        this.router.get('/api/follower-list/follower/:id', tokenMiddleware.validateToken, this.getFollowerList);
    }

    public async addFollower(request: Request, response: Response) {
        const follower: Follower = new Follower(request.body);
        const followerFromDB = await followerService.addFollower(follower);
        response.status(StatusCode.Created).json(followerFromDB);
    }

    public async deleteFollower(request: Request, response: Response) {
        const userId = +request.params.userId;
        const vacationId = +request.params.vacationId;
        await followerService.deleteFollower(userId, vacationId);
        response.sendStatus(StatusCode.NoContent);
    }

    public async getFollowerList(request: Request, response: Response) {
        const userId = +request.params.id;
       const followerList = await followerService.getFollowerList(userId);
        response.json(followerList);
    }

}

export const followerController = new FollowerController();
