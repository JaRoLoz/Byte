import { Inventory } from "./inventory";
import { InventorySlot } from "./inventorySlot";
import type { SlotData, SlotInfo } from "../shared/types/inventory";
import { ConfigController, Item } from "../shared/classes";
import { getEventNames } from "../shared/classes/eventNameController";

const eventNames = getEventNames();

export class PlayerInventory extends Inventory {
    private src: number;

    constructor(src: number, data: InventorySlot[], size: number, maxWeight: number) {
        super(data, size, maxWeight);
        this.src = src;
    }

    public addItem = (item: Item, amount?: number, info?: SlotInfo) => {
        const result = this._addItem(item, amount, info);
        this.emitChanges();
        return result;
    };

    public removeItem = (item: Item, amount?: number) => {
        const result = this._removeItem(item, amount);
        this.emitChanges();
        return result;
    };

    public moveSlot = (from: number, to: number, amount?: number) => {
        this._moveSlot(from, to, amount);
        this.emitChanges();
    };

    private emitChanges = () =>
        TriggerClientEvent(eventNames.get("Client.Inventory.SetInventory"), this.src, this.toObject());

    /** @noSelf **/
    public static fromObject = (src: number, data: SlotData[], size: number, maxWeight: number) => {
        const configController = ConfigController.getInstance();
        const items = configController.getItems();

        const slots = data.map(({ item, amount, info }) => {
            const itemClass = item !== undefined ? items[item] : undefined;
            return new InventorySlot(itemClass, amount, info);
        });
        return new PlayerInventory(src, slots, size, maxWeight);
    };
}
