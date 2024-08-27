import { Item } from "./item";
import { XMLSearchNode } from "./xml";

export class ConfigController {
    /** @noSelf **/
    private static instance: ConfigController;
    
    private items: Record<string, Item>;
    private inventorySlots: number;
    private maxPlayerWeight: number;
    private locale: string;

    private constructor() {
        const xmlRootNode = XML.decode(LoadResourceFile(GetCurrentResourceName(), "assets/config.xml")).children[0];
        const xml = XMLSearchNode.construct(xmlRootNode);
        
        const globalNode = xml.search({ tag: "global" })[0];
        const coreNode = xml.search({ tag: "core" })[0];
        const inventoryNode = coreNode.search({ tag: "inventory" })[0];

        this.items = inventoryNode
        .search({ tag: "items" })[0]
        .search({ tag: "item" })
        .map(item => {
            const name = item.search({ tag: "name" })[0].asText();
            const label = item.search({ tag: "label" })[0].asText();
            const description = item.search({ tag: "description" })[0].asText();
            const weight = Number(item.search({ tag: "weight" })[0].asText());
            const unique = item.search({ tag: "unique" })[0].asText() === "true";
            return new Item(name, label, description, weight, unique);
        })
        .reduce((acc, item) => ({ ...acc, [item.getName()]: item }), {});

        this.inventorySlots = Number(inventoryNode.search({ tag: "inventorySlots" })[0].asText());
        this.maxPlayerWeight = Number(inventoryNode.search({ tag: "maxPlayerWeight" })[0].asText());
        this.locale = globalNode.search({ tag: "locale" })[0].asText();
    }

    public getItems = (): Record<string, Item> => this.items;
    public getInventorySlots = (): number => this.inventorySlots;
    public getMaxPlayerWeight = (): number => this.maxPlayerWeight;
    public getLocale = (): string => this.locale;

    /** @noSelf **/
    public static getInstance = (): ConfigController => {
        if (!ConfigController.instance) {
            ConfigController.instance = new ConfigController();
        }

        return ConfigController.instance;
    }
}