import { Timestamp } from "../classes";
import { DBPlayerData } from "./db";
import { ExcludeKey } from "./generic";

export enum PlayerGender {
    MALE,
    FEMALE,
    UNKNOWN
};

export type PlayerJob = {
    name: string;
    grade: number;
};

export type PlayerGang = {
    name: string;
    grade: number;
};

export type PlayerData = ExcludeKey<DBPlayerData, "birthdate"> & {
    birthdate: Timestamp;
};
