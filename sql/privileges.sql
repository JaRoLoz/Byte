create table privileges
(
    discord   varchar(50) not null,
    privilege varchar(50) not null,
    createdAt timestamp   not null default current_timestamp,
    constraint privileges_pk
        primary key (discord)
);