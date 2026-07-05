import multer from "multer";
import {ValidationError} from "../models/client-error";

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, callback) => {
        callback(null, "dest_" + Date.now() + "." + file.mimetype.split("/")[1]);
    }
});

class UploadImageService {

    public upload = multer({
        storage,
        fileFilter: (req, file, callback) => {
            const allowed = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
            if (allowed.includes(file.mimetype)) {
                callback(null, true);
            }
            else {
                const error = new ValidationError("File must be image");
                callback(error);
            }
        }
    })

}

export const uploadImageService = new UploadImageService();
