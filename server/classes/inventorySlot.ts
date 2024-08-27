import { Item } from "../shared/classes/item";
import type { IObjectifiable } from "../shared/interfaces/IObjectifiable";
import type { SlotData, SlotInfo } from "../shared/types/inventory";

export class InventorySlot implements IObjectifiable<SlotData> {
    private item?: Item;
    private amount: number;
    private info?: SlotInfo;

    constructor(item: Item | undefined, amount: number, info: SlotInfo | undefined) {
        this.item = item;
        this.amount = amount;
        this.info = info;

        if (this.amount <= 0 || this.item === undefined) {
            this.amount = 0;
            this.item = undefined;
            this.info = undefined;
        }

        if (this.item !== undefined && this.item.getUnique()) {
            if (this.amount > 1) {
                this.amount = 1;
            }
        }
    }

    public getItem = () => this.item;
    public getAmount = () => this.amount;
    public getInfo = () => this.info;

    public setItem = (item: Item, amount: number = 1) => {
        this.item = item;
        this.amount = amount;
        if (amount <= 0) {
            this.item = undefined;
            this.info = undefined;
        }
    };

    public setAmount = (amount: number) => {
        if (amount <= 0) {
            this.amount = 0;
            this.item = undefined;
            this.info = undefined;
        } else {
            this.amount = amount;
        }
    };

    public setInfo = (info: SlotInfo) => {
        this.info = info;
    };

    public addAmount = (amount: number) => {
        this.amount += amount;
    };

    public removeAmount = (amount: number) => {
        this.amount -= amount;

        if (this.amount <= 0) {
            this.amount = 0;
            this.item = undefined;
            this.info = undefined;
        }
    };

    public getWeight = () => {
        if (this.item === undefined) return 0;
        return this.item.getWeight() * this.amount;
    };

    public toObject = () => ({
        item: this.item?.getName(),
        amount: this.amount,
        info: this.info
    });
}
