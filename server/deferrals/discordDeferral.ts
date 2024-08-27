import { User } from "../classes/user";
import { Deferral } from "./deferralManager";

const discordDeferral: Deferral = (src, playerName, setKickReason, deferrals) => {
    const user = new User(src);
    const discord = user.getIdentifier("discord");

    if (!discord) {
        deferrals.done("Debes tener tu cuenta de discord vinculada a FiveM para acceder al servidor.");
        return false;
    }

    return true;
};

export default discordDeferral;
