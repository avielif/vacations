import {StatusCode} from "./enums";

abstract class BaseClientError extends Error {
    constructor(public status: StatusCode, public message: string) {
        super(message);
    }
}

export class RoutNotFound extends BaseClientError {
    constructor(route: string) {
        super(StatusCode.NotFound, "Rout " + route + " Not Found");
    }
}

export class ResourceNotFound extends BaseClientError {
    constructor(id: number | string, secondId?: number | string) {
        super(StatusCode.NotFound, "id " + id + (secondId ? " And id " + secondId : "") + " Not Found");
    }
}

export class ValidationError extends BaseClientError {
    constructor(message: string) {
        super(StatusCode.BadRequest, message);
    }
}

export class EmailError extends BaseClientError {
    constructor(message: string) {
        super(StatusCode.EmailAlreadyTaken, message);
    }
}

export class UnauthorizedError extends BaseClientError {
    constructor(message: string) {
        super(StatusCode.Unauthorized, message);
    }
}
