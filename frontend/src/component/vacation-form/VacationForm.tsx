import React, {JSX, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {Vacation} from "../../models/vacation";
import {vacationService} from "../../services/vacation-service";
import {AxiosError} from "axios";
import './VacationForm.css';
import {appConfig} from "../../utils/app-config";
import {errorMessageService} from "../../services/error-message-service";

function VacationForm(): JSX.Element {

    const navigate = useNavigate();
    const params = useParams();
    let vacationToUpdate = useRef<Vacation | undefined>(undefined);

    const {register, formState, handleSubmit, reset, getValues, setValue } = useForm<Vacation>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        async function getSingleVacation() {
            try {
                vacationToUpdate.current = await vacationService.getSingleVacation(+params.id!);
                setValue("destination", vacationToUpdate.current.destination);
                setValue("description", vacationToUpdate.current.description);
                setValue("startDate", vacationToUpdate.current.startDate);
                setValue("endDate", vacationToUpdate.current.endDate);
                setValue("price", vacationToUpdate.current.price);
                setImagePreview(appConfig.uploadsAddress + vacationToUpdate.current.image);
            }
            catch (error) {
                errorMessageService.displayErrorMessage(error);
            }
        }

        if (params.id) {
            getSingleVacation();
        }
        else {
            reset();
        }
    }, [params.id]);


    async function addVacation(vacation: Vacation) {
        try {
            if (params.id) {
                vacation.id = vacationToUpdate.current?.id;
                await vacationService.updateVacation(vacation);
            }
            else {
                await vacationService.addVacation(vacation);
            }
            navigate("/vacations-list?page=1");
        }
        catch (error) {
            const myError = error as AxiosError;
            errorMessageService.displayErrorMessage((myError.response?.data as any)?.error);
        }
    }


    return (
        <form onSubmit={handleSubmit(addVacation)}>
            <div>
                <h2>{params.id ? "Edit Vacation" : "Add New Vacation"}</h2>

                <label>destination</label>
                <input type="text" {...register("destination",
                    {
                        required: {value: true, message: "Destination is required!"},
                        minLength: {value: 2, message: "Must contains 2 letters at least."}
                    }
                )}/>
                {formState.errors.destination && <p className="error">{formState.errors.destination?.message}</p>}

                <label>description</label>
                <textarea {...register("description",
                    {
                        required: {value: true, message: "Description is required!"},
                        minLength: {value: 2, message: "Must contains 2 letters at least."}
                    }
                )}/>
                {formState.errors.description && <p className="error">{formState.errors.description?.message}</p>}

                <label>start on</label>
                <input type="date" {...register("startDate",
                    {
                        required: {value: true, message: "Start on date is required!"},
                        validate: value => {
                            if (!params.id) {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return new Date(value) >= today || "Start on date can't be in the past!";
                            }
                            return true;
                        },
                    })}/>
                {formState.errors.startDate && <p className="error">{formState.errors.startDate?.message}</p>}

                <label>end on</label>
                <input type="date" {...register("endDate",
                    {
                        required: {value: true, message: "End on date is required!"},
                        validate: value => {
                            if (!params.id) {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (new Date(value) < today) {
                                    return "End on date can't be in the past!";
                                }
                            }
                            const { startDate } = getValues();
                            return value >= startDate || "End on date can't be earlier than start on date!";
                        }
                    })}/>
                {formState.errors.endDate && <p className="error">{formState.errors.endDate?.message}</p>}

                <label>price</label>
                <input type="number" placeholder="$" {...register("price",
                    {
                        required: {value: true, message: "Price is required!"},
                        min: {value: 1, message: "Minimum: 1"},
                        max: {value: 10000, message: "Maximum: 10000"}
                    })}/>
                {formState.errors.price && <p className="error">{formState.errors.price?.message}</p>}

                <label>cover image</label>
                {params.id && imagePreview && (<img src={imagePreview} alt="current cover"/>)}
                <input type="file" accept='image/*' {...register("image", {
                    required: params.id ? false : { value: true, message: "Cover image is required!" }
                })} />
                {!params.id && formState.errors.image && <p className="error">{formState.errors.image?.message}</p>}


                <div className="form-buttons">
                    <button type="submit">{params.id ? "Update" : "Add Vacation"}</button>
                    <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                </div>

            </div>
        </form>
    )
}

export default VacationForm;
