import React from "react";
import "./Profile.scss";

export default function SavedTrips(props) {
    const saved = true;
    return saved ? (
        <div className="profile-tab-container">
            <div className="trips-container">
                {
                    saved.length ?
                        <div className="trip">
                            <h3>ALASKA</h3>
                            <i className="fas fa-heart"></i>
                        </div>
                    : 
                        <div>
                            <h4 className="profile-message">Looks like you haven't saved any trips yet.</h4> 
                            <button><i className="fas fa-search"></i> Search for trips</button>
                        </div>
                }
                

            </div>
        </div>
    ) : null;

}
