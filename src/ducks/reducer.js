const initialState = {
    user: null
}

export default function reducer (state = initialState, action){
    console.log('action', action)
    switch (action.type){
        case UPDATE_USER_DATA: 
               return Object.assign( {}, state, {user: action.payload} );
        default: return state
    }

}

//ACTION TYPES
const UPDATE_USER_DATA = "UPDATE_USER_DATA";

//ACTION CREATORS
export function updateUserData(userData) {
    return {
        type: UPDATE_USER_DATA,
        payload: userData
    }
}