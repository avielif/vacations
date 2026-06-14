import express from 'express';
import cors from 'cors';
import {loggerMiddleware} from "./middleware/logger-middleware";
import {errorMiddleware} from "./middleware/error-middleware";
import {authController} from "./controllers/auth-controller";
import {vacationController} from "./controllers/vacation-controller";
import {followerController} from "./controllers/follower-controller";
import {socketService} from "./services/socket-service";

class App {

    public start(): void {
        console.log("Starting App");
        const server = express();
        server.use(cors());
        server.use('/uploads', express.static('uploads'));
        server.use(express.json());
        server.use(loggerMiddleware.consoleLog);
        server.use(authController.router);
        server.use(vacationController.router);
        server.use(followerController.router);

        server.use(errorMiddleware.routeNotFound);
        server.use(errorMiddleware.catchAll);
        const httpServer = server.listen(4000, () => console.log("Server started ok - port 4000"));
        socketService.init(httpServer);
    }

}

const app = new App();
app.start();
