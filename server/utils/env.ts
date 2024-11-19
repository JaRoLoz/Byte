/** @noSelf **/
export class EnvManager {
    private constructor() {}
    public static getMaxClient = (): number | 48 => GetConvarInt("sv_maxclients", 48);
    public static getGameBuild = (): number | 1604 => GetConvarInt("sv_enforceGameBuild", 1604);
    public static getTags = (): string | "" => GetConvar("tags", "");
    public static getSteamWebApiKey = (): string | "none" => GetConvar("steam_webApiKey", "none");
    public static getServerClosed = (): boolean | true => GetConvarInt("serverClosed", 1) == 1;
    public static getDebug = (): boolean | false => GetConvarInt("debug", 0) == 1;
    public static getProduction = (): boolean | false => GetConvarInt("production", 0) == 1;
}
