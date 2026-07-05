import express, {Request, Response} from "express";
import {vacationService} from "../services/vacation-service";
import {StatusCode} from "../models/enums";
import {Vacation} from "../models/vacation";
import {uploadImageService} from "../services/upload-image-service";
import {tokenMiddleware} from "../middleware/token-middleware";
import {secureService} from "../services/secure-service";

class VacationController {

    router = express.Router();

    constructor() {
        this.router.post('/api/vacation/', tokenMiddleware.validateAdmin, uploadImageService.upload.single("image"), this.addVacation);
        this.router.get('/api/vacations', tokenMiddleware.validateToken, this.getVacationsList);
        this.router.get('/api/vacations/count', tokenMiddleware.validateToken, this.getVacationsCount);
        this.router.put('/api/vacation/:id', tokenMiddleware.validateAdmin, uploadImageService.upload.single("image"), this.updateVacation);
        this.router.get('/api/vacation/:id', tokenMiddleware.validateAdmin, this.getSingleVacation);
        this.router.delete('/api/vacation/:id', tokenMiddleware.validateAdmin, this.deleteVacation);
        this.router.get('/api/vacations/followed/count', tokenMiddleware.validateToken, this.getFollowedVacationsCountByUserId);
        this.router.get('/api/vacations/followed', tokenMiddleware.validateToken, this.getFollowedVacationsListByUserId);
        this.router.get('/api/vacations/future/count', tokenMiddleware.validateToken, this.getFutureVacationsCount);
        this.router.get('/api/vacations/future', tokenMiddleware.validateToken, this.getFutureVacationsList);
        this.router.get('/api/vacations/active/count', tokenMiddleware.validateToken, this.getActiveVacationsCount);
        this.router.get('/api/vacations/active', tokenMiddleware.validateToken, this.getActiveVacationsList);
        this.router.get('/api/vacations-all', tokenMiddleware.validateAdmin, this.getAllVacationsList);
    }

    public async addVacation(request: Request, response: Response) {
        const token = request.headers.authorization?.substring(7)!;
        const adminId = secureService.getAdminId(token);
        const vacationJson = JSON.parse(request.body.vacation);
        const vacation: Vacation = new Vacation(vacationJson);
        vacation.imageName = request.file?.filename;
        const vacationFromDB = await vacationService.addVacation(vacation, adminId);
        response.status(StatusCode.Created).json(vacationFromDB);
    }

    public async getVacationsList(request: Request, response: Response) {
        const offset = Number(request.query.offset ?? 0) || 0;
        const vacationListFromDB = await vacationService.getVacationsList(offset);
        response.json(vacationListFromDB);
    }

    public async getVacationsCount(request: Request, response: Response) {
        const count = await vacationService.getVacationsCount();
        response.json({count});
    }

    public async updateVacation(request: Request, response: Response) {
        const token = request.headers.authorization?.substring(7)!;
        const adminId = secureService.getAdminId(token);
        const id = +request.params.id;
        const vacationJson = JSON.parse(request.body.vacation);
        const vacation: Vacation = new Vacation(vacationJson);
        vacation.imageName = request.file?.filename;
        await vacationService.updateVacation(id, vacation, adminId);
        response.json(vacation);
    }

    public async deleteVacation(request: Request, response: Response) {
        const token = request.headers.authorization?.substring(7)!;
        const adminId = secureService.getAdminId(token);
        const id = +request.params.id;
        await vacationService.deleteVacation(id, adminId);
        response.sendStatus(StatusCode.NoContent);
    }

    public async getSingleVacation(request: Request, response: Response) {
        const id = +request.params.id;
        const vacationFromDB = await vacationService.getSingleVacation(id);
        response.json(vacationFromDB);
    }

    public async getFollowedVacationsCountByUserId(request: Request, response: Response) {
        const userId = +request.query.userId!;
        const count = await vacationService.getFollowedVacationsCountByUserId(userId);
        response.json({count});
    }

    public async getFollowedVacationsListByUserId(request: Request, response: Response) {
        const userId = +request.query.userId!;
        const offset = Number(request.query.offset ?? 0) || 0;
        const vacationFromDB = await vacationService.getFollowedVacationsListByUserId(userId, offset);
        response.json(vacationFromDB);
    }

    public async getFutureVacationsCount(request: Request, response: Response) {
        const count = await vacationService.getFutureVacationsCount();
        response.json({count});
    }

    public async getFutureVacationsList(request: Request, response: Response) {
        const offset = Number(request.query.offset ?? 0) || 0;
        const vacationListFromDB = await vacationService.getFutureVacationsList(offset);
        response.json(vacationListFromDB);
    }

    public async getActiveVacationsCount(request: Request, response: Response) {
        const count = await vacationService.getActiveVacationsCount();
        response.json({count});
    }

    public async getActiveVacationsList(request: Request, response: Response) {
        const offset = Number(request.query.offset ?? 0) || 0;
        const vacationListFromDB = await vacationService.getActiveVacationsList(offset);
        response.json(vacationListFromDB);
    }

    public async getAllVacationsList(request: Request, response: Response) {
        const vacationListFromDB = await vacationService.getAllVacationsList();
        response.json(vacationListFromDB);
    }

}

export const vacationController = new VacationController();
