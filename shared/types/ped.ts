import { HEAD_BLEND_TEXTURE_AMOUNT, OVERLAY_TEXTURE_AMOUNT } from "../consts";

export type PedHeadOverlayData = {
    overlayValue: number;
    firstColour: number;
    secondColour: number;
    overlayOpacity: number;
}

export type PedHeadBlendData = {
    shapeFirst: number;
    shapeSecond: number;
    shapeThird: number;
    skinFirst: number;
    skinSecond: number;
    skinThird: number;
    shapeMix: number;
    skinMix: number;
    thirdMix: number;
};

export enum PedComponent {
    /** HEAD */
    COMP_HEAD = 0,
    /** MASKS */
    COMP_BERD = 1,
    /** HAIR */
    COMP_HAIR = 2,
    /** GLOVES */
    COMP_UPPR = 3,
    /** PANTS */
    COMP_LOWR = 4,
    /** BAGS & PARACHUTES */
    COMP_HAND = 5,
    /** SHOES */
    COMP_FEET = 6,
    /** ACCESSORIES */
    COMP_TEEF = 7,
    /** T-SHIRTS */
    COMP_ACCS = 8,
    /** BODY ARMOR */
    COMP_TASK = 9,
    /** DECALS */
    COMP_DECL = 10,
    /** JACKETS */
    COMP_JBIB = 11
}

export enum PedProps {
    /**"p_head"*/
    ANCHOR_HEAD = 0,
    /**"p_eyes"*/
    ANCHOR_EYES = 1,
    /**"p_ears"*/
    ANCHOR_EARS = 2,
    /**"p_mouth"*/
    ANCHOR_MOUTH = 3,
    /**"p_lhand"*/
    ANCHOR_LEFT_HAND = 4,
    /**"p_rhand"*/
    ANCHOR_RIGHT_HAND = 5,
    /**"p_lwrist"*/
    ANCHOR_LEFT_WRIST = 6,
    /**"p_rwrist"*/
    ANCHOR_RIGHT_WRIST = 7,
    /**"p_lhip"*/
    ANCHOR_HIP = 8,
    /**"p_lfoot"*/
    ANCHOR_LEFT_FOOT = 9,
    /**"p_rfoot"*/
    ANCHOR_RIGHT_FOOT = 10,
    /**"ph_lhand"*/
    ANCHOR_PH_L_HAND = 11,
    /**"ph_rhand"*/
    ANCHOR_PH_R_HAND = 12
}

export enum PedHeadOverlay {
    BLEMISHES = 0,
    FACIAL_HAIR = 1,
    EYEBROWS = 2,
    AGEING = 3,
    MAKEUP = 4,
    BLUSH = 5,
    COMPLEXION = 6,
    SUN_DAMAGE = 7,
    LIPSTICK = 8,
    MOLES = 9,
    CHEST_HAIR = 10,
    BODY_BLEMISHES = 11,
    ADD_BODY_BLEMISHES = 12
}

export enum FaceFeature {
    NOSE_WIDTH = 0,
    NOSE_PEAK = 1,
    NOSE_LENGTH = 2,
    NOSE_BONE_CURVE = 3,
    NOSE_TIP = 4,
    NOSE_BONE_TWIST = 5,
    EYEBROW_HEIGHT = 6,
    EYEBROW_DEPTH = 7,
    CHEEK_HEIGHT = 8,
    CHEEK_DEPTH = 9,
    CHEEK_WIDTH = 10,
    EYE_OPENING = 11,
    LIP_THICKNESS = 12,
    JAW_WIDTH = 13,
    JAW_ROUNDNESS = 14,
    CHIN_HEIGHT = 15,
    CHIN_LENGTH = 16,
    CHIN_ROUNDNESS = 17,
    CHIN_HOLE = 18,
    NECK_THICKNESS = 19
}

export type PedData = {
    pedModel: number;
    components: Record<keyof typeof PedComponent, { drawable: number; texture: number }>
    faceFeatures: Record<keyof typeof FaceFeature, number>;
    props: Record<keyof typeof PedProps, { drawable: number; texture: number }>;
    headOverlays: Record<keyof typeof PedHeadOverlay, PedHeadOverlayData>;
    headBlend: PedHeadBlendData;
    hairColor: number;
    highlightColor: number;
};

export type PedMaxValues = {
    components: Record<keyof typeof PedComponent, Record<number, number>>;
    props: Record<keyof typeof PedProps, Record<number, number>>;
    headBlendHeads: { male: Array<number>; female: Array<number> };
    headBlendHeadsTextures: typeof HEAD_BLEND_TEXTURE_AMOUNT;
    overlays: Record<keyof typeof PedHeadOverlay, number>;
    overlaysTextures: typeof OVERLAY_TEXTURE_AMOUNT;
    faceFeatures: Record<keyof typeof FaceFeature, { min: number, max: number }>;
};
