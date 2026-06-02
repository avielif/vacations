import {NextFunction, request, Request, Response} from "express";

class LoggerMiddleware {

    public consoleLog(request: Request, response: Response, next: NextFunction) {
        console.log(request.originalUrl);
        console.log(request.method);
        console.log(request.body);
        next();
    }
}

export const loggerMiddleware = new LoggerMiddleware();
