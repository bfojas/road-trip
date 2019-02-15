UPDATE trips
SET name = $1, featured_image = $2
WHERE id = $3 AND user_id = $4
RETURNING *;