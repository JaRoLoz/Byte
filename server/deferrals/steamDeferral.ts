import { User } from "../classes/user";
import { EnvManager } from "../utils/env";
import { Deferral } from "./deferralManager";

const steamDeferral: Deferral = (src, playerName, setKickReason, deferrals) => {
    if (EnvManager.getDebug() || EnvManager.getSteamWebApiKey() === "none") return true;
    const user = new User(src);
    const steam = user.getIdentifier("steam");

    if (steam === undefined) return true;

    deferrals.done("No puedes acceder al servidor con steam abierto.");
    return false;
};

export default steamDeferral;
