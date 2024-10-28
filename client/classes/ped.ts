import {
    type PedHeadBlendData,
    FaceFeature,
    PedComponent,
    PlayerGender,
    PedHeadOverlay,
    PedHeadOverlayData,
    PedProps
} from "../shared/types";
import { HEAD_BLEND_TEXTURE_AMOUNT, OVERLAY_TEXTURE_AMOUNT } from "../shared/consts";

export class Ped {
    private source: number;

    constructor(source: number) {
        this.source = source;
    }

    public getSource = () => this.source;
    public setSource = (source: number) => (this.source = source);
    public getPed = () => GetPlayerPed(this.source);
    public getPedModel = () => GetEntityModel(this.getPed());
    public setPedModel = (model: string | number) => {
        const modelHash = typeof model === "string" ? GetHashKey(model) : model;
        RequestModel(modelHash);
        while (!HasModelLoaded(modelHash)) Wait(1);
        SetPlayerModel(this.source, modelHash);
        SetPedComponentVariation(this.getPed(), 0, 0, 0, 2);
        SetModelAsNoLongerNeeded(modelHash);
    };

    public getPedGender = (): PlayerGender => {
        const maleHash = GetHashKey("mp_m_freemode_01");
        const femaleHash = GetHashKey("mp_f_freemode_01");
        const model = this.getPedModel();

        // mayority of players are males, sounds sexist
        // but it's true
        if (model === maleHash) return PlayerGender.MALE;
        if (model === femaleHash) return PlayerGender.FEMALE;
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
    public getPedHeadBlendsHeadsByGender = (isMan: boolean): Array<number> => {
        const values = [];
        let nonDlcIndex = 0;
        let nonDlcAmount = 0;
        let dlcIndex = 0;
        let dlcAmount = 0;

        if (isMan) {
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
        male: this.getPedHeadBlendsHeadsByGender(true),
        female: this.getPedHeadBlendsHeadsByGender(false)
    });

    public getMaxComponentVariations = (component: PedComponent) =>
        GetNumberOfPedDrawableVariations(this.getPed(), component);
    public getMaxComponentTextureVariations = (component: PedComponent, drawable: number) =>
        GetNumberOfPedTextureVariations(this.getPed(), component, drawable);
    public getCurrentDrawableVariation = (component: PedComponent) => GetPedDrawableVariation(this.getPed(), component);
    public getCurrentTextureVariation = (component: PedComponent) => GetPedTextureVariation(this.getPed(), component);
    public setCurrentDrawableVariation = (component: PedComponent, drawable: number, texture: number) =>
        SetPedComponentVariation(this.getPed(), component, drawable, texture, 2);
    public setHairColor = (color: number, highlight: number) => SetPedHairColor(this.getPed(), color, highlight);
    public getPedComponents = (): Record<string, { drawable: number; texture: number }> => {
        const components: Record<string, { drawable: number; texture: number }> = {};

        for (const name of Object.values(PedComponent)) {
            if (typeof name === "number") continue;
            const index = PedComponent[name as keyof typeof PedComponent];
            components[index.toString()] = {
                drawable: this.getCurrentDrawableVariation(index),
                texture: this.getCurrentTextureVariation(index)
            };
        }

        return components;
    };

    public getPedFaceFeature = (feature: FaceFeature) => GetPedFaceFeature(this.getPed(), feature);
    public setPedFaceFeature = (feature: FaceFeature, value: number) => {
        this.refreshPedHeadBlendData();
        SetPedFaceFeature(this.getPed(), feature, value);
    };
    public getPedFaceFeatures = (): Record<string, number> => {
        const values: Record<string, number> = {};
        const ped = this.getPed();

        for (const name of Object.values(FaceFeature)) {
            if (typeof name === "number") continue;
            const index = FaceFeature[name as keyof typeof FaceFeature];
            values[index.toString()] = GetPedFaceFeature(ped, index);
        }

        return values;
    };

    public getMaxPropVariations = (component: PedProps) =>
        GetNumberOfPedPropDrawableVariations(this.getPed(), component);
    public getMaxPropTextureVariations = (component: PedProps, drawable: number) =>
        GetNumberOfPedPropTextureVariations(this.getPed(), component, drawable);
    public getCurrentPropDrawableVariation = (component: PedProps) => GetPedPropIndex(this.getPed(), component);
    public getCurrentPropTextureVariation = (component: PedProps) => GetPedPropTextureIndex(this.getPed(), component);
    public setPropDrawableVariation = (component: PedProps, drawable: number, texture: number) =>
        SetPedPropIndex(this.getPed(), component, drawable, texture, true);
    public getPedProps = (): Record<string, { drawable: number; texture: number }> => {
        const props: Record<string, { drawable: number; texture: number }> = {};

        for (const name of Object.values(PedProps)) {
            if (typeof name === "number") continue;
            const index = PedProps[name as keyof typeof PedProps];
            props[index.toString()] = {
                drawable: this.getCurrentPropDrawableVariation(index),
                texture: this.getCurrentPropTextureVariation(index)
            };
        }

        return props;
    };

    public getPedHeadOverlay = (overlay: PedHeadOverlay): PedHeadOverlayData => {
        const [_success, overlayValue, colourType, firstColour, secondColour, overlayOpacity] = GetPedHeadOverlayData(
            this.getPed(),
            overlay
        );

        return {
            overlayValue,
            colourType,
            firstColour,
            secondColour,
            overlayOpacity
        };
    };

    public getPedHeadOverlayIndexRange = (overlay: PedHeadOverlay): { min: number; max: number } => {
        const ranges = {
            [PedHeadOverlay.BLEMISHES]: [0, 23],
            [PedHeadOverlay.FACIAL_HAIR]: [0, 28],
            [PedHeadOverlay.EYEBROWS]: [0, 33],
            [PedHeadOverlay.AGEING]: [0, 14],
            [PedHeadOverlay.MAKEUP]: [0, 74],
            [PedHeadOverlay.BLUSH]: [0, 6],
            [PedHeadOverlay.COMPLEXION]: [0, 11],
            [PedHeadOverlay.SUN_DAMAGE]: [0, 10],
            [PedHeadOverlay.LIPSTICK]: [0, 9],
            [PedHeadOverlay.MOLES]: [0, 17],
            [PedHeadOverlay.CHEST_HAIR]: [0, 16],
            [PedHeadOverlay.BODY_BLEMISHES]: [0, 11],
            [PedHeadOverlay.ADD_BODY_BLEMISHES]: [0, 1]
        };

        return {
            min: ranges[overlay][0],
            max: ranges[overlay][1]
        };
    };

    public getPedHeadOverlayColorType = (overlay: number) => {
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

    public getPedHeadOverlays = (): Record<keyof typeof PedHeadOverlay, PedHeadOverlayData> => {
        // @ts-ignore
        const overlays: Record<keyof typeof PedHeadOverlay, PedHeadOverlayData> = {};

        for (const name of Object.values(PedHeadOverlay)) {
            if (typeof name === "number") continue;
            const index = PedHeadOverlay[name as keyof typeof PedHeadOverlay];
            overlays[name as keyof typeof PedHeadOverlay] = this.getPedHeadOverlay(index);
        }

        return overlays;
    };

    // public getMaxValues = () => {
    //     // @ts-ignore
    //     const maxComponents: Record<keyof typeof PedComponent, Record<string, number>> = {};
    //     for (const name of Object.values(PedComponent)) {
    //         if (typeof name === "number") continue;
    //         const index = PedComponent[name as keyof typeof PedComponent];
    //         maxComponents[name as keyof typeof PedComponent] = {};
    //         for (let i = 0; i < this.getMaxComponentVariations(index); i++) {
    //             maxComponents[name as keyof typeof PedComponent][i.toString()] = this.getMaxComponentTextureVariations(
    //                 index,
    //                 i
    //             );
    //         }
    //     }

    //     const maxProps: Record<keyof typeof PedProps, Record<string, number>> = {};
    //     for (const name of Object.values(PedProps)) {
    //         if (typeof name === "number") continue;
    //         const index = PedProps[name as keyof typeof PedProps];
    //         maxProps[name as keyof typeof PedProps] = {};
    //         for (let i = 0; i < this.getMaxPropVariations(index); i++) {
    //             maxProps[name as keyof typeof PedProps][i.toString()] = this.getMaxComponentTextureVariations(
    //                 index,
    //                 i
    //             );
    //         }
    //     }

    //     return maxComponents;
    // };
}

// the tstl compiler fucks up big numbers, what a faggot
const functionHash = parseInt("2746BD9D88C5C5D0", 16);

const getPedHeadBlendData = (ped: number): PedHeadBlendData => {
    const result = Citizen.InvokeNative(
        functionHash,
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
