import { User } from "../classes/user";
import { getTranslator } from "../shared/classes";
import { Deferral } from "./deferralManager";

const translator = getTranslator();

const discordDeferral: Deferral = (src, playerName, setKickReason, deferrals) => {
    const user = new User(src);
    const discord = user.getIdentifier("discord");

    if (!discord) {
        deferrals.done(translator.get("Server.Deferrals.Dicord.Rejected"));
        return false;
    }

    return true;
};

export default discordDeferral;
