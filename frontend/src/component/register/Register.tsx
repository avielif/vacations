import {JSX} from "react";
import {User} from "../../models/user";
import {useForm} from "react-hook-form";
import {NavLink, useNavigate} from "react-router-dom";
import {authService} from "../../services/auth-service";
import {errorMessageService} from "../../services/error-message-service";

function Register(): JSX.Element {

    const navigate = useNavigate();
    const {register, formState, handleSubmit, reset } = useForm<User>();

    async function registerUser(user: User): Promise<void> {
        try {
            await authService.register(user);
            reset();
            navigate("/vacations-list?page=1");
        }
        catch (error) {
            errorMessageService.displayErrorMessage(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(registerUser)}>
            <div>
                <h2>Register</h2>
                <label>First Name</label>
                <input type="text" {...register("firstName",
                    {
                        required: {value: true, message: "First Name is required!"},
                        minLength: {value: 2, message: "Must contains 2 letters at least."}
                    }
                )}/>
                {formState.errors.firstName && <p className="error">{formState.errors.firstName?.message}</p>}

                <label>Last Name</label>
                <input type="text" {...register("lastName",
                    {
                        required: {value: true, message: "Last Name is required!"},
                        minLength: {value: 2, message: "Must contains 2 letters at least."}
                    }
                )}/>
                {formState.errors.lastName && <p className="error">{formState.errors.lastName?.message}</p>}

                <label>Email</label>
                <input type="email" {...register("email",
                    {
                        required: {value: true, message: "Email is required!"},
                    }
                )}/>
                {formState.errors.email && <p className="error">{formState.errors.email?.message}</p>}

                <label>Password</label>
                <input type="password" {...register("password",
                    {
                        required: {value: true, message: "Password is required!"},
                        minLength: {value: 4, message: "Must contains 4 letters at least."}
                    }
                )}/>
                {formState.errors.password && <p className="error">{formState.errors.password?.message}</p>}

                <button>Register</button>

                <p className="p-dont">already a member?</p>

                <NavLink to="/auth/login">login</NavLink>

            </div>
        </form>
    )
}

export default Register;
