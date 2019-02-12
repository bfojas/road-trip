import React from "react";
import { Link } from "react-router-dom";
import "./Profile.scss";

export default function TripsList(props) {
    const { trips } = props;
    return trips ? (
        <div className="profile-tab-container">
            <div className="trips-container">
                { 
                    trips.length ? 
                        trips.map(trip => {
                            return (
                                <div className="trip" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${trip.images[0]})`}}>
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