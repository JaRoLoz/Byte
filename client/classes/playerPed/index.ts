import { Err, getTranslator, Ok, Optional, Result } from "../../shared/classes";
import { HEAD_BLEND_TEXTURE_AMOUNT, OVERLAY_TEXTURE_AMOUNT } from "../../shared/consts";
import { IObjectifiable } from "../../shared/interfaces";
import {
    type PedHeadBlendData,
    FaceFeature,
    PedComponent,
    PlayerGender,
    PedHeadOverlay,
    PedHeadOverlayData,
    PedProps,
    PedData,
    PedMaxValues
} from "../../shared/types";
import { Logger } from "../../utils/logger";
import { CModel } from "../game";
import { CPed } from "../game/ped";
import { TattooManager } from "./tattoos";

const logger = new Logger("PlayerPed");
const translator = getTranslator();
const malePedHash = GetHashKey("mp_m_freemode_01");
const femalePedHash = GetHashKey("mp_f_freemode_01");

export class PlayerPed extends CPed implements IObjectifiable<PedData> {
    private source: number;
    private maxValuesMemo?: PedMaxValues;

    constructor(source: number = PlayerId()) {
        super(GetPlayerPed(source));
        this.source = source;
        // force the manager to load the tattoos
        TattooManager.getInstance();
    }

    public getSource = () => this.source;
    public setSource = (source: number) => (this.source = source);
    public getPed = () => GetPlayerPed(this.source);
    public setPedModel = (model_: string | number) => {
        const model = new CModel(model_);
        model.load();
        SetPlayerModel(this.source, model.getHash());
        SetPedComponentVariation(this.getPed(), 0, 0, 0, 2);
        model.unload();
        this.setEntity(this.getPed());

        if (typeof model_ === "string") {
            this.modelName = Optional.Some(model_);
            this.modelHash = GetHashKey(model_);
        } else {
            this.modelName = Optional.None();
            this.modelHash = model_;
        }
    };

    public override resurrect() {
        this.setPedModel(this.modelHash);
        SetEntityHealth(this.getPed(), this.getMaxHealth());
        const coords = this.getPosition();
        NetworkResurrectLocalPlayer(coords.x, coords.y, coords.z, this.getHeading(), false, true);
    }

    public getPedGender = (): PlayerGender => {
        const model = this.getModel().getHash();

        // mayority of players are males, so we check that first to try and save some time
        // sounds sexist, but it's the reality
        if (model === malePedHash) return PlayerGender.MALE;
        if (model === femalePedHash) return PlayerGender.FEMALE;
        return PlayerGender.UNKNOWN;
    };

    public getPedHeadBlendData = () => getPedHeadBlendData(this.getPed());
    public setPedHeadBlendData = (
        shapeFirst: number,
        shapeSecond: number,
        shapeThird: number,
        skinFirst: number,
        skinSecond: number,
        skinThird: number,
        shapeMix: number,
        skinMix: number,
        thirdMix: number
    ) =>
        SetPedHeadBlendData(
            this.getPed(),
            shapeFirst,
            shapeSecond,
            shapeThird,
            skinFirst,
            skinSecond,
            skinThird,
            shapeMix,
            skinMix,
            thirdMix,
            false
        );
    public refreshPedHeadBlendData = () => {
        const { shapeFirst, shapeMix, shapeSecond, shapeThird, skinFirst, skinMix, skinSecond, skinThird, thirdMix } =
            this.getPedHeadBlendData();
        this.setPedHeadBlendData(
            shapeFirst,
            shapeSecond,
            shapeThird,
            skinFirst,
            skinSecond,
            skinThird,
            shapeMix,
            skinMix,
            thirdMix
        );
    };
    public getPedHeadBlendsHeadsByGender = (gender: PlayerGender): Array<number> => {
        if (gender === PlayerGender.UNKNOWN) return [];
        const values = [];
        let nonDlcIndex = 0;
        let nonDlcAmount = 0;
        let dlcIndex = 0;
        let dlcAmount = 0;

        if (gender === PlayerGender.MALE) {
            nonDlcIndex = GetPedHeadBlendFirstIndex(0);
            nonDlcAmount = GetPedHeadBlendNumHeads(0);
            dlcIndex = GetPedHeadBlendFirstIndex(2);
            dlcAmount = GetPedHeadBlendNumHeads(2);
        } else {
            nonDlcIndex = GetPedHeadBlendFirstIndex(1);
            nonDlcAmount = GetPedHeadBlendNumHeads(1);
            dlcIndex = GetPedHeadBlendFirstIndex(3);
            dlcAmount = GetPedHeadBlendNumHeads(3);
        }

        for (let i = nonDlcIndex; i < nonDlcIndex + nonDlcAmount; i++) {
            values.push(i);
        }

        for (let i = dlcIndex; i < dlcIndex + dlcAmount; i++) {
            values.push(i);
        }

        return values;
    };

