import {Request, Response, NextFunction, request} from "express";
import {secureService} from "../services/secure-service";
import {UnauthorizedError} from "../models/client-error";

class TokenMiddleware {

    public validateToken(request: Request, response: Response, next: NextFunction) {
        const token = request.headers.authorization?.substring(7);
        if (secureService.validateToken(token!)) {
            next();
            return;
        }
        next(new UnauthorizedError("Unauthorized"));
    }

    public validateAdmin(request: Request, response: Response, next: NextFunction) {
        const token = request.headers.authorization?.substring(7);
        if (secureService.validateAdmin(token!)) {
            next();
            return;
        }
        next(new UnauthorizedError("Unauthorized"));
    }

}

export const tokenMiddleware = new TokenMiddleware();
