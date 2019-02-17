import React, { Component } from "react";
import axios from 'axios';
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { updateTripInfo } from "../../ducks/reducer";
import "./Profile.scss";

export class SavedTrips extends Component {
    constructor(props) {
        super(props)
        this.state = {
            saved: []
        }
    }

    componentDidMount = () =>{
        const { user } = this.props
        axios.get(`/api/get-liked/${user.id}`)
            .then(likedTrips => {
                this.setState({
                    saved: likedTrips.data
                })
            })
    }

    getTrip = (trip) => {
        const {updateTripInfo} = this.props;
        axios.get(`/api/retrieve-trip/${trip.id}`)
            .then(res=> {
                updateTripInfo(res.data.currentTrip)
                this.props.history.push('/map')
            })
            .catch(error => console.log('error getting trip', error))
    }
    
    render(){
        const {saved} = this.state;


        return (
            <div className="profile-tab-container">
                <div className="trips-container">
                    {
                        saved.length ?
                        saved.map(trip => {
                            console.log('------trip', trip)
                            return (
                                <div className="trip" onClick={()=>this.getTrip(trip)} style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${trip.featured_image})`}}>
                                    <h3>{trip.name.toUpperCase()}</h3>
                                </div>
                            );
                        }) 
                        : 
                            <div>
                                <h4 className="profile-message">Looks like you haven't saved any trips yet.</h4> 
                                <button><i className="fas fa-search"></i> Search for trips</button>
                            </div>
                    }
                    

                </div>
            </div>
        ) 
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        currentTrip: state.currentTrip
    }
}

export default withRouter(connect(mapStateToProps, { updateTripInfo })(SavedTrips));