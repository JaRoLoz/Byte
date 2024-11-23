create table player_gang
(
    uuid  varchar(50) not null,
    discord varchar(50) not null,
    name  text        not null,
    grade integer     not null,
    constraint player_gang_pk
        primary key (uuid, name),
    constraint player_gang_fk
        foreign key (uuid, discord) references player (uuid, discord)
);