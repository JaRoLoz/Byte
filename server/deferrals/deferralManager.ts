import { ServerAccessController } from "../controllers/serverAccessController";
import { Logger } from "../utils/logger";
import discordDeferral from "./discordDeferral";
import steamDeferral from "./steamDeferral";

type KickFunction = (reason: string) => void;

export type Deferral = (src: number, playerName: string, setKickReason: KickFunction, deferrals: any) => boolean;

const logger = Logger.construct("DeferralManager");

/** @noSelf **/
export class DeferralManager {
    private static deferrals: Record<string, Deferral> = {
        steamDeferral,
        discordDeferral,
        accessDeferral: ServerAccessController.getInstance().deferral
    };

    public static addDeferral = (name: string, deferral: Deferral) => {
        logger.debug(`Adding deferral: ${name}`);
        DeferralManager.deferrals[name] = deferral;
    };

    public static removeDeferral = (name: string) => {
        logger.debug(`Removing deferral: ${name}`);
        delete DeferralManager.deferrals[name];
    };

    public static defer = (playerName: string, setKickReason: KickFunction, deferrals: any) => {
        const src = source;

        deferrals.defer();
        Wait(0);

        logger.debug(`Deferring player: ${playerName} (${src})`);
        deferrals.update(`Deferring connection...`);

        for (const [deferralName, deferral] of Object.entries(DeferralManager.deferrals)) {
            const result = deferral(src, playerName, setKickReason, deferrals);
            if (!result) {
                logger.debug(`Deferral \`${deferralName}\` rejected for player: ${playerName} (${src})`);
                return;
            }
        }

        deferrals.done();
        logger.debug(`Deferral completed for player: ${playerName} (${src})`);
    };
}
