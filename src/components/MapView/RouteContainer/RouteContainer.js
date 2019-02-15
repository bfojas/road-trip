import React, {Component} from "react";
import { GoogleApiWrapper } from "google-maps-react";
import { connect } from "react-redux";
import { DragDropContainer, DropTarget } from "react-drag-drop-container";
import { slide as Menu } from "react-burger-menu";
import AddStop from "../AddStop/AddStop";
import StopModal from './StopModal'
import { updateTripInfo } from "../../../ducks/reducer";
import "./RouteContainer.scss";
import axios from "axios";

class RouteContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            modalInfo: null,
            visitDisable: false
        }
    }

    // componentDidMount = () => {
    //     this.userCheck()
    // }

    // userCheck = () => {
    //     const { tripUser } = this.props.currentTrip;
    //     const { id } = this.props.user;
    //     if (tripUser === id){
    //         this.setState({visitDisable: false})
    //     } else {
    //         this.setState({visitDisable: true})
    //     }
    // }

    drop = async (drag, drop) => {
        const {updateTripInfo} = this.props;
        const {tripWaypoints, tripOrigin, tripDestination, tripName, tripId} = this.props.currentTrip
        let newArr = tripWaypoints.slice();
        let element = newArr.splice(drag, 1);
        newArr.splice(+drop, 0 , element[0])
        let newTrip= {tripWaypoints: newArr, tripOrigin, tripDestination, tripName, tripId}
        updateTripInfo(newTrip)
        let waypointIndexArray = await tripWaypoints.map(val=> val.id)
        axios.post('/api/stopOrder', {waypointIndexArray, tripId, newTrip})
            .catch(error => console.log('--- change route error', error))
    }

    showModal = (stop) => {
        this.setState({
            showModal: true,
            modalInfo: stop
        })
    }

    hideModal = () => {
        this.setState({
            showModal: false
        })
    }

    render() {
        const {tripWaypoints, tripOrigin, tripDestination} = this.props.currentTrip
        const {showModal, modalInfo, visitDisable} = this.state
        let mappedWaypoints = tripWaypoints.length ? tripWaypoints.map((val,i) =>{
            return(
                
                <DragDropContainer dragData={{drag:i}}>
                    <DropTarget onHit={e=>this.drop(e.dragData.drag, e.target.id)}>
                        <div key={val.name} className="stop" id={i} onClick={()=>this.showModal(val)}>
                            <h3><i className="far fa-circle"></i> {val.name}</h3>
                            <div className="image-div" style={{backgroundImage: `url(${val.image})`}}></div>
                        </div>
                    </DropTarget>
                </DragDropContainer>
            )
        }) :null

        return (
            tripDestination ?
                <Menu right isOpen>
                    <div className="route-holder">
                        {/* <div className="route-tab"></div> */}
                        <AddStop showModal={this.props.showModal} />
                        <div className="stop-container">
                            <div key={tripOrigin.name} className="stop" onClick={()=>this.showModal(tripOrigin)}>
                                <h3><i className="far fa-circle"></i> {tripOrigin.name}</h3>
                                <div className="image-div" style={{backgroundImage: `url(${tripOrigin.image})`}}></div>
                            </div>
                            {mappedWaypoints}
                            <div key={tripDestination.name} className="stop" onClick={()=>this.showModal(tripDestination)}>
                                <h3><i className="far fa-circle"></i> {tripDestination.name}</h3>
                                <div className="image-div" style={{backgroundImage: `url(${tripDestination.image})`}}></div>
                            </div>
                        </div>
                        <StopModal show={showModal} stopInfo={modalInfo} hide={this.hideModal}/>
                    </div>
                </Menu>
            : null
        );
    }

}

const mapStateToProps = state => {
    return {
        user: state.user,
        currentTrip: state.currentTrip,
        tripWaypoints: state.currentTrip.tripWaypoints
    }
}

const mapDispatchToProps = {
    updateTripInfo
}

const wrappedRoute = GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_KEY})(RouteContainer);
export default connect(mapStateToProps, mapDispatchToProps)(wrappedRoute);