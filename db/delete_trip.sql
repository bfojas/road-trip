DELETE FROM line_item WHERE trip_id = $1 AND user_id = $2;
DELETE FROM trips WHERE id = $1 AND user_id = $2;
SELECT * FROM trips WHERE user_id = $2 ORDER BY id DESC;