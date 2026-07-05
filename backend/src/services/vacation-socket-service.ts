import {Vacation} from "../models/vacation";
import {socketService} from "./socket-service";


class VacationSocketService {

    public addVacation(vacation: Vacation, adminId: number) {
        if (socketService.socketServer) {
            socketService.socketServer.emit("addedVacation", { vacation, adminId });
        }
    }

    public deleteVacation(id: number, adminId: number, destination: string) {
        if (socketService.socketServer) {
            socketService.socketServer.emit("deletedVacation", { id, adminId, destination });
        }
    }

    public updateVacation(vacation: Vacation, adminId: number) {
        if (socketService.socketServer) {
            socketService.socketServer.emit("updatedVacation", { vacation, adminId });
        }
    }

}

export const vacationSocketService = new VacationSocketService();
