import { User } from "../classes/user";
import { Err, getTranslator, Ok } from "../shared/classes";
import { EnvManager } from "../utils/env";
import { Deferral } from "./deferralManager";

const translator = getTranslator();

const steamDeferral: Deferral = (src, playerName, setKickReason, deferrals) => {
    if (EnvManager.getDebug() || EnvManager.getSteamWebApiKey() === "none") return Ok(null);
    const user = new User(src);
    const steam = user.getIdentifier("steam");

    if (steam === undefined) return Ok(null);

    return Err(translator.get("Server.Deferrals.Steam.Rejected"));
};

export default steamDeferral;
