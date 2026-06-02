import React, {JSX, useState} from "react";
import {Vacation} from "../../../../models/vacation";
import {useNavigate} from "react-router-dom";
import {appConfig} from "../../../../utils/app-config";
import './VacationItem.css';
import {FaHeart, FaPencilAlt, FaRegHeart, FaTrashAlt} from "react-icons/fa";
import {authStore} from "../../../../state/auth-state";
import {RoleId} from "../../../../models/enums";
import {vacationService} from "../../../../services/vacation-service";
import 'react-confirm-alert/src/react-confirm-alert.css';
import {followerService} from "../../../../services/follower-service";
import Swal from 'sweetalert2';

interface VacationItemProps {
    vacation: Vacation;
    isFollower: boolean;
}

function VacationItem(vacationItemProps: VacationItemProps): JSX.Element {

    const navigate = useNavigate();

    function editVacation(id: number) {
        navigate("/vacation/" + id);
    }

    function deleteVacation(id: number) {
        Swal.fire({
            title: 'Delete Vacation',
            text: 'Are you sure you want to delete this vacation?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            customClass: {
                confirmButton: 'swal-confirm-btn',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                await vacationService.deleteVacation(id);
                navigate("/vacations-list?page=1", { state: { reset: true } });
            }
        });
    }

    async function followUnfollowVacation(userId: number, vacationId: number) {
        if (!vacationItemProps.isFollower) {
            await followerService.addFollower(userId, vacationId);
        }
        else {
            await followerService.deleteFollower(userId, vacationId);
        }
    }


    return (
        <div className="VacationItem">
            {vacationItemProps.vacation.image ? <img alt="Vacation Image" src={appConfig.uploadsAddress + vacationItemProps.vacation.image}/> : <div className="no-image"/>}
            {authStore.getState().user?.roleId === RoleId.Admin ?
                <>
                    <div className="tooltip-wrapper">
                        <button className="btn-edit" onClick={() => editVacation(vacationItemProps.vacation.id!)}><FaPencilAlt /></button>
                        <span className="tooltip-text">Edit vacation</span>
                    </div>
                    <div className="tooltip-wrapper">
                        <button className="btn-delete" onClick={() => deleteVacation(vacationItemProps.vacation.id!)}><FaTrashAlt /></button>
                        <span className="tooltip-text">Delete vacation</span>
                    </div>
                </>
                :
                <div className="follow-wrapper tooltip-wrapper">
                    <button className="follow-button" onClick={() => followUnfollowVacation(authStore.getState().user?.id!, vacationItemProps.vacation.id!)}>{vacationItemProps.isFollower ? <FaHeart color="red" /> : <FaRegHeart />}<span className="span-followers">Like {vacationItemProps.vacation.numberOfFollowers}</span></button>
                    <span className="tooltip-text">{vacationItemProps.isFollower ? 'Unfollow' : 'Follow'}</span>
                </div>
            }
            <h3 className="vacation-destination">{vacationItemProps.vacation.destination}</h3>
            <div>
                <p className="dates">Dates: {vacationItemProps.vacation.startDate + " - " + vacationItemProps.vacation.endDate}</p>
                <p className="vacation-description">{vacationItemProps.vacation.description}</p>
                <div className="div-price">{vacationItemProps.vacation.price} $</div>
            </div>
        </div>
    );
}

export default VacationItem;
