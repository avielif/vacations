export enum StatusCode {

    //Success
    OK = 200,
    Created = 201,
    NoContent = 204,

    // Errors
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    ServerError = 500,

    // My Error
    EmailAlreadyTaken = 999,
}

export enum RoleId {
    Admin = 1,
    User = 2,
}
