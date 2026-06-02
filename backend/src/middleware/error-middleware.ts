import {NextFunction, Request, Response} from "express";
import {StatusCode} from "../models/enums";
import {RoutNotFound} from "../models/client-error";

class ErrorMiddleware {

    public catchAll(err: any, request: Request, response: Response, next: NextFunction) {
        const status = err.status ?? StatusCode.ServerError;
        const message = err.message;
        response.status(status).json({error: status === StatusCode.ServerError ? "Server Error" : message});
    }

    public routeNotFound(request: Request, response: Response, next: NextFunction) {
        next(new RoutNotFound(request.originalUrl));
    }

}

export const errorMiddleware = new ErrorMiddleware();
