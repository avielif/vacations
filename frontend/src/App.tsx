import React, {useEffect} from 'react';
import './App.css';
import Routing from "./utils/Routing";
import Header from "./component/layout/header/Header";
import axios from "axios";
import { authStore, AuthActionType } from "./state/auth-state";
import {authService} from "./services/auth-service";
import VacationPreview from "./component/vacation-preview/VacationPreview";

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
        authService.init();
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
