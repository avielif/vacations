import {socketService} from "./socket-service";
import {VacationActionType, vacationStore} from "../state/vacation-state";


class VacationSocketService {

    // public vacationAdded() {
    //     socketService.connect();
    //     socketService.socket.off("addedVacation"); // prevent duplicate listeners
    //     socketService.socket.on("addedVacation", (vacation) => {
    //         // vacationStore.dispatch({type: VacationActionType.AddVacation, payload: vacation});
    //     })
    // };
    //
    // public vacationDeleted() {
    //     socketService.connect();
    //     socketService.socket.off("deletedVacation"); // prevent duplicate listeners
    //     socketService.socket.on("deletedVacation", (id) => {
    //         // vacationStore.dispatch({type: VacationActionType.DeleteVacation, payload: id});
    //     })
    // };
    //
    // public vacationUpdated() {
    //     socketService.connect();
    //     socketService.socket.off("updatedVacation"); // prevent duplicate listeners
    //     socketService.socket.on("updatedVacation", (vacation) => {
    //         // vacationStore.dispatch({type: VacationActionType.UpdateVacation, payload: vacation});
    //     })
    // };

}

export const vacationSocketService = new VacationSocketService();
