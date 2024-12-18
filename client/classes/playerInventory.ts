import { ConfigController } from "../shared/classes/configController";
import { getEventNames } from "../shared/classes/eventNameController";
import { InventoryData } from "../shared/types/inventory";
import { Inventory } from "./inventory";
import { InventorySlot } from "./inventorySlot";

const eventNames = getEventNames();
const items = ConfigController.getInstance().getItems();

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

    /** @noSelf **/
    public static fromObject = (data: InventoryData, maxWeight: number) =>
        new PlayerInventory(
            data.map(({ item, amount, info }) => new InventorySlot(item ? items[item] : undefined, amount, info)),
            maxWeight
        );
}
