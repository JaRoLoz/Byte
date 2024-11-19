import { XMLNode } from "../native_defs";
import { ConfigController } from "./configController";
import { XMLSearchNode } from "./xml";

const configController = ConfigController.getInstance();

/**
 * Utility class to translate keys to values based on a XML file.
 */
export class Translator {
    private translations: Record<string, string> = {};
    private lang: string;

    /**
     * 
     * @param lang Language name to get the translations for
     * @param xml The root node of the XML file containing the translations
     * @returns A new `Translator` object
     */
    constructor(lang: string, xml: XMLNode) {
        this.lang = lang;
        const xmlNode = new XMLSearchNode(xml);

        const translations = xmlNode.search({ tag: "translation", attrs: { key: "lang", value: lang } })[0];
        if (!translations) {
            console.error(`No translations found for language ${lang}`);
            return;
        }

        translations.search({ tag: "entry" }).forEach(entry => {
            const key = entry.asNode().attrs["key"];
            const value = entry.asText();
            this.translations[key] = value;
        });
    }

    public get = (key: string) => this.translations[key] || `Key "${key}" does not exist for lang "${this.lang}"`;
}

let instance: Translator;
/**
 * @returns The singleton instance of the `Translator` class for the Framework translations.
 */
export const getTranslator = () => {
    if (!instance) {
        const langXMLRoot = XML.decode(LoadResourceFile(GetCurrentResourceName(), "assets/locales.xml"));
        instance = new Translator(configController.getLocale(), langXMLRoot.children[0] as XMLNode);
    }

    return instance;
}