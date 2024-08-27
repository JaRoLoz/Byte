import { Ped } from "./classes/ped";
import "./events/exports";
import { ByteExport } from "./events/exports";
import { HEAD_BLEND_TEXTURE_AMOUNT } from "./shared/consts";
import { PedComponent, PedProps } from "./shared/types";
import { Logger } from "./utils/logger";

const logger = new Logger("main");

CreateThread(() => {
    while (true) {
        Wait(0);
        if (IsControlJustReleased(0, 38)) break;
    }

    const models = ["mp_m_freemode_01", "mp_f_freemode_01"];
    const model = models[random(0, models.length - 1)];
    const hash = GetHashKey(model);

    const ped = new Ped(PlayerId());
    ped.setPedModel(hash);

    const { male: maleHeads, female: femaleHeads } = ped.getPedHeadBlendHeads();
    const dadHead = maleHeads[random(0, maleHeads.length - 1)];
    const momHead = femaleHeads[random(0, femaleHeads.length - 1)];

    const dadSkin = random(0, HEAD_BLEND_TEXTURE_AMOUNT - 1);
    const momSkin = random(0, HEAD_BLEND_TEXTURE_AMOUNT - 1);

    logger.debug(`
        HEAD_BLEND_TEXTURE_AMOUNT: ${HEAD_BLEND_TEXTURE_AMOUNT}
        dadHead: ${dadHead}
        momHead: ${momHead}
        dadSkin: ${dadSkin}
        momSkin: ${momSkin}
    `);
    ped.setPedHeadBlendData(dadHead, momHead, 0, dadSkin, momSkin, 0, 0.7, 0.5, 0.1);
    // logger.debug(json.encode(ped.getPedHeadBlendData()));
    // logger.debug(json.encode(ped.getMaxValues()));
    // logger.debug(json.encode(PedComponent));

    // @ts-ignore
    const maxProps: Record<string, Record<string, number>> = {};
    for (const name of Object.values(PedComponent)) {
        if (typeof name === "number") continue;
        const index = PedProps[name as keyof typeof PedProps];
        maxProps[name] = {};
        for (const name2 of Object.values(PedProps)) {
            const number = GetNumberOfPedPropDrawableVariations(PlayerPedId(), index);
        }
    }
});

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export { ByteExport };
