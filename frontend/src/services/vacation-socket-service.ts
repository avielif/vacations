// import { useEffect } from "react";
import Swal from "sweetalert2";
import { socketService } from "./socket-service";
import { Vacation } from "../models/vacation";
import {PreviewActionType, previewStore} from "../state/vacation-preview-state";
import {authStore} from "../state/auth-state";

class VacationSocket {

    public userVacationsSockets() {
        socketService.connect();
        const socket = socketService.socket;
        socket.on("connect", () => console.log("Socket connected:", socket.id));
        socket.on("connect_error", (err) => console.log("Socket error:", err.message));

        socket.on("addedVacation", ({ vacation, adminId }: { vacation: Vacation, adminId: number }) => {
            if (authStore.getState().user?.id === adminId) return;
            Swal.fire({
                title: "New Vacation Added!",
                text: `Vacation "${vacation.destination}" was just added.`,
                icon: "success",
                showConfirmButton: true,
                confirmButtonText: "View Vacation",
                showCancelButton: true,
                cancelButtonText: "Dismiss",
                returnFocus: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    previewStore.dispatch({type: PreviewActionType.Show, payload: vacation});
                }
            });
        });

        socket.on("updatedVacation", ({ vacation, adminId }: { vacation: Vacation, adminId: number }) => {
            if (authStore.getState().user?.id === adminId) return;
            Swal.fire({
                title: "Vacation Updated",
                text: `Vacation "${vacation.destination}" was updated.`,
                icon: "info",
                showConfirmButton: true,
                confirmButtonText: "View Changes",
                showCancelButton: true,
                cancelButtonText: "Dismiss",
                returnFocus: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    previewStore.dispatch({type: PreviewActionType.Show, payload: vacation});
                }
            });
        });

        socket.on("deletedVacation", ({id, adminId, destination}: { id: number, adminId: number, destination: string }) => {
            if (authStore.getState().user?.id === adminId) return;
            Swal.fire({
                title: "Vacation Removed",
                text: `Vacation "${destination}" has been removed.`,
                icon: "warning",
                confirmButtonText: "OK",
                returnFocus: false,
            });
        });
    }
}

export const vacationSocket = new VacationSocket();
