import { uuid } from "../shared/utils/uuid";
import { Player } from "../classes/player";
import { Command } from "../controllers/commandController";
import { Logger } from "../utils/logger";
import { PlayerGender } from "../shared/types/player";
import { ConfigController } from "../shared/classes";
import { PlayerInventory } from "../classes/playerInventory";

const logger = new Logger("testPlayer");

const testPlayer: Command = {
    command: "testPlayer",
    privilege: "NONE",
    commandFn: src => {
        const toSource = 1;
        const configController = ConfigController.getInstance();
        const items = configController.getItems();

        const player = new Player(
            toSource,
            uuid(),
            {
                firstname: "Test",
                lastname: "Player",
                birthdate: "01/01/2000",
                gender: PlayerGender.MALE,
                nationality: "TestLand"
            },
            PlayerInventory.fromObject(
                toSource,
                [],
                configController.getInventorySlots(),
                configController.getMaxPlayerWeight()
            ),
            vector3(0, 0, 0),
            {
                name: "police",
                grade: 1
            },
            {
                name: "ballas",
                grade: 4
            }
        );

        const inventory = player.getInventory();
        inventory.addItem(items.tosti.getName(), 13);
        inventory.addItem(items.whisky.getName(), 37);
        inventory.addItem(items.weapon_pistol.getName(), 1);
        inventory.addItem(items.weapon_pistol.getName(), 1);
        inventory.addItem(items.weapon_pistol.getName(), 1);

        player.save();
        logger.debug(`New player saved with UUID -> ${player.getUuid()}`);
    }
};

export default testPlayer;
