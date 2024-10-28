import { InventorySlot } from "./classes/inventorySlot";
import { User } from "./classes/user";
import "./commands/commands";
import "./events/baseEvents";
import "./events/exports";
import type { ByteExport } from "./events/exports";
import { ConfigController } from "./shared/classes";
import { getTranslator } from "./shared/classes/translator";
import { Logger } from "./utils/logger";

const logger = new Logger("main");
const translator = getTranslator();

logger.info(translator.get("Server.Console.ServerStarted"));

const config = ConfigController.getInstance();
const item = config.getItems()["weapon_pistol"];
const slot = new InventorySlot(item, 3, {
    serial: "1234567890",
    displayStrings: {
        serial: "Número de serie"
    }
});

logger.info(json.encode(slot.toObject()));

export { ByteExport };
