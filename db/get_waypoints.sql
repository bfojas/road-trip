select s.id, s.name, s.address, s.longitude, s.latitude, s.image from stops s
join line_item li on li.stop_id = s.id
join trips t on t.id = li.trip_id
where t.id = $1 and s.id <> $2 and s.id <> $3;