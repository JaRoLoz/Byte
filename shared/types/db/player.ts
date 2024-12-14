import { Coords4 } from "../../utils";
import { InventoryData } from "../inventory";
import { PedData } from "../ped";
import { PlayerGang, PlayerGender, PlayerJob } from "../player";

export type DBPlayerData = {
    firstname: string;
    lastname: string;
    /** Unix timestamp */
    birthdate: number;
    gender: PlayerGender;
    nationality: string;
};

export type DBPlayerInfo = {
    uuid: string;
    data: DBPlayerData;
    jobs: Array<PlayerJob>;
    gangs: Array<PlayerGang>;
    position: Coords4;
    inventory: InventoryData;
    pedData: PedData;
};
