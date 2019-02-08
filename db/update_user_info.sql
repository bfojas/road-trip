UPDATE users 
SET name = $2, email = $3, bio = $4, profile_image = $5, cover_image = $6
WHERE id = $1
RETURNING id, name, email, bio, profile_image, cover_image;