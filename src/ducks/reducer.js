const initialState = {
    user: null,
    tripOrigin: null,
    tripDestination: null,
    tripName: '',
    tripWaypoints: []
}


export default function reducer (state = initialState, action){
    console.log('action', action)
    switch (action.type){
        case UPDATE_USER_DATA: 
            return Object.assign( {}, state, {user: action.payload} );
        case UPDATE_START_END_DATA:
            return Object.assign({}, state, {
                tripOrigin: action.payload.origin,
                tripDestination: action.payload.destination,
                tripName: action.payload.name})
        default: return state
    }

}

//ACTION TYPES
const UPDATE_USER_DATA = "UPDATE_USER_DATA";
const UPDATE_START_END_DATA = "UPDATE_START_END_DATA";

//ACTION CREATORS
export function updateUserData(userData) {
    return {
        type: UPDATE_USER_DATA,
        payload: userData
    }
}

export function updateStartEndData(response) {
    console.log('reducer', response)
    return {
        type: UPDATE_START_END_DATA,
        payload: response
    }
}