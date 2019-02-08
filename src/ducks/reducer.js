const initialState = {
    user: null,
    tripOrigin: null,
    tripDestination: null,
    tripName: '',
    tripWaypoints: [],
    tripId:7
}


export default function reducer (state = initialState, action){
    console.log('action', action)
    switch (action.type){
        case UPDATE_USER_DATA: 
            return Object.assign( {}, state, {user: action.payload} );
        case UPDATE_START_END_DATA:
            return Object.assign( {}, state, {
                tripOrigin: action.payload.origin,
                tripDestination: action.payload.destination,
                tripName: action.payload.name})
        case UPDATE_TRIP_ID:
            return Object.assign( {}, state, {tripId: action.payload})
        case ADD_STOP:
            return Object.assign( {}, state, {tripWaypoints: action.payload})
        default: return state
    }

}

//ACTION TYPES
const UPDATE_USER_DATA = "UPDATE_USER_DATA";
const UPDATE_START_END_DATA = "UPDATE_START_END_DATA";
const UPDATE_TRIP_ID = "UPDATE_TRIP_ID"
const ADD_STOP = "ADD_STOP"

//ACTION CREATORS
export function updateUserData(userData) {
    return {
        type: UPDATE_USER_DATA,
        payload: userData
    }
}

export function updateStartEndData(response) {
    return {
        type: UPDATE_START_END_DATA,
        payload: response
    }
}

export function addStop(location) {
    return {
        type: ADD_STOP,
        payload: location
    }
}

export function updateTripId(id) {
    return {
        type: UPDATE_TRIP_ID,
        payload: id
    }
}