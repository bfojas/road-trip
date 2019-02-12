insert into trips (user_Id, name, images)
values ($1, $2, $3)
returning *;