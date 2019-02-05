const bcrypt = require("bcrypt");

//Function to validate user email and pw   
function validUser(user) {
    const validEmail = typeof user.email === "string" && user.email.trim() !== "";
    const validPassword = typeof user.password === "string" && user.password.trim() !== "" &&
                          user.password.trim().length >= 6;
    return validEmail && validPassword;
}

module.exports = {

    register: (req, res, next) => {  
        const { name, email, password } = req.body;   
        if (validUser(req.body)) {
            const dbInstance = req.app.get("db");
            const saltRounds = 12;
            //Check if user exists in db
            dbInstance.find_user_by_email([ email ]).then(users => {
                if (!users[0]) {
                    //Email not stored in db -> hash pw, insert user into db and set to session.
                    bcrypt.hash(password, saltRounds).then(hash => {
                        dbInstance.create_user([ name, email, hash ]).then(newUsers => {
                            const newUser = newUsers[0];
                            req.session.user = {
                                id: newUser.id,
                                name: newUser.name,
                                email: newUser.email,
                                profile_image: newUser.profile_image,
                                bio: newUser.bio
                            };
                            res.json(req.session.user);
                        })
                    })
                } else {
                    next(new Error("An account already exists with this email."));
                }
            })
            .catch(error => {
                res.status(500).send({errorMessage: "Error in register method"});
                console.log(error);
            })
        } else {
            next(new Error("Invalid username or password"));
        }
    },

    login: (req, res, next) => {
        const { email, password } = req.body;
        if (validUser(req.body)) {
			const dbInstance = req.app.get("db");
			//Check for user in db, compare hashed pw, set user to session if match.
            dbInstance.find_user_by_email([ email ]).then(users => {
                if (users.length) {
                    bcrypt.compare(password, users[0].password).then(result => {
                        if (result) {
							const user = users[0]; 
							req.session.user = {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                profile_image: user.profile_image,
                                bio: user.bio
							};
							console.log("---SESSION", req.session);
                            res.json(result);
                        } else {
                            next(new Error("Invalid username or password"));
                        }      
                    })
                } else {
                    next(new Error("Invalid username or password"));
                }
            })
        } else { 
            next(new Error("Invalid username or password"));
        }
    }

}