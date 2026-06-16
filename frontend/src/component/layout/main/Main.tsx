import React, {JSX} from "react";
import "./Main.css"
import VacationPreview from "../../vacation-preview/VacationPreview";

function Main(): JSX.Element {
    return (
        <div className="welcome-text">
            <h1>Discover Your Next Vacation</h1>
            <p>Explore breathtaking destinations around the world</p>
        </div>
    )
}

export default Main;
