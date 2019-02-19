import React, {useEffect, useState} from "react";
import axios from 'axios'
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { updateTripInfo } from "../../ducks/reducer";
import "./Profile.scss";


export function TripsList (props) {
    const [tripList, setTripList] = useState([])

    console.log('----props profile', props.profile)
    const { trips, updateTripInfo, user, profile } = props;

    useEffect(()=>getTripList(), [props.profile])
    
    let getTrip = (trip) => {
        axios.get(`/api/retrieve-trip/${trip.id}`)
            .then(res=> {
                updateTripInfo(res.data.currentTrip)
                props.history.push('/map')
            })
            .catch(error => console.log('error getting trip', error))
    }

    let getTripsFromServer =(id) =>{
        axios.get(`/api/trips/${id}`).then(response => {
            setTripList(response.data)
        console.log('=-=-=-=-=-hooks!!!', tripList)
            
        })
    }

    let getTripList = () => {
        if (user.id !== profile.id){
        console.log('=-=-=-=-=-hooks!!!', tripList)
        
            setTripList(trips)
        } else {
            getTripsFromServer(profile.id)
        }
    }


    return trips ? (
        <div className="profile-tab-container">
            <div className="trips-container">
                { 
                    trips.length ? 
                        trips.map(trip => {
                            return (
                                <div className="trip" onClick={()=>getTrip(trip)} style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${trip.featured_image})`}}>
                                    <h3>{trip.name.toUpperCase()}</h3>
                                </div>
                            );
                        }) 
                    : 
                    <div>
                        <h4 className="profile-message">Looks like you don't have any trips yet.</h4> 
                        <Link to="/map"><button><i className="fas fa-plus"></i> Start a new trip</button></Link>
                    </div>
                }
            </div>
        </div>
    ) : null;

}

const mapStateToProps = state =>{
    return {
        user: state.user,
        currentTrip: state.currentTrip
    }
}

export default withRouter(connect(mapStateToProps, { updateTripInfo })(TripsList))