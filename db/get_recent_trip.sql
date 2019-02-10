select * from trips
where user_id = $1
order by active_time desc limit 1;