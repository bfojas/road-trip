import React from "react";
import "./Profile.scss";

export default function Following(props) {
    const following = true;
    return following ? (
        <div className="profile-tab-container">
            <div className="following-container">
                {
                    following.length ? 
                        <div className="follow-bar">
                            <img src="https://avatars0.githubusercontent.com/u/17460334?s=460&v=4" />
                            <span>Josh Borup</span>
                            <button>Following</button>
                        </div>
                    :
                        <div>
                            <h4 className="profile-message">Looks like you aren't following anyone yet.</h4> 
                            <button><i className="fas fa-search"></i> Search for users</button>
                        </div>
                }    
            </div>
        </div>
    ) : null;

}
