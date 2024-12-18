import { User } from "../classes/user";
import { Deferral } from "../deferrals/deferralManager";
import { Err, Ok } from "../shared/classes/result";
import { getTranslator } from "../shared/classes/translator";
import { EnvManager } from "../utils/env";
import { Privilege } from "./privilegeController";

const translator = getTranslator();

/** @noSelf **/
export class ServerAccessController {
    private static instance: ServerAccessController;
    private serverClosed = EnvManager.getServerClosed();

    private constructor() { }

    public getServerClosed = () => this.serverClosed;
    public setServerClosed = (closed: boolean) => (this.serverClosed = closed);

    public deferral: Deferral = (src, _playerName, _setKickReason, _deferrals) => {
        if (!this.serverClosed) return Ok(null);

        const user = new User(src);
        const hasPermission = user.hasPrivilege(Privilege.WHITELISTED);

        if (!hasPermission) {
            return Err(translator.get("Server.Deferrals.Access.Rejected"));
        }

        return Ok(null);
    };

    /** @noSelf **/
    public static getInstance = () => {
        if (!ServerAccessController.instance) {
            ServerAccessController.instance = new ServerAccessController();
        }

        return ServerAccessController.instance;
    };
}
