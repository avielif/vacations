import 'react-confirm-alert/src/react-confirm-alert.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {JSX} from "react";

function ConfirmAlert(): JSX.Element {

    const handleClick = () =>  {
        alert("Are you shore you want to delete the Vacation ?")
    }

    return (
        <div className="h-[100vh] flex justify-center items-center">
            <button onClick={handleClick} className="px-6 py-2 bg-blue-600 text-white-rounded">Delete</button>
        </div>
    )
}

export default ConfirmAlert;
