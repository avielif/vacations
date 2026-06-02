import express, {Request, Response} from "express";
import {authService} from "../services/auth-service";
import {User} from "../models/user";
import {StatusCode} from "../models/enums";
import {UserCredentials} from "../models/user-credentials";

class AuthController {

    router = express.Router();

    constructor() {
        this.router.post('/api/auth/register/', this.register);
        this.router.post('/api/auth/login/', this.login);
    }

    public async register(request: Request, response: Response) {
        const user: User = new User(request.body);
        const token = await authService.register(user);
        response.status(StatusCode.Created).json({token});
    }

    public async login(request: Request, response: Response) {
        const userCredentials: UserCredentials = new UserCredentials(request.body);
        const token = await authService.login(userCredentials);
        response.json({token});
    }

}

export const authController = new AuthController();
