import { Player, PlayerInventory } from "../classes";
import { ConfigController, Timestamp } from "../shared/classes";
import { getEventNames } from "../shared/classes/eventNameController";
import { DBPlayerInfo } from "../shared/types";
import { parseVector4 } from "../shared/utils";
import { Logger } from "../utils/logger";

const eventNames = getEventNames();
const logger = new Logger("Events");
const config = ConfigController.getInstance();

RegisterNetEvent(eventNames.get("Client.Player.PlayerReadyData"), (playerData: DBPlayerInfo) => {
    const { uuid, data, jobs, gangs, inventory, position, pedData } = playerData;
    if (Player.getInstance().isSome()) {
        logger.warn(`Ignoring PlayerReady event for player ${uuid} because it was already emitted.`);
        return;
    }
    const player = new Player(
        uuid,
        { ...data, birthdate: new Timestamp(data.birthdate) },
        PlayerInventory.fromObject(inventory, config.getMaxPlayerWeight()),
        jobs,
        gangs,
        pedData,
        parseVector4(position)
    );
    Player.setInstance(player);
});