    public getPedHeadBlendHeads = (): { male: Array<number>; female: Array<number> } => ({
        male: this.getPedHeadBlendsHeadsByGender(PlayerGender.MALE),
        female: this.getPedHeadBlendsHeadsByGender(PlayerGender.FEMALE)
    });

    public getPedComponents = (): Record<keyof typeof PedComponent, { drawable: number; texture: number }> => {
        const components: Record<keyof typeof PedComponent, { drawable: number; texture: number }> = {
            COMP_ACCS: { drawable: 0, texture: 0 },
            COMP_BERD: { drawable: 0, texture: 0 },
            COMP_DECL: { drawable: 0, texture: 0 },
            COMP_FEET: { drawable: 0, texture: 0 },
            COMP_HAIR: { drawable: 0, texture: 0 },
            COMP_HAND: { drawable: 0, texture: 0 },
            COMP_HEAD: { drawable: 0, texture: 0 },
            COMP_JBIB: { drawable: 0, texture: 0 },
            COMP_LOWR: { drawable: 0, texture: 0 },
            COMP_TASK: { drawable: 0, texture: 0 },
            COMP_TEEF: { drawable: 0, texture: 0 },
            COMP_UPPR: { drawable: 0, texture: 0 }
        };

        for (const key_ of Object.keys(components)) {
            const key = key_ as keyof typeof PedComponent;
            const index = PedComponent[key];
            components[key] = {
                drawable: this.getCurrentDrawableVariation(index),
                texture: this.getCurrentTextureVariation(index)
            };
        }

        return components;
    };

    public getPedFaceFeatures = (): Record<keyof typeof FaceFeature, number> => {
        const values: Record<keyof typeof FaceFeature, number> = {
            CHEEK_DEPTH: 0,
            CHEEK_HEIGHT: 0,
            CHEEK_WIDTH: 0,
            CHIN_HEIGHT: 0,
            CHIN_HOLE: 0,
            CHIN_LENGTH: 0,
            CHIN_ROUNDNESS: 0,
            EYE_OPENING: 0,
            EYEBROW_DEPTH: 0,
            EYEBROW_HEIGHT: 0,
            JAW_ROUNDNESS: 0,
            JAW_WIDTH: 0,
            LIP_THICKNESS: 0,
            NECK_THICKNESS: 0,
            NOSE_BONE_CURVE: 0,
            NOSE_BONE_TWIST: 0,
            NOSE_LENGTH: 0,
            NOSE_PEAK: 0,
            NOSE_TIP: 0,
            NOSE_WIDTH: 0
        };

        const ped = this.getPed();
        for (const key_ of Object.keys(values)) {
            const key = key_ as keyof typeof FaceFeature;
            const index = FaceFeature[key];
            values[key] = GetPedFaceFeature(ped, index);
        }

        return values;
    };

