insert into trips (user_Id, name, images, featured_image)
values ($1, $2, $3, $4)
returning *;