import React from "react";
import "./Profile.scss";

export default function TripsList(props) {
    const { trips } = props;
    return trips ? (
        <div className="profile-tab-container">
            <div className="trips-container">
                { trips.map(trip => {
                    return (
                        <div className="trip" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${trip.images[0]})`}}>
                            <h3>{trip.name.toUpperCase()}</h3>
                        </div>
                    );
                }) }
            </div>
        </div>
    ) : null;

}