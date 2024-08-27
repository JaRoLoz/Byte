export enum PlayerGender {
    MALE,
    FEMALE,
    UNKNOWN
};

export type PlayerData = {
    firstname: string;
    lastname: string;
    birthdate: string;
    gender: PlayerGender;
    nationality: string;
};

export type PlayerJob = {
    name: string;
    grade: number;
};

export type PlayerGang = {
    name: string;
    grade: number;
};