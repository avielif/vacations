import mysql2, {PoolOptions, QueryResult} from "mysql2";
import {appConfig} from "./app-config";

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
        const [result] = await this.poolPromise.query(sql, params);
        return result;
    }
}

export const dal = new Dal ();
