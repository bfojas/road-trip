var self = module.exports = {

    initialTrip: {
            tripOrigin: null,
            tripDestination: null,
            tripName: "",
            tripWaypoints: [],
            featuredImage: null,
            tripUser: 0,
            tripId: 0
    },

    updateUserInfo: (req, res) => {
        const { id } = req.params;
        const { name, email, bio, profile_image, cover_image, likedTrips } = req.body;
        const dbInstance = req.app.get("db");
        dbInstance.update_user_info([ id, name, email, bio, profile_image, cover_image, likedTrips ])
            .then(users => {               
                const { id, name, email, bio, profile_image, cover_image, liked_trips: likedTrips } = users[0];
                req.session.user = { id, name, email, bio, profile_image, cover_image, likedTrips };
                res.status(200).send({users});
            })
            .catch(error => {
                res.status(500).send({errorMessage: "Error in updateUser method"});
                console.log('update user error', error);
            })
    },

    getTrips: (req, res) => {
        const { id } = req.params;
        const dbInstance = req.app.get("db");
        dbInstance.get_user_trips([ id ]).then(trips => {
            res.status(200).send(trips);
        })
        .catch(error => {
            res.status(500).send({errorMessage: "Error in getUserTrips method"});
            console.log('get user trip error', error);
        })
    }, 

    updateTrip: (req, res) => {
        const { id } = req.session.user;
        const { name, featuredImage, tripId } = req.body;
        const dbInstance = req.app.get("db");
        dbInstance.update_trip([ name, featuredImage, tripId, id ]).then(trips => {
            const { name, featured_image } = trips[0];
            req.session.currentTrip = { ...req.session.currentTrip, tripName: name, featuredImage: featured_image };
            res.status(200).send(req.session.currentTrip);
        })
        .catch(error => {
            res.status(500).send({errorMessage: "Error in updateTrip method"});
            console.log('update trip error', error);
        })
    },

    deleteTrip: (req, res) => {
        const tripId = req.params.id;
        const userId = req.session.user.id;
        const dbInstance = req.app.get("db");
        dbInstance.delete_trip([ tripId, userId ]).then(trips => {
            req.session.currentTrip = self.initialTrip;
            res.status(200).send(trips);
        })
        .catch(error => {
            res.status(500).send({errorMessage: "Error in deleteTrip method"});
            console.log('delete trip error', error)
        })
    },

    getCreator:  (req, res) => {
        const {id} = req.params
        const dbInstance = req.app.get('db');
        dbInstance.find_user_by_id([id]).then(user =>{
            res.status(200).send(user[0])
        })
        .catch(error =>{
            res.status(500).send({errorMessage: "Error in getCreator method"});
            console.log('get creator error', error)
        })
    },

    likeTrip: (req, res) => {
        console.log('req.body', req.body)
        const {id, likedTrips} = req.body
        req.session.user = req.body;
        const dbInstance = req.app.get('db');
        dbInstance.like_trip([likedTrips, id])
        .then(user => {
            res.status(200).send(user[0])
        })
        .catch(error => {
            res.status(500).send({errorMessage: "Error in likedTrip method"});
            console.log('like trip error', error)
        })
    },

    getLikedTrips: (req, res) => {
        const {user} = req.session;
        const dbInstance = req.app.get('db');
        dbInstance.get_liked_trips([user.likedTrips])
        .then(trips => {
            res.status(200).send(trips)
        })
        .catch(error => {
            res.status(500).send({errorMessage: "Error in getLikedTrips method"});
            console.log('get liked trips error', error)
        })
    },

    getProfile: (req, res) => {
        const { id } = req.params;
        const dbInstance = req.app.get('db');
        dbInstance.get_profile([+id])
        .then(profile => {
            res.status(200).send(profile[0])
        })
        .catch(error => {
            res.status(500).send({errorMessage: "Error in getProfile method"});
            console.log('get profile error', error)
        })
    }

}