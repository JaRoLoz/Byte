create table player_skin
(
    discord         varchar(50) not null,
    uuid            varchar(50) not null,
    ped_model       integer     not null,
    components      text        not null,
    props           text        not null,
    head_blend      text        not null,
    head_overlays   text        not null,
    face_features   text        not null,
    hair_color      integer     not null,
    highlight_color integer     not null,
    constraint player_skin_pk
        primary key (discord, uuid),
    constraint player_fk
        foreign key (discord, uuid) references player (discord, uuid)
);