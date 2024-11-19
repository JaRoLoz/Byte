import { Logger } from "../../utils/logger";
import { XMLSearchNode } from "./xml";

type EventName = string;

export class EventNameController {
    private events: Record<string, EventName> = {};
    private logger = new Logger("EventNameController");

    constructor(xmlNode: XMLSearchNode) {
        // doing it the imperative way because it's faster
        for (const node of xmlNode.search({ tag: "eventName" })) {
            const key = node.asNode().attrs["key"];
            const value = node.asText();
            this.events[key] = value;
        }
    }

    public get = (key: string): EventName => {
        const event = this.events[key];
        if (!event) {
            this.logger.error(`Event with key ${key} not found`);
            return "";
        }
        return event;
    };
}


const xml = XML.decode(LoadResourceFile(GetCurrentResourceName(), "assets/events.xml"));
const xmlRoot = new XMLSearchNode(xml.children[0]);
let instance: EventNameController;

export const getEventNames = (): EventNameController => {
    if (!instance) {
        instance = new EventNameController(xmlRoot);
    }

    return instance;
}