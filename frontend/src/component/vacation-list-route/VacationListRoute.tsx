import {JSX} from "react";
import VacationList from "./vacation-list/VacationList";
import {useVacationSocket} from "../../services/useVacationSocket";

function VacationListRoute(): JSX.Element {

    useVacationSocket();

    return (
        <div>
            <VacationList />
        </div>
    )
}

export default VacationListRoute
