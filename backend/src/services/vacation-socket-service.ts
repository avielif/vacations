import {Vacation} from "../models/vacation";
import {socketService} from "./socket-service";


class VacationSocketService {

    public sendVacation(vacation: Vacation, adminId: number) {
        if (socketService.socketServer) {
            socketService.socketServer.emit("addedVacation", { vacation, adminId });
        }
    }

    public deleteVacation(id: number, adminId: number) {
        if (socketService.socketServer) {
            socketService.socketServer.emit("deletedVacation", { id, adminId });
        }
    }

    public updateVacation(vacation: Vacation, adminId: number) {
        if (socketService.socketServer) {
            socketService.socketServer.emit("updatedVacation", { vacation, adminId });
        }
    }

}

export const vacationSocketService = new VacationSocketService();
