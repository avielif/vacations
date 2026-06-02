import Swal from 'sweetalert2';

class ErrorMessageService {

    public displayErrorMessage(err: unknown) {

        let message = err instanceof Error ? err.message : String(err);

        if (message.includes("Not Found")) {
            message = "Vacation Not Exist";
        }
        else if (message.includes("Unauthorized")) {
            message = "You are not authorized";
        }
        else if (message.includes("status code 500")) {
            message = "Something went wrong. Please try again later.";
        }

        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message,
        });
    };

}

export const errorMessageService = new ErrorMessageService();