    public getPedProps = (): Record<keyof typeof PedProps, { drawable: number; texture: number }> => {
        const props: Record<keyof typeof PedProps, { drawable: number; texture: number }> = {
            ANCHOR_EARS: { drawable: 0, texture: 0 },
            ANCHOR_EYES: { drawable: 0, texture: 0 },
            ANCHOR_HEAD: { drawable: 0, texture: 0 },
            ANCHOR_HIP: { drawable: 0, texture: 0 },
            ANCHOR_LEFT_FOOT: { drawable: 0, texture: 0 },
            ANCHOR_LEFT_HAND: { drawable: 0, texture: 0 },
            ANCHOR_LEFT_WRIST: { drawable: 0, texture: 0 },
            ANCHOR_MOUTH: { drawable: 0, texture: 0 },
            ANCHOR_PH_L_HAND: { drawable: 0, texture: 0 },
            ANCHOR_PH_R_HAND: { drawable: 0, texture: 0 },
            ANCHOR_RIGHT_FOOT: { drawable: 0, texture: 0 },
            ANCHOR_RIGHT_HAND: { drawable: 0, texture: 0 },
            ANCHOR_RIGHT_WRIST: { drawable: 0, texture: 0 }
        };

        for (const key_ of Object.keys(props)) {
            const key = key_ as keyof typeof PedProps;
            const index = PedProps[key];
            props[key] = {
                drawable: this.getCurrentPropDrawableVariation(index),
                texture: this.getCurrentPropTextureVariation(index)
            };
        }

        return props;
    };

    public getPedHeadOverlays = (): Record<keyof typeof PedHeadOverlay, PedHeadOverlayData> => {
        const overlays: Record<keyof typeof PedHeadOverlay, any> = {
            AGEING: {},
            BLEMISHES: {},
            ADD_BODY_BLEMISHES: {},
            BLUSH: {},
            BODY_BLEMISHES: {},
            CHEST_HAIR: {},
            COMPLEXION: {},
            EYEBROWS: {},
            FACIAL_HAIR: {},
            LIPSTICK: {},
            MAKEUP: {},
            MOLES: {},
            SUN_DAMAGE: {}
        };

        for (const overlay of Object.keys(overlays)) {
            const key = overlay as keyof typeof PedHeadOverlay;
            overlays[key] = this.getPedHeadOverlay(PedHeadOverlay[key]);
        }

        return overlays;
    };

    public getCurrentDrawableVariation = (component: PedComponent) => GetPedDrawableVariation(this.getPed(), component);
    public getCurrentTextureVariation = (component: PedComponent) => GetPedTextureVariation(this.getPed(), component);
    public setCurrentDrawableVariation = (component: PedComponent, drawable: number, texture: number) =>
        SetPedComponentVariation(this.getPed(), component, drawable, texture, 2);

    public getHairColor = (): Result<number> => {
        const color = GetPedHairColor(this.getPed());
        if (color === -1) return Err();
        return Ok(color);
    };
    public getHairHightlightColor = (): Result<number> => {
        const color = GetPedHairHighlightColor(this.getPed());
        if (color === -1) return Err();
        return Ok(color);
    };
    public setHairColor = (color: number, highlight: number) => SetPedHairColor(this.getPed(), color, highlight);
    public getPedFaceFeature = (feature: FaceFeature) => GetPedFaceFeature(this.getPed(), feature);
    public setPedFaceFeature = (feature: FaceFeature, value: number) => {
        this.refreshPedHeadBlendData();
        SetPedFaceFeature(this.getPed(), feature, value);
    };
    public getPedHeadOverlay = (overlay: PedHeadOverlay): PedHeadOverlayData => {
        const [_success, overlayValue, _colourType, firstColour, secondColour, overlayOpacity] = GetPedHeadOverlayData(
            this.getPed(),
            overlay
        );

        return {
            overlayValue,
            firstColour,
            secondColour,
            overlayOpacity
        };
    };

    public getCurrentPropDrawableVariation = (component: PedProps) => GetPedPropIndex(this.getPed(), component);
    public getCurrentPropTextureVariation = (component: PedProps) => GetPedPropTextureIndex(this.getPed(), component);
    public setPropDrawableVariation = (component: PedProps, drawable: number, texture: number) =>
        SetPedPropIndex(this.getPed(), component, drawable, texture, true);

    public getPedHeadOverlayColorType = (overlay: number): 0 | 1 | 2 => {
        if (
            overlay === PedHeadOverlay.EYEBROWS ||
            overlay === PedHeadOverlay.FACIAL_HAIR ||
            overlay === PedHeadOverlay.CHEST_HAIR
        )
            return 1;
        if (overlay === PedHeadOverlay.BLUSH || overlay === PedHeadOverlay.LIPSTICK) return 2;
        return 0;
    };

