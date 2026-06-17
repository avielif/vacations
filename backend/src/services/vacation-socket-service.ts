import {Vacation} from "../models/vacation";
import {socketService} from "./socket-service";


class VacationSocketService {

    public sendVacation(vacation: Vacation) {
        if (socketService.socketServer) {
            socketService.socketServer.emit("addedVacation", vacation);
        }
    }

    public deleteVacation(id: number, adminId: number) {
        if (socketService.socketServer) {
            socketService.socketServer.emit("deletedVacation", { id, adminId });
        }
    }

    public updateVacation(vacation: Vacation) {
        if (socketService.socketServer) {
            socketService.socketServer.emit("updatedVacation", vacation);
        }
    }

}

export const vacationSocketService = new VacationSocketService();
