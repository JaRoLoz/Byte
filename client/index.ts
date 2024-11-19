import "./events/exports";
import { CModel } from "./classes/game/model";
import { ByteExport } from "./events/exports";
import { Logger } from "./utils/logger";
import { CPed, CVehicle } from "./classes";
import { Debugger } from "./shared/classes/debugger";

const logger = new Logger("main");
const dbg = new Debugger("main");

CreateThread(() => {
    const playerPed = CPed.playerPed();
    while (true) {
        dbg.breakpoint("main:13");
        const coords = playerPed.getPosition();
        const model = new CModel("t20");
        const [err1, cvehicle] = CVehicle.create(model, coords, 20, true, true);

        if (err1) {
            logger.error("Failed to create vehicle");
            continue;
        }

        cvehicle.setIsMissionEntity(true);
        cvehicle.setAlpha(101);
        cvehicle.setPrimaryColor([120, 255, 30]);

        const netVehicle = cvehicle.toNet();
        const [err2, vehicle] = netVehicle.getAs(CVehicle);

        if (err2) {
            logger.error("Failed to get vehicle from net");
            continue;
        }

        logger.info(vehicle.asString());
    }
});

export { ByteExport };
