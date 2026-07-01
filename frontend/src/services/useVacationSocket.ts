import { useEffect } from "react";
import Swal from "sweetalert2";
import { socketService } from "./socket-service";
import { Vacation } from "../models/vacation";
import {PreviewActionType, previewStore} from "../state/vacation-preview-state";
import { useNavigate } from "react-router-dom";
import {authStore} from "../state/auth-state";
import {userSocketService} from "./user-socket-service";
import {UserActionType, userStore} from "../state/user-state";

export function useVacationSocket(): void {

    useEffect(() => {
        socketService.connect();
        const socket = socketService.socket;
        socket.on("connect", () => console.log("Socket connected:", socket.id));
        socket.on("connect_error", (err) => console.log("Socket error:", err.message));

        socket.on("addedVacation", (vacation: Vacation) => {
            Swal.fire({
                title: "New Vacation Added!",
                text: `${vacation.destination} was just added.`,
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

        socket.on("updatedVacation", (vacation: Vacation) => {
            Swal.fire({
                title: "Vacation Updated",
                text: `${vacation.destination} was updated.`,
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

        socket.on("deletedVacation", ({ id, adminId }: { id: number, adminId: number }) => {
            if (authStore.getState().user?.id === adminId) return;
            Swal.fire({
                title: "Vacation Removed",
                text: "A vacation has been deleted.",
                icon: "warning",
                confirmButtonText: "OK",
                returnFocus: false,
            });
        });

        return () => {
            socket.off("addedVacation");
            socket.off("updatedVacation");
            socket.off("deletedVacation");
        };
    }, []);
}
