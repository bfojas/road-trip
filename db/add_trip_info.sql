update trips
set origin_id = $1, destination_id = $2, active_time = $4
where id = $3