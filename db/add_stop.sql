insert into stops (name, address, long, lat, image)
values (${name}, ${address}, ${longitude}, ${latitude}, ${image})
returning id;