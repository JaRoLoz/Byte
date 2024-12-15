import { Optional } from "../../shared/classes";
import { CModel } from "../game";
import { ClothedPed } from "./clothedPed";

export class PlayerPed extends ClothedPed {
    private source: number;

    constructor(source: number | undefined = PlayerId()) {
        super(GetPlayerPed(source));
        this.source = source;
    }

    public override getPed() {
        return GetPlayerPed(this.source);
    }

    public getSource = () => this.source;
    public setSource = (source: number) => (this.source = source);

    public setPlayerModel = (model_: string | number) => {
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
        this.setPlayerModel(this.modelHash);
        SetEntityHealth(this.getPed(), this.getMaxHealth());
        const coords = this.getPosition();
        NetworkResurrectLocalPlayer(coords.x, coords.y, coords.z, this.getHeading(), false, true);
    }
};