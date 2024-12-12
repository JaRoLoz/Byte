import { Player } from "../classes";
import { getTranslator } from "../shared/classes";
import { getEventNames } from "../shared/classes/eventNameController";
import { PedData } from "../shared/types";
import { Logger } from "../utils/logger";

const eventNames = getEventNames();
const translator = getTranslator();
const logger = new Logger("Events");

RegisterNetEvent(eventNames.get("Client.Player.SetPlayerPedData"), (data: PedData) => {
    const player = Player.getInstance();

    if (!player.isSome()) {
        logger.error(translator.get("Client.Events.Player.SetPlayerPedData.NoPlayer"));
        return;
    }

    player.unwrap().getPed().setPedData(data);
});
