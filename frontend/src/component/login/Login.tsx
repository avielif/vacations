import {JSX} from "react";
import {useForm} from "react-hook-form";
import {NavLink, useNavigate} from "react-router-dom";
import {authService} from "../../services/auth-service";
import {UserCredentials} from "../../models/user-credentials";
import {errorMessageService} from "../../services/error-message-service";

function Login(): JSX.Element {

    const navigate = useNavigate();
    const {register, formState, handleSubmit, reset } = useForm<UserCredentials>();

    async function loginUser(userCredentials: UserCredentials): Promise<void> {
        try {
            await authService.login(userCredentials);
            reset();
            navigate("/vacations-list?page=1");
        }
        catch (error) {
            errorMessageService.displayErrorMessage(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(loginUser)}>
            <div>
                <h2>Login</h2>
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

                <button>Login</button>

                <p className="p-dont">don't have account?</p>

                <NavLink to="/auth/register">register now</NavLink>

            </div>
        </form>
    )
}

export default Login;
