import React, {useEffect} from 'react';
import './App.css';
import Routing from "./utils/Routing";
import Header from "./component/layout/header/Header";
import axios from "axios";
import { authStore, AuthActionType } from "./state/auth-state";
import VacationPreview from "./component/vacation-preview/VacationPreview";
import {socketService} from "./services/socket-service";
import {userSocketService} from "./services/user-socket-service";
import {vacationSocket} from "./services/vacation-socket-service";

axios.interceptors.response.use(
    response => response,
    error => {
        const url = error.config?.url ?? "";
        const isAuthEndpoint = url.includes("auth/login") || url.includes("auth/register");

        if (error.response?.status === 401 && !isAuthEndpoint) {
            authStore.dispatch({ type: AuthActionType.Logout, payload: null });
            window.location.replace("/auth/login");
            return new Promise(() => {});
        }
        return Promise.reject(error);
    }
);

function App() {

    useEffect(() => {
        // Connect immediately if already logged in (after refresh)
        if (authStore.getState().token) {
            socketService.connect();
            userSocketService.usersConnected();
            vacationSocket.userVacationsSockets();
        }

        // Connect when user logs in
        const unsubscribe = authStore.subscribe(() => {
            const token = authStore.getState().token;
            if (token && !socketService.socket) {
                socketService.connect();
                userSocketService.usersConnected();
                vacationSocket.userVacationsSockets();
            }
            if (!token) {
                socketService.disconnect();
            }
        });
        return () => unsubscribe();
    }, []);

  return (
    <div className="App">
        <header>
            <Header />
        </header>
            <main>
                <Routing />
                <VacationPreview />
            </main>
    </div>
  );
}

export default App;
