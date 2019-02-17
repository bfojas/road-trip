update users set liked_trips = $1 where id= $2
returning *;