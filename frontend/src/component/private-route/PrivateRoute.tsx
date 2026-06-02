import {JSX, ReactNode} from "react";
import "./PrivateRoute.css";
import {AuthActionType, authStore} from "../../state/auth-state";
import {Navigate} from "react-router-dom";
import {RoleId} from "../../models/enums";
import {jwtDecode} from "jwt-decode";

interface PrivateRouteProps {
    child: ReactNode;
    permissionIdList: RoleId[];
}

function PrivateRoute(privateRouteProps: PrivateRouteProps): JSX.Element {

    const token = authStore.getState().token;
    const isExpired = token ? jwtDecode<{ exp: number }>(token).exp * 1000 <= Date.now() : true;

    if (!authStore.getState().user || isExpired) {
        if (isExpired) {
            authStore.dispatch({ type: AuthActionType.Logout, payload: null });
        }
        return (<Navigate to="/auth/login" />);
    }

    if (!privateRouteProps.permissionIdList.includes(authStore.getState().user!.roleId)) {
        return (<Navigate to="/" />)
    }

    return (
        <div>
            {privateRouteProps.child}
        </div>
    );
}

export default PrivateRoute;
