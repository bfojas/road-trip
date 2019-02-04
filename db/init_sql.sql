create table users (
    id serial primary key,
    name text,
    email text,
    profile_image text,
    bio text,
    username varchar,
    hash_pw varchar
)

create table trips (
    id serial primary key,
    user_id integer,
    foreign key(user_id) references users(id),
    name text,
    images text[]
)

create table stops (
    id serial primary key,
    name text,
    address text,
    long numeric(10,6),
    lat numeric(10,6)
)

create table line_item (
    trip_id integer,
    stop_id integer,
    foreign key (trip_id) references trips(id),
    foreign key (stop_id) references stops(id)
)