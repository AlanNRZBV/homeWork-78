create table categories
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description text         null
);

insert into office.categories (id, name, description)
values  (1, 'furniture', 'any furniture'),
        (2, 'PC''s', 'any PC''s'),
        (3, 'server', 'all stuff from server room'),
        (4, 'appliances', 'changeddddd'),
        (6, 'change', 'change');

create table places
(
    id          int auto_increment
        primary key,
    name        varchar(255) not null,
    description text         null
);

insert into office.places (id, name, description)
values  (1, 'open-space', 'main open-space'),
        (2, 'devs-space', 'secondary open-space'),
        (3, 'meeting room', 'main meeting room'),
        (4, 'HQ', null);


create table items
(
    id          int auto_increment
        primary key,
    category_id int          null,
    place_id    int          null,
    name        varchar(255) not null,
    description text         null,
    created_at  date         not null,
    image       varchar(255) null,
    constraint item_categories_id_fk
        foreign key (category_id) references categories (id),
    constraint item_place_id_fk
        foreign key (place_id) references places (id)
);

insert into office.items (id, category_id, place_id, name, description, created_at, image)
values  (1, 1, 2, 'dev''s chair', 'old dev''s chair', '2024-02-01', null),
        (2, 2, 3, 'PC#1337', 'Most powerfull PC John ever had', '2022-02-11', null),
        (3, 2, 1, 'PC#404', 'Unknown user PC', '2022-04-11', null),
        (4, 4, 2, 'Coffee Machine', 'Most valuable item', '2022-04-11', null),
        (5, 2, 2, 'test name', 'test description', '2024-02-01', '58b05648-35b6-4c13-84d2-dfd704c3eb52.jpg'),
        (6, 2, 2, 'name has been changed', 'test description', '2024-02-01', 'abd3c732-38e0-4688-a1c5-e7b13eea8d44.jpg');
