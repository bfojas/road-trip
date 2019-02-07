module.exports = {
    start: (req,res) => {
        const {origin, destination} = req.body
        console.log('body',req.body)
        req.app.get('db').add_stop(origin)
        req.app.get('db').add_stop(destination)
    }



}