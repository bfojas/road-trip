import React, { Component } from "react";
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
            visitDisable: false,
            dragging: false,
            deleteStyle: "blur(0px)"
        }
    }

    componentDidMount = () => {
        setTimeout(()=>this.userCheck(),200)
    }

    userCheck = () => {
        const { tripUser } = this.props.currentTrip;
        const { id } = this.props.user;
        if (tripUser === id){
            this.setState({visitDisable: false})
        } else {
            this.setState({visitDisable: true})
            axios.get(`/api/creator/${tripUser}`)
            .then(creatorResponse => {
                this.setState({
                    viewCreator: creatorResponse.data
                })
            })
        }
    }

    getImage = (place) => {

    }

    dragStart = () => {
        this.setState({
            dragging: true,
            deleteStyle: "blur(5px)"
        })
    }

    dragEnd = () => {
        this.setState({
            dragging: false,
            deleteStyle: "blur(0px)"
        })
    }

    deleteStop = async (drag) => {
        console.log('-----drag', drag)
        const {tripWaypoints, currentTrip, updateTripInfo} = this.props;
        let newWaypointArray = await tripWaypoints.filter(val => {
            return val.id !== drag
        })
        console.log('----new array', newWaypointArray)
        currentTrip.tripWaypoints = newWaypointArray;
        console.log('-----------current', currentTrip)
        axios.put(`/api/delete-stop/${drag}`, {newWaypointArray})
        
        updateTripInfo(currentTrip)

    }

    drop = async (drag, drop) => {
        const {updateTripInfo} = this.props;
        const {tripWaypoints, tripOrigin, tripDestination, tripName, tripId, featuredImage, tripUser} = this.props.currentTrip
        let newArr = tripWaypoints.slice();
        let element = newArr.splice(drag, 1);
        newArr.splice(+drop, 0 , element[0])
        let newTrip= {tripWaypoints: newArr, tripOrigin, tripDestination, tripName, tripId, featuredImage, tripUser}
        updateTripInfo(newTrip)
        let waypointIndexArray = await newArr.map(val=> val.id)
        axios.post('/api/stopOrder', {waypointIndexArray, tripId, newTrip})
            .catch(error => console.log('--- change route error', error))
    }

    showModal = (stop) => {
        // this.setState({
        //     showModal: true,
        //     modalInfo: stop
        // })
    }

    hideModal = () => {
        this.setState({
            showModal: false
        })
    }

    render() {
        const {dragging} = this.state;
        const {tripOrigin, tripDestination, tripUser} = this.props.currentTrip;
        const {tripWaypoints} = this.props;
        const {showModal, modalInfo, visitDisable} = this.state;
        const deleteStyle = dragging ? {display: "flex"} : {display: "none"}
        // const deleteStyle = {display: "flex"}
        let mappedWaypoints = tripWaypoints.length ? tripWaypoints.map((val,i) =>{

            return(
                !visitDisable
                ?
                <DragDropContainer 
                    dragHandleClassName="far fa-circle" 
                    dragData={{
                        drag:i,
                        stop: val.id
                    }} 
                    onDrag={this.dragStart}
                    onDragEnd={this.dragEnd}
                    key={val.name}>
                    {
                        // axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/output?parameters`)
                    }
                    <DropTarget onHit={e=>this.drop(e.dragData.drag, e.target.id)}>
                        <div key={val.name} className="stop" id={i} onClick={()=>this.showModal(val)}>
                            <h3><i className="far fa-circle"></i> {val.name}</h3>
                            <div className="image-div" style={{backgroundImage: `url(${val.image})`}}></div>
                        </div>
                    </DropTarget>
                </DragDropContainer>
                :
                <div key={val.name} className="stop" id={i} onClick={()=>this.showModal(val)}>
                    <h3><i className="far fa-circle"></i> {val.name}</h3>
                    <div className="image-div" style={{backgroundImage: `url(${val.image})`}}></div>
                </div>
            )
        }) :null

        return (
            tripDestination ?
                <Menu right isOpen>
                    <div className="route-holder">
                        {/* <div className="route-tab"></div> */}
                        <DropTarget onHit={e=>this.deleteStop(e.dragData.stop)}>
                            <div className="delete-stop-box" style={deleteStyle}>
                                <i className="fas fa-trash-alt"></i>
                                <h2>DRAG HERE<br/>TO DELETE</h2>
                            </div>
                            <AddStop deleteStyle={this.state.deleteStyle} showModal={this.props.showModal} />
                        </DropTarget>
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
        tripWaypoints: state.currentTrip && state.currentTrip.tripWaypoints
    }
}

const mapDispatchToProps = {
    updateTripInfo
}

const wrappedRoute = GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_KEY})(RouteContainer);
export default connect(mapStateToProps, mapDispatchToProps)(wrappedRoute);