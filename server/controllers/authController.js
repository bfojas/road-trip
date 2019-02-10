const bcrypt = require("bcrypt");

//Function to validate user email and pw   
function validUser(user) {
    const validEmail = typeof user.email === "string" && user.email.trim() !== "";
    const validPassword = typeof user.password === "string" && user.password.trim() !== "";
    return validEmail && validPassword;
}

module.exports = {

    register: (req, res) => {  
		const { name, email, password } = req.body; 
		//Validate email and pw sent in request body.  
        if (validUser(req.body)) {
            const dbInstance = req.app.get("db");
            const saltRounds = 12;
            //Check if user exists in db
            dbInstance.find_user_by_email([ email ]).then(users => {
                if (!users[0]) {
                    //If users is empty array, email not stored in db -> hash pw, create new user and set to session.
                    bcrypt.hash(password, saltRounds).then(hash => {
                        dbInstance.create_user([ name, email, hash ]).then(newUsers => {
                            const newUser = newUsers[0];
                            req.session.user = {
                                id: newUser.id,
                                name: newUser.name,
                                email: newUser.email,
                                profile_image: newUser.profile_image,
                                cover_image: newUser.cover_image,
                                bio: newUser.bio
                            };
                            res.send(req.session.user);
                        })
                    })
				} else {
					//If user exists in db, send error.
					res.send({errorMessage: "An account already exists with this email"});
                }
            })
            .catch(error => {
                res.status(500).send({errorMessage: "Error in register method"});
                console.error(error);
            })
		} else {
			//If email or pw are invalid, send error.
			res.send({errorMessage: "Invalid username or password"});
        }
    },

    login: (req, res) => {
        const { email, password } = req.body;
		//Validate email and pw sent in request body.  
        if (validUser(req.body)) {
			const dbInstance = req.app.get("db");
			//Check for user in db, compare hashed pw, set user to session if match.
            dbInstance.find_user_by_email([ email ]).then(users => {
                if (users.length) {
					const user = users[0];
					//compare returns boolean. 
                    bcrypt.compare(password, user.password).then(result => {
                        if (result) {
							req.session.user = {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                profile_image: user.profile_image,
                                cover_image: user.cover_image,
                                bio: user.bio
                            };
                            dbInstance.get_recent_trip([user.id])
                            .then(async trip => {
                                if (trip.length){
                                    const {origin_id, destination_id, id: tripId, name: tripName, images} = trip[0];
                                    let tripOrigin = await dbInstance.get_stop([origin_id])
                                        .catch(error=> console.log('----trip origin error', error));
                                    let tripDestination = await dbInstance.get_stop([destination_id])
                                        .catch(error=> console.log('----trip dest error', error));
                                    let tripWaypoints = await dbInstance.get_waypoints([tripId, origin_id, destination_id])
                                        .catch(error=> console.log('----waypoint error', error));
                                    res.status(200).send({user: req.session.user,
                                        currentTrip: {
                                            tripOrigin: tripOrigin[0], 
                                            tripDestination: tripDestination[0],
                                            tripName, 
                                            tripWaypoints, 
                                            tripId}});}
                                else { res.status(200).send({user: req.session.user})}
                                
                            })

                            // res.send(req.session.user);
                        } else {
							//If bcrypt compare returns false, send error.
							res.send({errorMessage: "Invalid username or password"});
                        }      
                    })
				} else {
					//If no matching user in db, send error.
					res.send({errorMessage: "Invalid username or password"});
                }
			})
			.catch(error => {
                res.status(500).send({errorMessage: "Error in login method"});
                console.error(error);
            })
		} 
		//If email or password are invalid, send error.		
		else { 
			res.send({errorMessage: "Invalid username or password"});
        }
    },

    getUser: (req, res) => {
        res.send({ user: req.session.user });
    },

    logout: (req, res) => {
        req.session.destroy();
        res.send();
    }

}