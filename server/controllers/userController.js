module.exports = {

    updateUserInfo: (req, res) => {
        const { id } = req.params;
        const { name, email, bio, profile_image, cover_image } = req.body;
        const dbInstance = req.app.get("db");
        dbInstance.update_user_info([ id, name, email, bio, profile_image, cover_image ])
            .then(users => {               
                const { id, name, email, bio, profile_image, cover_image } = users[0];
                req.session.user = { id, name, email, bio, profile_image, cover_image };
                res.status(200).send({users});
            })
            .catch(error => {
                res.status(500).send({errorMessage: "Error in updateUser method"});
                console.log(error);
            })
    },

    getUserTrips: (req, res) => {
        const { id } = req.session.user;
        const dbInstance = req.app.get("db");
        dbInstance.get_user_trips([ id ]).then(trips => {
            res.status(200).send(trips);
        })
        .catch(error => {
            res.status(500).send({errorMessage: "Error in getUserTrips method"});
            console.log(error);
        })
    }

}