    public setPedHeadOverlay = (overlay: PedHeadOverlay, index: number, opacity: number) =>
        SetPedHeadOverlay(this.getPed(), overlay, index, opacity);
    public setPedHeadOverlayColor = (overlay: PedHeadOverlay, firstColor: number, secondColor: number) =>
        SetPedHeadOverlayColor(
            this.getPed(),
            overlay,
            this.getPedHeadOverlayColorType(overlay),
            firstColor,
            secondColor
        );

    public getMaxComponents = (): Record<keyof typeof PedComponent, Record<number, number>> => {
        const components: Record<keyof typeof PedComponent, Record<number, number>> = {
            COMP_ACCS: {},
            COMP_BERD: {},
            COMP_DECL: {},
            COMP_FEET: {},
            COMP_HAIR: {},
            COMP_HAND: {},
            COMP_HEAD: {},
            COMP_JBIB: {},
            COMP_LOWR: {},
            COMP_TASK: {},
            COMP_TEEF: {},
            COMP_UPPR: {}
        };

        const ped = this.getPed();

        for (const key_ of Object.keys(components)) {
            const key = key_ as keyof typeof PedComponent;
            const index = PedComponent[key];

            for (let i = 0; i < GetNumberOfPedDrawableVariations(ped, index); i++) {
                components[key][i] = GetNumberOfPedTextureVariations(ped, index, i);
            }
        }

        return components;
    };

    public getMaxProps = (): Record<keyof typeof PedProps, Record<number, number>> => {
        const props: Record<keyof typeof PedProps, Record<number, number>> = {
            ANCHOR_EARS: {},
            ANCHOR_EYES: {},
            ANCHOR_HEAD: {},
            ANCHOR_HIP: {},
            ANCHOR_LEFT_FOOT: {},
            ANCHOR_LEFT_HAND: {},
            ANCHOR_LEFT_WRIST: {},
            ANCHOR_MOUTH: {},
            ANCHOR_PH_L_HAND: {},
            ANCHOR_PH_R_HAND: {},
            ANCHOR_RIGHT_FOOT: {},
            ANCHOR_RIGHT_HAND: {},
            ANCHOR_RIGHT_WRIST: {}
        };

        const ped = this.getPed();

        for (const key_ of Object.keys(props)) {
            const key = key_ as keyof typeof PedProps;
            const index = PedProps[key];

            for (let i = 0; i < GetNumberOfPedPropDrawableVariations(ped, index); i++) {
                props[key][i] = GetNumberOfPedPropTextureVariations(ped, index, i);
            }
        }

        return props;
    };

    public getMaxOverlays = (): Record<keyof typeof PedHeadOverlay, number> => {
        const overlays: Record<keyof typeof PedHeadOverlay, number> = {
            AGEING: 0,
            BLEMISHES: 0,
            ADD_BODY_BLEMISHES: 0,
            BLUSH: 0,
            BODY_BLEMISHES: 0,
            CHEST_HAIR: 0,
            COMPLEXION: 0,
            EYEBROWS: 0,
            FACIAL_HAIR: 0,
            LIPSTICK: 0,
            MAKEUP: 0,
            MOLES: 0,
            SUN_DAMAGE: 0
        };

        for (const key_ of Object.keys(overlays)) {
            const key = key_ as keyof typeof PedHeadOverlay;
            const index = PedHeadOverlay[key];
            overlays[key] = GetNumHeadOverlayValues(index) - 1;
        }

        return overlays;
    };

