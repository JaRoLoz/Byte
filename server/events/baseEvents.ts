import { PlayerController } from "../controllers/playerController";
import { DeferralManager } from "../deferrals/deferralManager";

AddEventHandler("playerConnecting", DeferralManager.defer);
AddEventHandler("playerDropped", reason => PlayerController.getInstance().onPlayerDropped(reason));
