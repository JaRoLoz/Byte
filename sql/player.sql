create table player
(
    discord   varchar(50) not null,
    uuid      varchar(50) not null,
    position  text        not null,
    inventory text        not null,
    constraint player_pk primary key (discord, uuid)
);