    public getMaxFaceFeatures = (): Record<keyof typeof FaceFeature, { min: number; max: number }> => ({
        CHEEK_DEPTH: { min: float(-1.0), max: float(1.0) },
        CHEEK_HEIGHT: { min: float(-1.0), max: float(1.0) },
        CHEEK_WIDTH: { min: float(-1.0), max: float(1.0) },
        CHIN_HEIGHT: { min: float(-1.0), max: float(1.0) },
        CHIN_HOLE: { min: float(-1.0), max: float(1.0) },
        CHIN_LENGTH: { min: float(-1.0), max: float(1.0) },
        CHIN_ROUNDNESS: { min: float(-1.0), max: float(1.0) },
        EYE_OPENING: { min: float(-1.0), max: float(1.0) },
        EYEBROW_DEPTH: { min: float(-1.0), max: float(1.0) },
        EYEBROW_HEIGHT: { min: float(-1.0), max: float(1.0) },
        JAW_ROUNDNESS: { min: float(-1.0), max: float(1.0) },
        JAW_WIDTH: { min: float(-1.0), max: float(1.0) },
        LIP_THICKNESS: { min: float(-1.0), max: float(1.0) },
        NECK_THICKNESS: { min: float(-1.0), max: float(1.0) },
        NOSE_BONE_CURVE: { min: float(-1.0), max: float(1.0) },
        NOSE_BONE_TWIST: { min: float(-1.0), max: float(1.0) },
        NOSE_LENGTH: { min: float(-1.0), max: float(1.0) },
        NOSE_PEAK: { min: float(-1.0), max: float(1.0) },
        NOSE_TIP: { min: float(-1.0), max: float(1.0) },
        NOSE_WIDTH: { min: float(-1.0), max: float(1.0) }
    });

    public getMaxValues = (): PedMaxValues => {
        // computing all max values is a bit slow so memoization is a good idea here
        if (this.maxValuesMemo) return this.maxValuesMemo;

        this.maxValuesMemo = {
            components: this.getMaxComponents(),
            props: this.getMaxProps(),
            headBlendHeads: this.getPedHeadBlendHeads(),
            headBlendHeadsTextures: HEAD_BLEND_TEXTURE_AMOUNT,
            overlays: this.getMaxOverlays(),
            overlaysTextures: OVERLAY_TEXTURE_AMOUNT,
            faceFeatures: this.getMaxFaceFeatures()
        };
        return this.maxValuesMemo;
    };

    public toObject = (): PedData => {
        const [hairError, hairColor_] = this.getHairColor();
        const [highlightError, highlightColor_] = this.getHairHightlightColor();

        let hairColor = 0;
        let highlightColor = 0;

        if (hairError) {
            logger.debug(translator.get("Client.PlayerPed.HairColorError"));
        } else {
            hairColor = hairColor_;
        }

        if (highlightError) {
            logger.debug(translator.get("Client.PlayerPed.HighlightColorError"));
        } else {
            highlightColor = highlightColor_;
        }

        return {
            components: this.getPedComponents(),
            faceFeatures: this.getPedFaceFeatures(),
            props: this.getPedProps(),
            headOverlays: this.getPedHeadOverlays(),
            headBlend: this.getPedHeadBlendData(),
            hairColor,
            highlightColor
        };
    };
}

// the tstl compiler fucks up big numbers, what a faggot
const GET_PED_HEAD_BLEND_DATA = parseInt("2746BD9D88C5C5D0", 16);
// https://forum.cfx.re/t/head-blend-data/212575/24
const getPedHeadBlendData = (ped: number): PedHeadBlendData => {
    const result = Citizen.InvokeNative(
        GET_PED_HEAD_BLEND_DATA,
        ped,
        Citizen.PointerValueIntInitialized(0),
        Citizen.PointerValueIntInitialized(0),
        Citizen.PointerValueIntInitialized(0),
        Citizen.PointerValueIntInitialized(0),
        Citizen.PointerValueIntInitialized(0),
        Citizen.PointerValueIntInitialized(0),
        Citizen.PointerValueFloatInitialized(0),
        Citizen.PointerValueFloatInitialized(0),
        Citizen.PointerValueFloatInitialized(0)
    ) as Array<number>;

    return {
        shapeFirst: result[0],
        shapeSecond: result[1],
        shapeThird: result[2],
        skinFirst: result[3],
        skinSecond: result[4],
        skinThird: result[5],
        shapeMix: result[6],
        skinMix: result[7],
        thirdMix: result[8]
    };
};

export * from "./tattoos";
