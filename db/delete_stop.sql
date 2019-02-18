DELETE FROM line_item WHERE trip_id = $1 AND stop_id = $2;
UPDATE trips SET waypoint_order = $3 WHERE id = $1;