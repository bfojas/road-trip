import React from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateTripInfo } from '../../ducks/reducer'
import "./Homepage.scss";

export function Homepage(props) {

    let getTrip = (trip) =>{
        const { updateTripInfo } = props
        axios.get(`/api/retrieve-trip/${trip}`)
            .then(res=>{
                updateTripInfo(res.data.currentTrip)
                props.history.push('/map')
            })
            .catch(error => console.log('error getting trip', error))
    }

    return (
        <div className="homepage-container">
            <section style={{backgroundColor: "#2955D9"}}>
                <div className="homepage-title">
                    <h1>Plan your next <br/> road trip adventure.</h1>
                    <p>Open Road is a web app that helps you map out your next road trip, add stops, search for landmarks and share your adventures.</p>
                    <Link to="/register"><button>GET STARTED <i className="fas fa-long-arrow-alt-right"></i></button></Link>
                </div>
            </section>
            <section></section>
            <div className="homepage-banner"></div>
            <div className="featured-trips-container">
                <div className="featured-trip" onClick={()=>getTrip(21)} style={{backgroundImage: "linear-gradient(rgba(225, 225, 225, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.pexels.com/photos/41004/alaska-wilderness-sky-aurora-borealis-41004.jpeg')"}}>
                    <i className="fas fa-bookmark"></i>
                    <div>
                        <h3>ALASKA</h3>
                        <p>Featured trip</p>
                    </div>
                </div>
                <div className="featured-trip" onClick={()=>getTrip(20)} style={{backgroundImage: "linear-gradient(rgba(225, 225, 225, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.pexels.com/photos/459028/pexels-photo-459028.jpeg')"}}>
                    <i className="fas fa-bookmark"></i>
                    <div>
                        <h3>YOSEMITE</h3>
                        <p>Featured trip</p>
                    </div>
                </div>
                <div className="featured-trip" onClick={()=>getTrip(21)} style={{backgroundImage: "linear-gradient(rgba(225, 225, 225, 0.5), rgba(0, 0, 0, 0.3)), url('https://images.pexels.com/photos/723496/pexels-photo-723496.jpeg')"}}>
                    <i className="fas fa-bookmark"></i>
                    <div>
                        <h3>CANADA</h3>
                        <p>Featured trip</p>
                    </div>
                </div>
            </div>
        </div>
    );
    
}

const mapDispatchToProps = {
    updateTripInfo
}

export default connect(null, mapDispatchToProps)(Homepage)