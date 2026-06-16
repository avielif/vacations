import {JSX} from "react";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import './AddDeleteVacationAlert.css'

function AddDeleteVacationAlert(): JSX.Element {

    const navigate = useNavigate();

    function addDeleteVacation(id: number) {
        Swal.fire({
            title: 'Vacation Added',
            text: 'A new Vacation was added. Click OK to see the Vacation',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            customClass: {
                confirmButton: 'swal-confirm-btn',
            },
        }).then(async (result) => {
            if (result.isConfirmed) {

                navigate("/vacations-list?page=1", { state: { reset: true } });
            }
        });
    }

    return (
        <div>

        </div>
    )

}

export default AddDeleteVacationAlert;
