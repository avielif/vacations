import {User} from "../models/user";
import {dal} from "../utils/dal";
import {ResourceNotFound, UnauthorizedError, ValidationError} from "../models/client-error";
import {ResultSetHeader} from "mysql2";
import {secureService} from "./secure-service";
import bcrypt from "bcrypt";
import {UserCredentials} from "../models/user-credentials";
import {socketService} from "./socket-service";
import {RoleId} from "../models/enums";


class AuthService {

    public async register(user: User): Promise<string> {

        user.validate();

        const isEmailExist = await this.validateEmail(user.email);
        if (isEmailExist) throw new ValidationError("email already exists");

        user.password = await secureService.hash(user.password);

        const sql = "insert into user (firstName, lastName, email, password, roleId) values(?, ?, ?, ?, ?)"
        const result = await dal.execute(sql, [user.firstName, user.lastName, user.email, user.password, user.roleId]) as ResultSetHeader;
        user.id = result.insertId;
        // socketService.socketServer.to("Admin").emit("connectUser", user);
        return secureService.generateToken(user);
    }

    public async login(userCredentials: UserCredentials): Promise<string> {

        userCredentials.validate();

        const sql = "select * from user where email = ?";
        const userList = await dal.execute(sql, [userCredentials.email]) as User[];
        const user = userList[0];
        if (!user) throw new UnauthorizedError("Incorrect email or password");
        const isPasswordCorrect = await bcrypt.compare(userCredentials.password, user.password);
        if (!isPasswordCorrect) throw new UnauthorizedError("Incorrect email or password");
        // socketService.socketServer.to("Admin").emit("connectUser", user);
        return secureService.generateToken(user);
    }

    public async validateEmail(email: string): Promise<boolean> {
        const sql = "select * from user where email = ?";
        const userList = await dal.execute(sql, [email]) as User[];
        const user = userList[0];
        return user !== undefined;
    }

    public async getSingleUser(id: number): Promise<User> {
        const sql = "select * from user where id = ?";
        const userList = await dal.execute(sql, [id]) as User[];
        const user = userList[0];
        if (!user) {
            throw new ResourceNotFound(id);
        }
        return user;
    }

}

export const authService = new AuthService();
