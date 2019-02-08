module.exports = {
    start: async (req,res) => {
        const {origin, destination, name, userId} = req.body

//sets trip ID
        let tripId = await req.app.get('db').add_trip([userId, name, [destination.image]])
            .catch(error => console.log('----tripId error', error))
        
//looks for existing stops and creates new if doesn't exist
            let originId =  await req.app.get('db').find_stop_id(origin.address)
            .then(res=>{ 
                return res.length 
                ? res
                : req.app.get('db').add_stop(origin)})
            .catch(error => console.log('----originId error', error))

//looks for existing stops and creates new if doesn't exist            
        let destinationId = await req.app.get('db').find_stop_id(destination.address)
            .then(res=>{ return res.length 
                ? res
                : req.app.get('db').add_stop(destination)})
                .catch(error => console.log('----destinationId error', error))

//connects stops to trip in line_item table                
        req.app.get('db').add_line_item([tripId[0].id, originId[0].id])
        req.app.get('db').add_line_item([tripId[0].id, destinationId[0].id])
        res.status(200).send(tripId)
    },

    add: async (req, res) => {
        const {stop, tripId} = req.body
        console.log(tripId)
        let stopId =  await req.app.get('db').find_stop_id(stop.address)
            .then(res=>{ 
                return res.length 
                ? res
                : req.app.get('db').add_stop(stop)})

        req.app.get('db').add_line_item(tripId, stopId[0].id)
        .catch(error=>console.log('-----add stop', error))

    }



}