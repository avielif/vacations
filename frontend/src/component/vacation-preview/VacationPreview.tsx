import React, { JSX, useEffect, useState } from "react";
import { Vacation } from "../../models/vacation";
import { PreviewActionType, previewStore } from "../../state/vacation-preview-state";
import { appConfig } from "../../utils/app-config";
import "../vacation-list-route/vacation-list/vacation-item/VacationItem.css";
import "./VacationPreview.css";
import {FaWindowClose} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

function VacationPreview(): JSX.Element | null {
    const [vacation, setVacation] = useState<Vacation | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = previewStore.subscribe(() => {
            setVacation(previewStore.getState().vacation);
        });
        return () => unsubscribe();
    }, []);

    if (!vacation) return null;

    function close() {
        previewStore.dispatch({ type: PreviewActionType.Hide });
        // navigate("/vacations-list?page=1", { state: { reset: true } });
    }

    return (
        <div className="modal-overlay" onClick={close}>
            <div className="modal-card-wrapper" onClick={(e) => e.stopPropagation()}>
                <div className="VacationItem">
                    <button className="modal-close-btn" onClick={close}><FaWindowClose /></button>
                    {vacation.image
                        ? <img alt="Vacation" src={appConfig.uploadsAddress + vacation.image} />
                        : <div className="no-image" />
                    }
                    <h3 className="vacation-destination">{vacation.destination}</h3>
                    <div>
                        <p className="dates">Dates: {vacation.startDate + " - " + vacation.endDate}</p>
                        <p className="vacation-description">{vacation.description}</p>
                        <div className="div-price">{vacation.price} $</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VacationPreview;