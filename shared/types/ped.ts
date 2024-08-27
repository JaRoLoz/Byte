export type PedMaxValues = {
};

export type PedHeadOverlayData = {
    overlayValue: number;
    colourType: number;
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
    COMP_HEAD = 0, // HEAD
    COMP_BERD = 1, // MASKS
    COMP_HAIR = 2, // HAIR
    COMP_UPPR = 3, // GLOVES
    COMP_LOWR = 4, // PANTS
    COMP_HAND = 5, // BAGS & PARACHUTES
    COMP_FEET = 6, // SHOES
    COMP_TEEF = 7, // ACCESSORIES
    COMP_ACCS = 8, // T-SHIRTS
    COMP_TASK = 9, // BODY ARMOR
    COMP_DECL = 10,// DECALS
    COMP_JBIB = 11 // JACKETS
}

export enum PedProps {
    ANCHOR_HEAD = 0,        /* "p_head"   */
    ANCHOR_EYES = 1,        /* "p_eyes"   */
    ANCHOR_EARS = 2,        /* "p_ears"   */
    ANCHOR_MOUTH = 3,       /* "p_mouth"  */
    ANCHOR_LEFT_HAND = 4,   /* "p_lhand"  */
    ANCHOR_RIGHT_HAND = 5,  /* "p_rhand"  */
    ANCHOR_LEFT_WRIST = 6,  /* "p_lwrist" */
    ANCHOR_RIGHT_WRIST = 7, /* "p_rwrist" */
    ANCHOR_HIP = 8,         /* "p_lhip"   */
    ANCHOR_LEFT_FOOT = 9,   /* "p_lfoot"  */
    ANCHOR_RIGHT_FOOT = 10, /* "p_rfoot"  */
    ANCHOR_PH_L_HAND = 11,  /* "ph_lhand" */
    ANCHOR_PH_R_HAND = 12   /* "ph_rhand" */
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