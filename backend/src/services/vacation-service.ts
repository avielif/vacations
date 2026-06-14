import {Vacation} from "../models/vacation";
import {dal} from "../utils/dal";
import {ResultSetHeader} from "mysql2";
import {ResourceNotFound} from "../models/client-error";
import {appConfig} from "../utils/app-config";
import fs from "fs";
import path from "path";
import {vacationSocketService} from "./vacation-socket-service";

interface CountRow {
    numberOfVacations: number;
}

class VacationService {

    public async addVacation(vacation: Vacation): Promise<Vacation> {
        vacation.validate();
        const sql = "insert into vacation (destination, description, startDate, endDate, price, imageName) values (?, ?, ?, ?, ?, ?)";
        const result = await dal.execute(sql, [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price, vacation.imageName]) as ResultSetHeader;
        vacation = await this.getSingleVacation(result.insertId);
        vacation.numberOfFollowers = 0;

        const toDisplay = (d: string) => d.split("-").reverse().join("/");
        const vacationForSocket = {
            ...vacation,
            startDate: toDisplay(String(vacation.startDate)),
            endDate: toDisplay(String(vacation.endDate))
        } as unknown as Vacation;
        vacationSocketService.sendVacation(vacationForSocket);

        return vacation;
    }

    public async getSingleVacation(id: number): Promise<Vacation> {
        const sql = "select id, destination, description, DATE_FORMAT(startDate, '%Y-%m-%d') as startDate, DATE_FORMAT(endDate, '%Y-%m-%d') as endDate, price, imageName as image from vacation where id = ?";
        const vacationList = await dal.execute(sql, [id]) as Vacation[];
        const vacation = vacationList[0];
        if (!vacation) {
            throw new ResourceNotFound(id);
        }
        return vacation;
    }

    public async getVacationsList(offset: number): Promise<Vacation[]> {
        const sql = "select v.id, v.destination, v.description, DATE_FORMAT(v.startDate, '%d/%m/%Y') as startDate, DATE_FORMAT(v.endDate, '%d/%m/%Y') as endDate, v.price, v.imageName as image, (select count(*) from follower f where f.vacationId = v.id) as numberOfFollowers from vacation v order by v.startDate ASC limit ? offset ?";
        const vacationList = await dal.execute(sql, [appConfig.sqlLimit, offset]) as Vacation[];
        return vacationList;
    }

    public async getVacationsCount(): Promise<number> {
        const sql = "select count(*) as numberOfVacations from vacation";
        const result = await dal.execute(sql) as CountRow[];
        return result[0].numberOfVacations;
    }

    public async updateVacation(id: number, vacation: Vacation): Promise<void> {
        vacation.validate(true);
        // deleting existing image before update
        const rows = await dal.execute("select imageName from vacation where id = ?", [id]) as Vacation[];
        const existingImageName = rows[0]?.imageName;
        if (vacation.imageName && existingImageName) {
            const oldImagePath = path.join("uploads", existingImageName);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
        if (!vacation.imageName) {
            vacation.imageName = existingImageName;
        }

        const sql = "update vacation set destination = ?, description = ?, startDate = ?, endDate = ?, price = ?, imageName = ? where id = ?";
        const result = await dal.execute(sql, [vacation.destination, vacation.description, vacation.startDate, vacation.endDate, vacation.price, vacation.imageName, id]) as ResultSetHeader;
        if (result.affectedRows === 0) {
            throw new ResourceNotFound(id);
        }
    }

    public async deleteVacation(id: number): Promise<void> {
        // deleting existing image before delete
        const rows = await dal.execute("select imageName from vacation where id = ?", [id]) as Vacation[];
        const existingImageName = rows[0]?.imageName;
        if (existingImageName) {
            const oldImagePath = path.join("uploads", existingImageName);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const sql = "delete from vacation where id = ?";
        const result = await dal.execute(sql, [id]) as ResultSetHeader;
        if (result.affectedRows === 0) {
            throw new ResourceNotFound(id);
        }
        vacationSocketService.deleteVacation(id);
    }

    public async getFollowedVacationsListByUserId(userId: number, offset: number): Promise<Vacation[]> {
        const sql = "select v.id, v.destination, v.description, DATE_FORMAT(v.startDate, '%d/%m/%Y') as startDate, DATE_FORMAT(v.endDate, '%d/%m/%Y') as endDate, v.price, v.imageName as image, (select count(*) from follower f2 where f2.vacationId = v.id) as numberOfFollowers from vacation v join follower f on f.vacationId = v.id and f.userId = ? order by v.startDate ASC limit ? offset ?";
        const vacationList = await dal.execute(sql, [userId, appConfig.sqlLimit, offset]) as Vacation[];
        return vacationList;
    }

    public async getFollowedVacationsCountByUserId(userId: number): Promise<number> {
        const sql = "select count(*) as numberOfVacations from vacation v inner join follower f on v.id = f.vacationId where f.userId = ?";
        const result = await dal.execute(sql, [userId]) as CountRow[];
        return result[0].numberOfVacations;
    }

    public async getFutureVacationsCount(): Promise<number> {
        const sql = "select count(*) as numberOfVacations from vacation v where v.startDate > CURDATE()";
        const result = await dal.execute(sql) as CountRow[];
        return result[0].numberOfVacations;
    }

    public async getFutureVacationsList(offset: number): Promise<Vacation[]> {
        const sql = "select v.id, v.destination, v.description, DATE_FORMAT(v.startDate, '%d/%m/%Y') as startDate, DATE_FORMAT(v.endDate, '%d/%m/%Y') as endDate, v.price, v.imageName as image, (select count(*) from follower f where f.vacationId = v.id) as numberOfFollowers from vacation v where v.startDate > CURDATE() order by v.startDate ASC limit ? offset ?";
        const vacationList = await dal.execute(sql, [appConfig.sqlLimit, offset]) as Vacation[];
        return vacationList;
    }

    public async getActiveVacationsCount(): Promise<number> {
        const sql = "select count(*) as numberOfVacations from vacation v where v.startDate <= CURDATE() and v.endDate >= CURDATE()";
        const result = await dal.execute(sql) as CountRow[];
        return result[0].numberOfVacations;
    }

    public async getActiveVacationsList(offset: number): Promise<Vacation[]> {
        const sql = "select v.id, v.destination, v.description, DATE_FORMAT(v.startDate, '%d/%m/%Y') as startDate, DATE_FORMAT(v.endDate, '%d/%m/%Y') as endDate, v.price, v.imageName as image, (select count(*) from follower f where f.vacationId = v.id) as numberOfFollowers from vacation v where v.startDate <= CURDATE() and v.endDate >= CURDATE() order by v.startDate ASC limit ? offset ?";
        const vacationList = await dal.execute(sql, [appConfig.sqlLimit, offset]) as Vacation[];
        return vacationList;
    }

    public async getAllVacationsList(): Promise<Vacation[]> {
        const sql = "select v.id, v.destination, v.description, DATE_FORMAT(v.startDate, '%d/%m/%Y') as startDate, DATE_FORMAT(v.endDate, '%d/%m/%Y') as endDate, v.price, v.imageName as image, (select count(*) from follower f where f.vacationId = v.id) as numberOfFollowers from vacation v";
        const vacationList = await dal.execute(sql) as Vacation[];
        return vacationList;
    }


}

export const vacationService = new VacationService();
