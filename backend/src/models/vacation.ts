import Joi from "joi";
import {ValidationError} from "./client-error";

export class Vacation {

    public destination: string;
    public description: string;
    public startDate: Date;
    public endDate: Date;
    public price: number;
    public imageName?: string;
    public numberOfFollowers?: number;
    public id?: number;

    constructor(vacation: Vacation) {
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.imageName = vacation.imageName;
        this.numberOfFollowers = vacation.numberOfFollowers;
        this.id = vacation.id;
    }

    private static validationSchema = Joi.object({
        destination: Joi.string().required().min(2).max(25),
        description: Joi.string().required().min(2).max(1024),
        // startDate: Joi.date().required().min(new Date(new Date().setHours(0, 0, 0, 0))),
        startDate: Joi.date().required(),
        endDate: Joi.date().required().greater(Joi.ref("startDate")),
        price: Joi.number().required().min(1).max(10000),
        imageName: Joi.string().optional(),
        numberOfFollowers: Joi.number().optional(),
        id: Joi.number().optional().min(1),
    })

    public validate(isUpdate = false) {
        const schema = isUpdate
            ? Vacation.validationSchema
            : Vacation.validationSchema.keys({
                startDate: Joi.date().required().min(new Date(new Date().setHours(0, 0, 0, 0))),
            });

        const result = schema.validate(this);
        if (result.error) {
            throw new ValidationError(result.error.message);
        }
    }

}
