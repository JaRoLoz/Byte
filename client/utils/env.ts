/** @noSelf **/
export class EnvManager {
    public static getServerClosed = () => GetConvarInt("serverClosed", 1) == 1;
    public static getDebug = () => GetConvarInt("debug", 0) == 1;
}
