import { ServerAccessController } from "../controllers/serverAccessController";
import { getTranslator, Optional, Result } from "../shared/classes";
import { Logger } from "../utils/logger";
import discordDeferral from "./discordDeferral";
import steamDeferral from "./steamDeferral";

type KickFunction = (this: void, reason: string) => void;

/**
 * Type of a deferral function that is called when a player is connecting.
 * If the result is an error, the player is kicked with the error message provided as the result error.
 */
export type Deferral = (
    src: number,
    playerName: string,
    setKickReason: KickFunction,
    deferrals: any
) => Result<null, string>;

const translator = getTranslator();
const logger = new Logger("DeferralManager");

/**
 * Static class that manages deferrals for connecting players.
 * @noSelf
 */
export class DeferralManager {
    private static deferrals: Record<string, Deferral> = {
        steamDeferral,
        discordDeferral,
        accessDeferral: ServerAccessController.getInstance().deferral
    };

    /**
     * Adds a deferral to the deferral queue.
     * @param name Unique name for the deferral.
     * @param deferral The deferral function to add.
     */
    public static addDeferral = (name: string, deferral: Deferral) => {
        logger.debug(`Adding deferral: ${name}`);
        DeferralManager.deferrals[name] = deferral;
    };

    /**
     * Removes a deferral from the deferral queue.
     * @param name Unique name of the deferral to remove.
     */
    public static removeDeferral = (name: string) => {
        logger.debug(`Removing deferral: ${name}`);
        delete DeferralManager.deferrals[name];
    };

    /**
     * Gets a deferral function from the deferral queue.
     * @param name Unique name of the deferral to get.
     * @returns The deferral function if it exists, otherwise None.
     */
    public static getDeferral = (name: string): Optional<Deferral> => {
        if (DeferralManager.deferrals[name]) return Optional.Some(DeferralManager.deferrals[name]);
        return Optional.None();
    };

    /**
     *
     * @param playerName Steam / Client name of the connecting player
     * @param setKickReason Function to set the kick reason (does not seem to work)
     * @param deferrals Deferral object provided by the Cfx.re framework
     */
    public static defer = (playerName: string, setKickReason: KickFunction, deferrals: any) => {
        const src = source;

        deferrals.defer();
        Wait(0);

        logger.debug(`Deferring player: ${playerName} (${src})`);
        deferrals.update(translator.get("Server.Deferrals.Deferring"));

        for (const [deferralName, deferral] of Object.entries(DeferralManager.deferrals)) {
            const [err, errString] = deferral(src, playerName, setKickReason, deferrals);
            if (err) {
                deferrals.done(errString);
                logger.debug(`Deferral \`${deferralName}\` rejected for player: ${playerName} (${src})`);
                return;
            }
        }

        deferrals.done();
        logger.debug(`Deferral completed for player: ${playerName} (${src})`);
    };
}
