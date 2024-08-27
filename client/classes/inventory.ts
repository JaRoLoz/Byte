import { IObjectifiable } from "../shared/interfaces";
import { InventoryData } from "../shared/types";
import { InventorySlot } from "./inventorySlot";

export abstract class Inventory implements IObjectifiable<InventoryData> {
    protected slots: InventorySlot[];
    protected maxWeight: number;

    constructor(data: InventorySlot[], maxWeight: number) {
        this.maxWeight = maxWeight;
        this.slots = data;
    }

    public getMaxWeight = () => this.maxWeight;
    public getSlots = () => this.slots;
    public getSlot = (slot: number) => this.slots[slot];

    public getSlotWithItem = (item: string) => this.slots.findIndex(slot => slot.getItem()?.getName() === item);

    public getItemAmount = (item: string) => {
        const containingSlots = this.slots.filter(slot => slot.getItem()?.getName() === item);
        return containingSlots.reduce((total, slot) => total + slot.getAmount(), 0);
    };

    public getEmptySlot = () => this.slots.findIndex(slot => slot.getItem() === undefined);

    public getTotalWeight = () =>
        this.slots.reduce((total, slot) => {
            if (slot.getItem() !== undefined) {
                return total + slot.getItem()!.getWeight() * slot.getAmount();
            } else {
                return total;
            }
        }, 0);

    public toObject = () => this.slots.map(slot => slot.toObject());
}
