UPDATE users 
SET name = $2, email = $3, bio = $4 
WHERE id = $1
RETURNING id, name, email, bio, profile_image, cover_image;