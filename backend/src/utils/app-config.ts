class AppConfig {

    public readonly host = "localhost";
    public readonly user = "root";
    public readonly password = "123456";
    public readonly database = "vacations_project";
    public readonly secretKey = "791a89fc87c690d6d2962961ee3e6ab714bedf769ad1c897b48fb8a84f4817c4";
    public readonly sqlLimit = 10;
}

export const appConfig = new AppConfig();
