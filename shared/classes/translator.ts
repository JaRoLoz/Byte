import { XMLNode } from "../native_defs";
import { ConfigController } from "./configController";
import { XMLSearchNode } from "./xml";

const configController = ConfigController.getInstance();

export class Translator {
    /** @noSelf **/
    public static construct = (lang: string, xml: XMLNode) => new Translator(lang, xml);

    private translations: Record<string, string> = {};
    private lang: string;

    constructor(lang: string, xml: XMLNode) {
        this.lang = lang;
        const xmlNode = XMLSearchNode.construct(xml);

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
export const getTranslator = () => {
    if (!instance) {
        const langXMLRoot = XML.decode(LoadResourceFile(GetCurrentResourceName(), "assets/locales.xml"));
        instance = Translator.construct(configController.getLocale(), langXMLRoot.children[0] as XMLNode);
    }

    return instance;
}