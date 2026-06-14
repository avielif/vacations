import {Vacation} from "../models/vacation";
import {socketService} from "./socket-service";


class VacationSocketService {

    public sendVacation(vacation: Vacation) {
        if (socketService.socketServer) {
            socketService.socketServer.emit("addedVacation", vacation);
        }
    }

    public deleteVacation(id: number) {
        if (socketService.socketServer) {
            socketService.socketServer.emit("deletedVacation", id);
        }
    }

}

export const vacationSocketService = new VacationSocketService();
