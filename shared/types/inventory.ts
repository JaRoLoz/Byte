export type SlotData = {
    item?: string;
    amount: number;
    info?: SlotInfo;
};

export type SlotInfo = {
    displayStrings?: Record<string, string>;
    [key: string]: any;
};

export type InventoryData = Array<SlotData>;