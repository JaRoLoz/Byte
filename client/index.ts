import "./events/exports";
import { ByteExport } from "./events/exports";
import { Logger } from "./utils/logger";
import { PlayerPed } from "./classes";
import { Debugger } from "./shared/classes/debugger";
import { PedProps } from "./shared/types";

const logger = new Logger("main");
const dbg = new Debugger("main");

CreateThread(() => {
    const playerPed = new PlayerPed();
    while (true) {
        dbg.breakpoint("main:14");

        playerPed.setPedModel("mp_m_freemode_01");
        playerPed.resurrect();
        logger.info(playerPed.asString());

        SetPedRandomComponentVariation(playerPed.getPed(), 0);
        playerPed.setPropDrawableVariation(PedProps.ANCHOR_LEFT_WRIST, 10, 0);
        playerPed.setPedHeadBlendData(3, 4, 5, 4, 5, 6, 0.5, 0.5, 0.5);
        playerPed.setHairColor(44, 33);

        logger.info(json.encode(playerPed.toObject()));
        logger.info(json.encode(playerPed.getMaxValues()));
    }
});

export { ByteExport };
