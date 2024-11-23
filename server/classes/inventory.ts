import { ConfigController, Item } from "../shared/classes";
import { InventorySlot } from "./inventorySlot";
import type { IObjectifiable } from "../shared/interfaces/IObjectifiable";
import type { InventoryData, SlotInfo } from "../shared/types/inventory";

export abstract class Inventory implements IObjectifiable<InventoryData> {
    protected slots: InventorySlot[];
    protected maxWeight: number;
    /** @noSelf **/
    // public static fromObject = (data: SlotData[], size: number, maxWeight: number) => {
    //     const slots = data.map(({ item, amount, info }) => {
    //         const itemClass = item !== undefined ? items[item] : undefined;
    //         return new InventorySlot(itemClass, amount, info);
    //     });
    //     return new Inventory(slots, size, maxWeight);
    // };

    constructor(data: InventorySlot[], size: number, maxWeight: number) {
        this.maxWeight = maxWeight;
        if (data.length !== size) {
            this.slots = [];
            for (let slotNumber = 0; slotNumber < size; slotNumber++) {
                this.slots[slotNumber] = data[slotNumber] || new InventorySlot(undefined, 0, undefined);
            }
        } else {
            this.slots = data;
        }
    }

    public getTotalWeight = () =>
        this.slots.reduce((total, slot) => {
            if (slot.getItem() !== undefined) {
                return total + slot.getItem()!.getWeight() * slot.getAmount();
            } else {
                return total;
            }
        }, 0);

    public getEmptySlot = () => this.slots.findIndex(slot => slot.getItem() === undefined);

    public getSlotWithItem = (item: Item) => this.slots.findIndex(slot => slot.getItem()?.getName() === item.getName());

    protected _addItem = (item: Item, amount: number = 1, info: SlotInfo | undefined = undefined) => {
        const configController = ConfigController.getInstance();
        const items = configController.getItems();
        const itemClass = items[item.getName()];

        if (this.getTotalWeight() + itemClass.getWeight() * amount > this.maxWeight) {
            //max weight reached
            return false;
        }

        if (itemClass.getUnique()) {
            const freeSlot = this.getEmptySlot();
            if (freeSlot === -1) return false;
            this.slots[freeSlot].setItem(itemClass, amount);
            this.slots[freeSlot].setInfo(info);
        } else {
            const sameSlot = this.getSlotWithItem(item);
            if (sameSlot === -1) {
                const freeSlot = this.getEmptySlot();
                if (freeSlot === -1) return false;
                this.slots[freeSlot].setItem(itemClass, amount);
                this.slots[freeSlot].setInfo(info);
            } else {
                this.slots[sameSlot].addAmount(amount);
            }
        }

        return true;
    };

    protected _removeItem = (item: Item, amount: number = 1) => {
        while (amount > 0) {
            const slot = this.getSlotWithItem(item);

            if (slot !== -1) {
                if (this.slots[slot].getAmount() > amount) {
                    this.slots[slot].removeAmount(amount);
                    break;
                } else {
                    amount -= this.slots[slot].getAmount();
                    this.slots[slot].setAmount(0);
                }
            } else {
                // item not found
                return false;
            }
        }
        return true;
    };

    public getItemAmount = (item: Item) => {
        const containingSlots = this.slots.filter(slot => slot.getItem()?.getName() === item.getName());
        return containingSlots.reduce((total, slot) => total + slot.getAmount(), 0);
    };

    protected _moveSlot = (from: number, to: number, amount: number = 1) => {
        const fromSlot = this.slots[from];
        const toSlot = this.slots[to];

        const fromItem = fromSlot.getItem();
        const toItem = toSlot.getItem();

        const fromAmount = fromSlot.getAmount();
        const toAmount = toSlot.getAmount();

        const fromInfo = fromSlot.getInfo();
        const toInfo = toSlot.getInfo();

        fromSlot.setItem(toItem!, toAmount);
        fromSlot.setInfo(toInfo!);

        toSlot.setItem(fromItem!, fromAmount);
        toSlot.setInfo(fromInfo!);
    };

    public toObject = () => this.slots.map(slot => slot.toObject());
}
