import Joi from "joi";
import {ValidationError} from "./client-error";

export class UserCredentials {

    public email: string;
    public password: string;

    constructor(userCredentials: UserCredentials) {
        this.email = userCredentials.email;
        this.password = userCredentials.password;
    }

    private static validationSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(4).max(128),
    })

    public validate() {
        const result = UserCredentials.validationSchema.validate(this);
        if (result.error) {
            throw new ValidationError(result.error.message);
        }
    }
}
