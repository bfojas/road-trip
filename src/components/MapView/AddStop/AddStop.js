import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AutoComplete from "react-google-autocomplete";
import {
  addStop,
  updateTripInfo,
  updateUserData
} from "../../../ducks/reducer";
import "./AddStop.scss";

class AddStop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      image: "",
      latitude: "",
      longitude: "",
      wait: true,
      buttonDisable: true,
      viewDisable: false,
      viewCreator: null,
      liked: false
    };
  }

  componentDidMount = () => {
    this.userCheck();
    this.likeCheck();
  };

  componentDidUpdate = prevProps => {
    if (prevProps !== this.props && this.props.user) {
      this.userCheck();
      this.likeCheck();
    }
  };

  userCheck = () => {
    const { tripUser } = this.props.currentTrip;
    const { id } = this.props.user;
    if (tripUser === id) {
      this.setState({ viewDisable: false });
    } else {
      this.setState({ viewDisable: true });
      axios.get(`/api/creator/${tripUser}`).then(creatorResponse => {
        this.setState({
          viewCreator: creatorResponse.data
        });
      });
    }
  };

  likeCheck = () => {
    const { likedTrips } = this.props.user;
    const { tripId } = this.props.currentTrip;
    if (likedTrips && likedTrips.includes(tripId)) {
      this.setState({
        liked: true
      });
    }
  };

  likeTrip = () => {
    const { liked } = this.state;
    const { user, currentTrip } = this.props;
    if (!user || !user.id) {
      this.props.history.push("/login");
    } else {
      let newLikeList;
      if (!liked) {
        newLikeList = user.likedTrips ? user.likedTrips.slice() : [];
        newLikeList.push(currentTrip.tripId);
      } else {
        newLikeList = user.likedTrips.filter(val => {
          return val !== currentTrip.tripId;
        });
        user.likedTrips = newLikeList;
      }
      user.likedTrips = newLikeList;
      axios.put(`/api/like-trip/${currentTrip.tripId}`, user).then(response => {
        updateUserData(user);
      });
    }

    this.setState({
      liked: !liked
    });
  };

  pickStop = location => {
    axios.get(`/api/get-google/${location.place_id}`).then(stopResponse => {
      // Destructure values from selected location.
      const { formatted_address } = location;
      const { long_name } = location.address_components[0];
      const imageSet = stopResponse.data
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${
            stopResponse.data
          }&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`
        : null;
      const latSet = location.geometry.location.lat();
      const lngSet = location.geometry.location.lng();
      // Set selected location values to state.
      this.setState({
        name: long_name,
        address: formatted_address,
        image: imageSet,
        latitude: latSet,
        longitude: lngSet,
        buttonDisable: false,
        liked: "far fa-heart"
      });
    });
  };

  addStop = () => {
    const { tripId, tripOrigin, tripWaypoints } = this.props.currentTrip;
    const { name, address, image, latitude, longitude } = this.state;
    let start_distance = Number(
      this.getDistance(tripOrigin, latitude, longitude).toFixed(5)
    );
    // ------ add stop to database
    axios
      .post("/api/add-stop", {
        tripId,
        start_distance,
        stop: {
          name,
          address,
          image,
          latitude,
          longitude
        }
      })
      .then(newStopId => {
        // ------create new waypoint array
        let newList = tripWaypoints.slice();
        let newStop = {
          name,
          address,
          image,
          latitude,
          longitude,
          start_distance,
          id: newStopId.data.id
        };
        let waypointIndexArray = [];
        // ------ places new stops based on distance from start point
        //------ function finds where to insert stop into array
        let insertInOrder = index => {
          var newIndex;
          if (index === newList.length) {
            newIndex = index;
          } else if (newList[index].start_distance < start_distance) {
            return insertInOrder(index + 1);
          } else {
            newIndex = index;
          }
          return newIndex;
        };
        //------ places stop into array
        if (newList.length) {
          let insertIndex = insertInOrder(0);

          newList.splice(insertIndex, 0, newStop);
        } else {
          newList.push(newStop);
        }

        //------ makes array of stop order by stop id
        waypointIndexArray = newList.map(val => {
          return val.id;
        });

        // ------ send new waypoint array to props
        const { currentTrip } = this.props;
        currentTrip.tripWaypoints = newList;
        this.props.updateTripInfo(currentTrip);

        //------ send stop order array to session/db
        axios.post("/api/stopOrder", {
          waypointIndexArray,
          tripId,
          newTrip: currentTrip
        });
      });
  };

  //Calculates distance from origin location for new stop.
  getDistance = (start, latitude, longitude) => {
    let aSquare = Math.pow(Math.abs(start.latitude - latitude), 2);
    let bSquare = Math.pow(Math.abs(start.longitude - longitude), 2);
    return Math.sqrt(aSquare + bSquare);
  };

  render() {
    const { viewDisable, viewCreator, liked } = this.state;
    const creatorImage = !viewCreator
      ? null
      : !viewCreator.profile_image
      ? "https://image.flaticon.com/icons/svg/189/189626.svg"
      : viewCreator.profile_image;
    const { tripUser } = this.props.currentTrip;
    const { deleteStyle } = this.props;
    let imageUrl;
    let displayName = "";
    if (this.props.currentTrip.tripDestination) {
      imageUrl = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${
        this.props.currentTrip.featuredImage
      })`;
      displayName = this.props.currentTrip.tripName;
    }
    return (
      // Waits to render input.
      this.state.wait ? (
        <div className="add-stop-container">
          <div>Loading...</div>
          {setTimeout(() => {
            this.setState({ wait: false });
          }, 500)}
        </div>
      ) : (
        <div
          className="add-stop-container"
          style={{
            backgroundImage: imageUrl,
            filter: deleteStyle
          }}
        >
          {!viewDisable ? (
            <i
              onClick={() => this.props.showModal("tripSettingsModal")}
              className="fas fa-cog"
            />
          ) : (
            <div
              onClick={() =>
                this.props.history.push(`/profile/${viewCreator.id}`)
              }
              className="creator-image"
              style={{ backgroundImage: `url(${creatorImage})` }}
            />
          )}
          {!viewDisable ? (
            <div className="search-component">
              <AutoComplete
                style={{ width: "75%" }}
                onPlaceSelected={this.pickStop}
                types={["geocode"]}
                componentRestrictions={{ country: ["us", "ca"] }}
              />
              <button
                onClick={this.addStop}
                disabled={this.state.buttonDisable}
              >
                Add
              </button>
            </div>
          ) : (
            <i
              onClick={() => this.likeTrip()}
              className={liked ? "fas fa-heart liked" : "far fa-heart"}
            />
          )}
          <h1>{displayName}</h1>
        </div>
      )
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    currentTrip: state.currentTrip
  };
};
const mapDispatchToProps = {
  addStop,
  updateTripInfo
};

// const wrappedRoute = GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_MAP_KEY})(AddStop)
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddStop)
);
