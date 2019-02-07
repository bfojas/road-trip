import React from "react";
import "./Profile.scss";

export default function Following(props) {

    return (
        <div className="profile-tab-container">
            <div className="following-container">
                <div className="follow-bar">
                    <img src="https://avatars0.githubusercontent.com/u/17460334?s=460&v=4" />
                    <span>Josh Borup</span>
                    <button>Following</button>
                </div>
                <div className="follow-bar">
                    <img src="https://avatars1.githubusercontent.com/u/40079157?s=460&v=4" />
                    <span>Michael Kerr</span>
                    <button>Following</button>
                </div>
                <div className="follow-bar">
                    <img src="https://avatars2.githubusercontent.com/u/17994199?s=460&v=4" />
                    <span>Sean Parmar</span>
                    <button>Following</button>
                </div>
            </div>
        </div>
    );

}
