import {User} from "../models/user";
import bcrypt from "bcrypt";
import jwt, {SignOptions} from "jsonwebtoken";
import {appConfig} from "../utils/app-config";
import {RoleId} from "../models/enums";

class SecureService {

    public async hash(text: string): Promise<string> {
        return await bcrypt.hash(text, 10);
    }

    public generateToken(user: User): string {
        delete (user as any).password;
        const container = { user };
        const options: SignOptions = { expiresIn: "30m" };
        return jwt.sign(container, appConfig.secretKey, options);
    }

    public validateToken(token: string): boolean {
        if (!token) return false;
        try {
            jwt.verify(token, appConfig.secretKey);
            return true;
        }
        catch (error) {
            return false;
        }
    }

    public validateAdmin(token: string): boolean {
        if (!token) return false;
        try {
            jwt.verify(token, appConfig.secretKey);
            const container = jwt.decode(token) as {user: User};
            const user = container.user;
            return user.roleId === RoleId.Admin;
        }
        catch (error) {
            return false;
        }
    }

    public getAdminId(token: string): number {
        const container = jwt.decode(token) as {user: User};
        return container.user.id!;
    }

}

export const secureService = new SecureService();
