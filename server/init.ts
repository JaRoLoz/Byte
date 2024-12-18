import { DB } from "./database/db";
import { DeferralManager } from "./deferrals/deferralManager";
import { Err, Ok, Result } from "./shared/classes/result";
import { getTranslator } from "./shared/classes/translator";
import { XMLSearchNode } from "./shared/classes/xml";
import { ConfigController } from "./shared/classes/configController";
import { EnvManager } from "./utils/env";
import { Logger } from "./utils/logger";

let hasInitiated = false;

/**
 * Function that makes sure that all the necessary components and variables are set up in order to start the server.
 * This function should **only** be called at the **beginning** of the server's lifecycle.
 * @returns A result whose error is a string that describes the error that occurred during the initialization process.
 */
export const init = (): Result<null, string> => {
    if (hasInitiated) {
        const logger = new Logger("init");
        const translator = getTranslator();
        logger.warn(translator.get("Server.Console.InitAlreadyCalled"));
        return Ok(null);
    }

    if (DeferralManager.getDeferral("steamDeferral").isSome() && EnvManager.getSteamWebApiKey() === "none")
        return Err("Steam deferral is enabled but no Steam Web API key is set");

    const configXml = LoadResourceFile(GetCurrentResourceName(), "assets/config.xml");
    if (configXml === "") return Err("No config.xml file found");

    const eventsXml = LoadResourceFile(GetCurrentResourceName(), "assets/events.xml");
    if (eventsXml === "") return Err("No events.xml file found");

    const localeXml = LoadResourceFile(GetCurrentResourceName(), "assets/locales.xml");
    if (localeXml === "") return Err("No locales.xml file found");

    const config = ConfigController.getInstance();
    const localExists = new XMLSearchNode(XML.decode(localeXml).children[0]).search({
        tag: "translation",
        attrs: { key: "lang", value: config.getLocale() }
    })[0];
    if (!localExists) return Err(`No translations found for '${config.getLocale()}' locale.`);

    const [pgErr, pgErrString] = DB.readySync();
    if (pgErr) return Err("Failed to connect to Byte-pg: " + pgErrString);

    hasInitiated = true;
    return Ok(null);
};
