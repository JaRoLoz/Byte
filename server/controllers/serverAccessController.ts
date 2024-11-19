import { User } from "../classes/user";
import { Deferral } from "../deferrals/deferralManager";
import { getTranslator } from "../shared/classes";
import { EnvManager } from "../utils/env";
import { Privilege } from "./privilegeController";

const translator = getTranslator();

/** @noSelf **/
export class ServerAccessController {
    private static instance: ServerAccessController;
    private serverClosed = EnvManager.getServerClosed();

    private constructor() {}

    public getServerClosed = () => this.serverClosed;
    public setServerClosed = (closed: boolean) => (this.serverClosed = closed);

    public deferral: Deferral = (src, _playerName, _setKickReason, deferrals) => {
        if (!this.serverClosed) return true;

        const user = new User(src);
        const hasPermission = user.hasPrivilege(Privilege.WHITELISTED);

        if (!hasPermission) {
            deferrals.done(translator.get("Server.Deferrals.Access.Rejected"));
            return false;
        }

        return true;
    };

    /** @noSelf **/
    public static getInstance = () => {
        if (!ServerAccessController.instance) {
            ServerAccessController.instance = new ServerAccessController();
        }

        return ServerAccessController.instance;
    };
}
