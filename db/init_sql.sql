create table users (
    id serial primary key,
    name text,
    email text,
    profile_image text,
    cover_image text,
    bio text,
    password varchar
);

create table trips (
    id serial primary key,
    user_id integer,
    foreign key(user_id) references users(id),
    name text,
    images text[],
    active_time bigint,
    origin_id integer,
    destination_id integer,
    waypoint_order text[]
);

create table stops (
    id serial primary key,
    name text,
    address text,
    longitude numeric(10,6),
    latitude numeric(10,6),
    image text
);

create table line_item (
    user_id integer references users(id)
    trip_id integer,
    stop_id integer,
    foreign key (trip_id) references trips(id),
    foreign key (stop_id) references stops(id),
    start_distance numeric (15,12)
);