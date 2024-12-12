import { EmptyOk, Err, Result, XMLSearchNode } from "../../shared/classes";
import {
    multiplayer_overlays_female,
    multiplayer_overlays_male,
    mpbiker_overlays_female,
    mpbiker_overlays_male,
    mpgunrunning_overlays_female,
    mpgunrunning_overlays_male,
    mpimportexport_overlays_female,
    mpimportexport_overlays_male,
    mplowrider_overlays_female,
    mplowrider_overlays_male,
    mpluxe_overlays_female,
    mpluxe_overlays_male,
    mpsmuggler_overlays_female,
    mpsmuggler_overlays_male,
    mpvinewood_overlays_female,
    mpvinewood_overlays_male
} from "./parsedTattoos";

export type TattooZone =
    | "ZONE_LEFT_ARM"
    | "ZONE_TORSO"
    | "ZONE_RIGHT_ARM"
    | "ZONE_LEFT_LEG"
    | "ZONE_RIGHT_LEG"
    | "ZONE_HEAD";

export type Tattoo = {
    nameHash: string;
    txdHash: string;
    txtHash: string;
    zone: TattooZone;
};

export class TattooManager {
    /** @noSelf **/
    private static instance: TattooManager;

    private loadedDecorations: Array<string> = [];
    public readonly maleTattoos: Record<TattooZone, Array<Tattoo>> = {
        ZONE_LEFT_ARM: [],
        ZONE_TORSO: [],
        ZONE_HEAD: [],
        ZONE_LEFT_LEG: [],
        ZONE_RIGHT_ARM: [],
        ZONE_RIGHT_LEG: []
    };
    public readonly femaleTattoos: Record<TattooZone, Array<Tattoo>> = {
        ZONE_LEFT_ARM: [],
        ZONE_TORSO: [],
        ZONE_HEAD: [],
        ZONE_LEFT_LEG: [],
        ZONE_RIGHT_ARM: [],
        ZONE_RIGHT_LEG: []
    };

    private constructor() {
        this.loadDecorationInternal("multiplayer_overlays.xml", multiplayer_overlays_male, multiplayer_overlays_female);
        this.loadDecorationInternal("mpvinewood_overlays.xml", mpvinewood_overlays_male, mpvinewood_overlays_female);
        this.loadDecorationInternal("mpsmuggler_overlays.xml", mpsmuggler_overlays_male, mpsmuggler_overlays_female);
        this.loadDecorationInternal("mpluxe_overlays.xml", mpluxe_overlays_male, mpluxe_overlays_female);
        this.loadDecorationInternal("mplowrider_overlays.xml", mplowrider_overlays_male, mplowrider_overlays_female);
        this.loadDecorationInternal(
            "mpimportexport_overlays.xml",
            mpimportexport_overlays_male,
            mpimportexport_overlays_female
        );
        this.loadDecorationInternal(
            "mpgunrunning_overlays.xml",
            mpgunrunning_overlays_male,
            mpgunrunning_overlays_female
        );
        this.loadDecorationInternal("mpbiker_overlays.xml", mpbiker_overlays_male, mpbiker_overlays_female);
    }

    private loadDecorationInternal = (
        decorationFileName: string,
        maleDecorations: Record<TattooZone, Array<Tattoo>>,
        femaleDecorations: Record<TattooZone, Array<Tattoo>>
    ) => {
        const zones: Array<TattooZone> = [
            "ZONE_LEFT_ARM",
            "ZONE_TORSO",
            "ZONE_HEAD",
            "ZONE_LEFT_LEG",
            "ZONE_RIGHT_ARM",
            "ZONE_RIGHT_LEG"
        ];
        for (const zone of zones) {
            this.maleTattoos[zone] = { ...this.maleTattoos[zone], ...maleDecorations[zone] };
            this.femaleTattoos[zone] = { ...this.femaleTattoos[zone], ...femaleDecorations[zone] };
        }
        this.loadedDecorations.push(decorationFileName);
    };

    /**
     * Loads and parses a decorations file containing ped tattoos.
     * @param decorationFilePath The path to the decorations file, without the file name (e.g. `assets/ped_overlays`)
     * @param decorationFileName The name of the decorations file (e.g. `multiplayer_overlays.xml`)
     * @param resource The resource name where the decorations file is located. This is useful when loading decorations from another resource.
     * @returns Result
     */
    public loadDecoration = (
        decorationFilePath: string,
        decorationFileName: string,
        resource: string = GetCurrentResourceName()
    ): Result => {
        // loading a decorations file is resource intensive, so we make sure to memoize the loaded files
        if (this.isDecorationLoaded(decorationFileName)) return EmptyOk();

        const path = `${decorationFilePath}/${decorationFileName}`;
        const xmlString = LoadResourceFile(resource, path);
        if (!xmlString || xmlString.length === 0) return Err();

        const xmlRoot = XML.decode(xmlString);
        const xml = new XMLSearchNode(xmlRoot.children[0]).search({ tag: "presets" })[0].search({ tag: "Item" });
        for (const node of xml) {
            const nameHash = node.search({ tag: "nameHash" });
            const txdHash = node.search({ tag: "txdHash" });
            const txtHash = node.search({ tag: "txtHash" });
            const zone = node.search({ tag: "zone" });
            const gender = node.search({ tag: "gender" });
            const type = node.search({ tag: "type" });
            if (
                type[0].asNode().children.length === 0 ||
                type[0].asText() !== "TYPE_TATTOO" ||
                nameHash[0].asNode().children.length === 0 ||
                txdHash[0].asNode().children.length === 0 ||
                txtHash[0].asNode().children.length === 0 ||
                zone[0].asNode().children.length === 0
            )
                continue;

            const nameHashStr = nameHash[0].asText();
            const txdHashStr = txdHash[0].asText();
            const txtHashStr = txtHash[0].asText();
            const zoneStr = zone[0].asText() as TattooZone;

            const collection = gender[0].asText() === "GENDER_MALE" ? this.maleTattoos : this.femaleTattoos;
            collection[zoneStr].push({
                nameHash: nameHashStr,
                txdHash: txdHashStr,
                txtHash: txtHashStr,
                zone: zoneStr
            });
        }

        this.loadedDecorations.push(decorationFileName);
        return EmptyOk();
    };

    public isDecorationLoaded = (decorationFileName: string): boolean =>
        this.loadedDecorations.includes(decorationFileName);

    /** @noSelf **/
    public static getInstance = (): TattooManager => {
        if (!TattooManager.instance) {
            TattooManager.instance = new TattooManager();
        }
        return TattooManager.instance;
    };
}
