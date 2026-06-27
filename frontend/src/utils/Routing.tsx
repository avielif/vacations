import {JSX} from "react";
import {Route, Routes} from "react-router-dom";
import Register from "../component/register/Register";
import Login from "../component/login/Login";
import Main from "../component/layout/main/Main";
import VacationForm from "../component/vacation-form/VacationForm";
import VacationListRoute from "../component/vacation-list-route/VacationListRoute";
import PrivateRoute from "../component/private-route/PrivateRoute";
import {RoleId} from "../models/enums";
import Report from "../component/Report/Report";
import ConnectedUsers from "../component/connected-users/ConnectedUsers";

function Routing(): JSX.Element {
    return (
        <Routes>
            <Route path="/auth/register" element={<Register />}/>
            <Route path="/auth/login" element={<Login />}/>
            <Route path="/vacation/:id?" element={<PrivateRoute permissionIdList={[RoleId.Admin]} child={<VacationForm />}/>}/>
            <Route path="/vacations-list" element={<PrivateRoute permissionIdList={[RoleId.Admin, RoleId.User]} child={<VacationListRoute />}/>}/>
            <Route path="/vacations-report" element={<PrivateRoute permissionIdList={[RoleId.Admin]} child={<Report />}/>}/>
            <Route path="/connected-users" element={<PrivateRoute permissionIdList={[RoleId.Admin]} child={<ConnectedUsers />}/>}/>
            <Route path="/" element={<Main />}/>
            <Route path="*" element={<Main />}/>
        </Routes>
    )
}

export default Routing;
