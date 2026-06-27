import React, {JSX, useEffect, useState} from 'react';
import logo from "../../../assets/vacation-logo.png";
import "./Header.css"
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {FaHome} from "react-icons/fa";
import {AuthActionType, authStore} from "../../../state/auth-state";
import {User} from "../../../models/user";
import {RoleId} from "../../../models/enums";
import {FollowerActionType, followerStore} from "../../../state/follower-state";
import {followerService} from "../../../services/follower-service";
import {vacationService} from "../../../services/vacation-service";
import CsvDownloader from "react-csv-downloader";

function Header (): JSX.Element {

    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(authStore.getState().user);
    const isLogin = user !== null;
    const location = useLocation();

    useEffect(() => {

        authStore.subscribe(() => {
            setUser(authStore.getState().user);
        });

    }, []);

    function logout(): void {
        authStore.dispatch({type: AuthActionType.Logout, payload: null});
        followerService.resetCache();
        followerStore.dispatch({type: FollowerActionType.LogoutFollower, payload: null });
        navigate("/");
    }

    function navigateToHome(): void {
        isLogin ? navigate("/vacations-list?page=1", { state: { reset: true } }) : navigate("/");
    }

    return (
        <div className="Header">
            <div className="header-left-menu">
                <div className="header-left">
                    <span onClick={() => navigateToHome()}><FaHome className="home-icon" /></span>
                    <p>Hello, {isLogin ? user!.firstName + ' ' + user!.lastName : "Guest"}</p>
                    {isLogin ? <button onClick={() => logout()}>Logout</button> : null}
                </div>
                {isLogin ?
                    <div className="menu">
                        <NavLink to="/vacations-list?page=1" state={{ reset: true }}>Vacations</NavLink>
                        { authStore.getState().user?.roleId === RoleId.Admin ?
                            <>
                                <NavLink to="/vacation">Add New Vacation</NavLink>
                                <NavLink to="/vacations-report">Vacations Report</NavLink>
                                <NavLink to="/connected-users">Connected Users</NavLink>
                                <CsvDownloader
                                    filename="Vacations Followers Report"
                                    wrapColumnChar='"'
                                    columns={[
                                        { id: "destination", displayName: "Destination" },
                                        { id: "followers", displayName: "Followers" }
                                    ]}
                                    datas={async () => {
                                        const vacations = await vacationService.getAllVacationList(false);
                                        return vacations.map(v => ({
                                            destination: (v.destination ?? "").toString(),
                                            followers: (v.numberOfFollowers ?? "").toString()
                                        }));
                                    }}
                                >
                                    <button>Download CSV</button>
                                </CsvDownloader>
                            </>
                            : null
                        }
                    </div>
                : null}
                { isLogin ? "" :
                <div className="links">
                    <NavLink to="/auth/login">Login</NavLink>
                    <NavLink to="/auth/register">Register</NavLink>
                </div>
                }
            </div>
            <img src={logo} alt="vacation-logo"/>
        </div>
    );
}

export default Header;
