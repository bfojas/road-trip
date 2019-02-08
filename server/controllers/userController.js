module.exports = {

    updateUserInfo: (req, res) => {
        const { id } = req.params;
        const { name, email, bio } = req.body;
        const dbInstance = req.app.get("db");
        dbInstance.update_user_info([ id, name, email, bio ]).then(users => {
            const { id, name, email, bio, profile_image, cover_image } = users[0];
            req.session.user = { id, name, email, bio, profile_image, cover_image };
            res.status(200).send(users);
        })
        .catch( error => {
            res.status(500).send({errorMessage: "Error in updateUser method"});
            console.log(error);
        })
    }

}