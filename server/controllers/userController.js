module.exports = {

    updateUserInfo: (req, res) => {
        const { id } = req.params;
        const { name, email, bio, profile_image, cover_image } = req.body;
        const dbInstance = req.app.get("db");
        dbInstance.update_user_info([ id, name, email, bio, profile_image, cover_image ])
        .then(users => {
            
            const { id, name, email, bio, profile_image, cover_image } = users[0];
            req.session.user = { id, name, email, bio, profile_image, cover_image };
            
            // dbInstance.get_recent_trip([id])
            // .then(async trip => {
            //     const {origin_id, destination_id, id: tripId, name: tripName, images} = trip[0];
            //     let tripOrigin = await dbInstance.get_stop([origin_id]);
            //     let tripDestination = await dbInstance.get_stop([destination_id])
            //     let tripWaypoints = await dbInstance.get_waypoints([tripId, origin_id, destination_id])
            //     res.status(200).send({user: users,
            //         currentTrip: {tripOrigin, tripDestination,tripName, tripWaypoints, tripId}});
            // })

            res.status(200).send({users});
        })
        
        .catch( error => {
            res.status(500).send({errorMessage: "Error in updateUser method"});
            console.log(error);
        })
    },

    getUserTrips: (req, res) => {

    }

}