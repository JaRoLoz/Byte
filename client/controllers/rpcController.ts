import { getEventNames } from "../shared/classes/eventNameController";
import { CfxPromise } from "../shared/native_defs";

const eventNames = getEventNames();

export class RPCController {
    /** @noSelf **/
    private static instance: RPCController;
    private promises: Record<string, CfxPromise<unknown[]>> = {};

    private constructor() {
        RegisterNetEvent(eventNames.get("Client.RPC.Callback"), (procuedure: string, args: any) => {
            if (!this.promises[procuedure]) return;

            const procedurePromise = this.promises[procuedure] as CfxPromise<any>;
            procedurePromise.resolve(procedurePromise, args);
        });
    }

    public call = <Args extends any[] = any>(procedure: string, args: any) => {
        const procedurePromise = promise.new();
        this.promises[procedure] = procedurePromise;

        TriggerServerEvent(eventNames.get("Server.RPC.Call"), procedure, ...args);

        return Citizen.Await<Args>(procedurePromise) as Args;
    };

    /** @noSelf **/
    public static getInstance = () => {
        if (!RPCController.instance) {
            RPCController.instance = new RPCController();
        }

        return RPCController.instance;
    };
}
