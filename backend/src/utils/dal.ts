import mysql2, {PoolOptions, QueryResult} from "mysql2";
import {appConfig} from "./app-config";
import {ValidationError} from "../models/client-error";

class Dal {
    private option: PoolOptions = {
        host: appConfig.host,
        user: appConfig.user,
        password: appConfig.password,
        database: appConfig.database,
    }
    private connection = mysql2.createPool(this.option);
    private poolPromise = this.connection.promise();

    public async execute(sql: string, params?: any[]): Promise<QueryResult> {
        try {
            const [result] = await this.poolPromise.query(sql, params);
            return result;
        }
        catch (error) {
            const errMsg = error as any;
            if (errMsg.code === "ER_DUP_ENTRY") {
                throw new ValidationError("Duplicate Vacation and Follower");
            }
            throw new Error("");
        }
    }
}

export const dal = new Dal ();
