import Joi from "joi";
import {ValidationError} from "./client-error";

export class Follower {

    public id?: number;
    public userId: number;
    public vacationId: number;

    constructor(follower: Follower) {
        this.id = follower.id;
        this.userId = follower.userId;
        this.vacationId = follower.vacationId;
    }

    private static validationSchema = Joi.object({
        id: Joi.number().optional().positive(),
        userId: Joi.number().required().positive(),
        vacationId: Joi.number().required().positive(),
    })

    public validate() {
        const result = Follower.validationSchema.validate(this);
        if (result.error) {
            throw new ValidationError(result.error.message);
        }
    }
}