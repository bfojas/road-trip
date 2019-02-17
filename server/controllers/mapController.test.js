const newTrip = require('./mapController');
const axios = require('axios')

describe('unit tests', () => {
    
    describe('new trip', () => {
        it('should return a new trip', () => {
            axios.delete('/api/new-trip')
        })
    })

    describe('get trips', () => {
        it('should get trips from server', () => {
            axios.delete('/api/trips')
        })
    })
})


describe('integration test', () => {

    describe('new trip', () => {
        it('should return a new trip', () => {
            axios.delete('/api/new-trip')
            .then(res => {
                res.data = expect.any(Object)
            })
        })
    })

    describe('get trips', () => {
        it('should get trips from server', () => {
            axios.delete('/api/trips')
            .then(res => {
                res.data = expect.any(Object)
            })
        })
    })
})
