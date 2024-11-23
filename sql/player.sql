create table player
(
    uuid      varchar(50) not null,
    discord   varchar(50) not null,
    position  text        not null,
    inventory text        not null,
    constraint player_pk
        primary key (uuid, discord)
);