import { User } from "../classes/user";
import { getTranslator } from "../shared/classes";
import { EnvManager } from "../utils/env";
import { Deferral } from "./deferralManager";

const translator = getTranslator();

const steamDeferral: Deferral = (src, playerName, setKickReason, deferrals) => {
    if (EnvManager.getDebug() || EnvManager.getSteamWebApiKey() === "none") return true;
    const user = new User(src);
    const steam = user.getIdentifier("steam");

    if (steam === undefined) return true;

    deferrals.done(translator.get("Server.Deferrals.Steam.Rejected"));
    return false;
};

export default steamDeferral;
