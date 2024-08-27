/** @noSelf **/
export class EnvManager {
    public static getMaxClient = () => GetConvarInt("sv_maxclients", 48);
    public static getGameBuild = () => GetConvarInt("sv_enforceGameBuild", 1604);
    public static getTags = () => GetConvar("tags", "");
    public static getSteamWebApiKey = () => GetConvar("steam_webApiKey", "none");
    public static getServerClosed = () => GetConvarInt("serverClosed", 1) == 1;
    public static getDebug = () => GetConvarInt("debug", 0) == 1;
}
