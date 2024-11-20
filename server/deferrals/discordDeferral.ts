import { User } from "../classes/user";
import { Err, getTranslator, Ok } from "../shared/classes";
import { Deferral } from "./deferralManager";

const translator = getTranslator();

const discordDeferral: Deferral = (src, playerName, setKickReason, deferrals) => {
    const user = new User(src);
    const discord = user.getIdentifier("discord");

    if (!discord) {
        return Err(translator.get("Server.Deferrals.Discord.Rejected"));
    }

    return Ok(null);
};

export default discordDeferral;
