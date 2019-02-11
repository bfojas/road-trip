module.exports = {
    //Creates trip, finds/adds stops for origin and destination, connects stops to trip.
    start: async (req, res) => {
        const { origin, destination, name, userId, timeStamp } = req.body;
        //Sets trip ID.
        let tripId = await req.app.get('db').add_trip([userId, name, [destination.image]])
            .catch(error => console.log('----tripId error', error))

        //Looks for existing stop with address matching origin address and creates new stop if doesn't exist,
        //storing id of newly created stop in originId variable.
        let originId = await req.app.get('db').find_stop_id(origin.address)
            .then(res => { 
                return res.length 
                ? res
                : req.app.get('db').add_stop(origin)
            })
            .catch(error => console.log('----originId error', error))

        //Looks for existing stop with address matching destination address and creates new stop if doesn't exist,
        //storing id of newly created stop in destinationId variable.            
        let destinationId = await req.app.get('db').find_stop_id(destination.address)
            .then(res => { 
                return res.length 
                ? res
                : req.app.get('db').add_stop(destination)
            })
            .catch(error => console.log('----destinationId error', error))
    
        //Sets current trip values to session.
        req.session.currentTrip = {
            tripOrigin: origin,
            tripDestination: destination,
            tripName: name,
            tripWaypoints: [],
            tripId: tripId[0]
        };
        //Connects origin stop to trip in line_item table.
        req.app.get('db').add_line_item([tripId[0].id, originId[0].id, null]);
        //Connects destination stop to trip in line_item table.
        req.app.get('db').add_line_item([tripId[0].id, destinationId[0].id, null]);
        //Updates trip in db: inserts into orgin_id, destination_id, and active_time columns.
        req.app.get('db').add_trip_info([originId[0].id, destinationId[0].id, tripId[0].id, +timeStamp])
        res.status(200).send(tripId);
    },

    add: async (req, res) => {
        const { stop, tripId, start_distance } = req.body;
        // Looks for existing stop with address matching passed address and creates new stop if doesn't exist, 
        // storing id of newly created stop in stopId variable.
        let stopId = await req.app.get('db').find_stop_id(stop.address)
            .then(res => { 
                return res.length 
                ? res
                : req.app.get('db').add_stop(stop)
            })
            .catch(error => console.log('-----add stop', error));
        // Connects new stop to current trip in line_item table.   
        req.app.get('db').add_line_item(tripId, stopId[0].id, start_distance);
    },

    newTrip: (req, res) => {
        req.session.currentTrip = {
            tripOrigin: null,
            tripDestination: null,
            tripName: '',
            tripWaypoints: [],
            tripId: 0
        }
        res.status(200).send(req.session.currentTrip);
    },

    setOrder: (req, res) => {
        const {waypointIndexArray, tripId} = req.body;
        req.session.currentTrip.wayPointIdArray = waypointIndexArray;
        req.app.get('db').set_trip_order([waypointIndexArray, tripId]);
    }

}