module.exports = {
    //Creates trip, finds/adds stops for origin and destination, connects stops to trip.
    start: async (req, res) => {
        const { origin, destination, name, userId, timeStamp } = req.body;
        const { id } = req.session.user;
        //Creates new trip and stores id, name, and destination image in tripInfo variable.
        let tripInfo = await req.app.get('db').add_trip([userId, name, [origin.image, destination.image], destination.image])
            .catch(error => console.log('----tripInfo error', error))

        //Looks for existing stop with address matching origin address and creates new stop if doesn't exist,
        //storing id of newly created stop in originId variable.
        let originResponse = await req.app.get('db').find_stop_id(origin.address)
            .then(res => { 
                return res.length 
                ? res
                : req.app.get('db').add_stop(origin)
            })
            .catch(error => console.log('----originResponse error', error))

        //Looks for existing stop with address matching destination address and creates new stop if doesn't exist,
        //storing id of newly created stop in destinationId variable.            
        let destinationResponse = await req.app.get('db').find_stop_id(destination.address)
            .then(res => { 
                return res.length 
                ? res
                : req.app.get('db').add_stop(destination)
            })
            .catch(error => console.log('----destinationResponse error', error))
    
        //Sets current trip values to session.
        req.session.currentTrip = {
            tripOrigin: origin,
            tripDestination: destination,
            tripName: name,
            tripWaypoints: [],
            featuredImage: tripInfo[0].featured_image,
            tripId: tripInfo[0].id,
            userId: id
        };
        
        //Connects origin stop to trip in line_item table.
        req.app.get('db').add_line_item([id, tripInfo[0].id, originResponse[0].id, null]);
        //Connects destination stop to trip in line_item table.
        req.app.get('db').add_line_item([id, tripInfo[0].id, destinationResponse[0].id, null]);
        //Updates trip in db: inserts into orgin_id, destination_id, and active_time columns.
        req.app.get('db').add_trip_info([originResponse[0].id, destinationResponse[0].id, tripInfo[0].id, +timeStamp])
        res.status(200).send(tripInfo);
    },

    add: async (req, res) => {

        const { stop, tripId, start_distance } = req.body;

        const { id } = req.session.user;
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
            console.log('----------added', tripId, stopId[0].id, start_distance)
        req.app.get('db').add_line_item(id, tripId, stopId[0].id, start_distance);
        res.status(200).send(stopId[0])
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
        const {waypointIndexArray, tripId, newTrip} = req.body;
        req.session.currentTrip = newTrip
        req.app.get('db').set_trip_order([waypointIndexArray, tripId]);
        res.status(200).send(req.session.currentTrip);
    },

    retrieveTrip: (req, res) => {
        const {id} = req.params


        const dbInstance = req.app.get("db");
        dbInstance.retrieve_trip([+id])
            .then(async trip => {
                const {origin_id, destination_id, id: tripId, name: tripName, images} = trip[0];
                    let tripOrigin = await dbInstance.get_stop([origin_id])
                        .catch(error=> console.log('----trip origin error', error));
                    let tripDestination = await dbInstance.get_stop([destination_id])
                        .catch(error=> console.log('----trip dest error', error));
                    let waypoints = await dbInstance.get_waypoints([tripId, origin_id, destination_id])
                        .catch(error=> console.log('----waypoint error', error));
                    let wayPointOrder = await dbInstance.get_trip_order([tripId])
                        .catch(error=> console.log('----trip order error', error))
                    let tripWaypoints = []

                    if (wayPointOrder.length && wayPointOrder[0].waypoint_order){
                        tripWaypoints = wayPointOrder[0].waypoint_order.map(val=>{
                            return waypoints.filter(stop =>{
                                return +val === stop.id
                            })[0]
                        })}
                    req.session.currentTrip = await {
                        tripOrigin: tripOrigin[0], 
                        tripDestination: tripDestination[0],
                        featuredImage: trip[0].featured_image,
                        tripName, 
                        tripWaypoints, 
                        tripId}
                    res.status(200).send({currentTrip: req.session.currentTrip });
            })
    }

}