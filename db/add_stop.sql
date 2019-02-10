insert into stops (name, address, longitude, latitude, image)
values (${name}, ${address}, ${longitude}, ${latitude}, ${image})
returning id;