import { ConfigController } from "../shared/classes";
import { getEventNames } from "../shared/classes/eventNameController";
import { InventoryData } from "../shared/types";
import { Inventory } from "./inventory";
import { InventorySlot } from "./inventorySlot";

const eventNames = getEventNames();

export class PlayerInventory extends Inventory {
    constructor(data: InventorySlot[], maxWeight: number) {
        super(data, maxWeight);

        RegisterNetEvent(eventNames.get("Client.Inventory.SetInventory"), (data: InventoryData) => {
            const configController = ConfigController.getInstance();
            const items = configController.getItems();

            const slots = data.map(({ item, amount, info }) => {
                const itemClass = item !== undefined ? items[item] : undefined;
                return new InventorySlot(itemClass, amount, info);
            });

            this.slots = slots;
        });
    }
}
