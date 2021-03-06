import React, { Component } from "react";
import axios from "axios";
import AutoComplete from "react-google-autocomplete";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  updateTripInfo,
  updateTripId,
  updateUserTrips
} from "../../../ducks/reducer";
import "./StartTripModal.scss";

class StartTripModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originImage: "",
      originName: "Where do we start?",
      destinationImage: "",
      destinationName: "Where are we going?",
      submitDisable: true
    };
  }

  handleChange = e => {
    this.setState({ input: e });
  };

  //Sets trip origin in state with info.
  originPicker = location => {
    axios.get(`/api/get-google/${location.place_id}`).then(stopResponse => {
      //Destructure property values off passed location object.
      console.log("---response data", stopResponse.data);
      const { name } = location;
      const { formatted_address } = location;
      // console.log('----image function', location.photos[0].getUrl())
      const imageSet = stopResponse.data
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${
            stopResponse.data
          }&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`
        : null;
      const latSet = location.geometry.location.lat();
      const lngSet = location.geometry.location.lng();
      //Set those values to state as originPick object.
      this.setState({
        originPick: {
          name: name,
          address: formatted_address,
          image: imageSet,
          latitude: latSet,
          longitude: lngSet
        }
      });
      //Destructure state values.
      const {
        originPick,
        originImage,
        originName,
        destinationPick
      } = this.state;
      // Update modal image/name in state if changed.
      if (originPick && originImage !== `url(${originPick.image})`) {
        this.setState({ originImage: `url(${originPick.image})` });
      }
      if (originPick && originName !== `${originPick.address}`) {
        this.setState({ originName: `${originPick.address}` });
      }
      // if origin & desination are picked, enable submit button.
      if (originPick && destinationPick) {
        this.setState({ submitDisable: false });
      }
    });
  };

  // Sets trip destination in state with info.
  destinationPicker = location => {
    axios.get(`/api/get-google/${location.place_id}`).then(stopResponse => {
      const { name } = location;
      const { formatted_address } = location;
      const imageSet = stopResponse.data
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${
            stopResponse.data
          }&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`
        : null;
      const latSet = location.geometry.location.lat();
      const lngSet = location.geometry.location.lng();

      this.setState({
        destinationPick: {
          name: name,
          address: formatted_address,
          image: imageSet,
          latitude: latSet,
          longitude: lngSet
        }
      });

      const {
        originPick,
        destinationImage,
        destinationName,
        destinationPick
      } = this.state;
      // Update modal image/name in state if changed.
      if (
        destinationPick &&
        destinationImage !== `url(${destinationPick.image})`
      ) {
        this.setState({ destinationImage: `url(${destinationPick.image})` });
      }
      if (destinationPick && destinationName !== `${destinationPick.address}`) {
        this.setState({ destinationName: `${destinationPick.address}` });
      }
      // if origin & desination are picked, enable submit button.
      if (originPick && destinationPick) {
        this.setState({ submitDisable: false });
      }
    });
  };

  submitTrip = () => {
    const { originPick, destinationPick, destinationName } = this.state;
    // Sends trip data to db.
    axios
      .post("/api/start-trip", {
        origin: originPick,
        destination: destinationPick,
        name: destinationPick.name,
        userId: this.props.user.id,
        timeStamp: Date.now()
      })
      // Sends newly created trip ID to Redux.
      .then(response => {
        this.props.trips
          ? this.props.updateUserTrips([...this.props.trips, response.data[0]])
          : this.props.updateUserTrips([response.data[0]]);
        // Sends trip data to Redux.
        this.props.updateTripInfo({
          tripOrigin: originPick,
          tripDestination: destinationPick,
          tripName: destinationPick.name,
          featuredImage: destinationPick.image,
          tripWaypoints: [],
          tripId: response.data[0].id,
          tripUser: this.props.user.id
        });
        this.setState({
          originImage: "",
          originName: "Where do we start?",
          destinationImage: "",
          destinationName: "Where are we going?",
          submitDisable: true
        });
        this.props.closeModal("startModal");
      })
      .catch(error => console.log("------submit trip", error));
  };

  render() {
    const { show } = this.props;
    const { originName, destinationName } = this.state;

    return show ? (
      <div className="fade-div">
        <div className="start-trip-container">
          <div className="start-input">
            <div
              className="origin-select"
              style={{ backgroundImage: this.state.originImage }}
            >
              <div className="trans-box">
                <h1>{originName}</h1>
                <AutoComplete
                  style={{ width: "65%" }}
                  onPlaceSelected={this.originPicker}
                  types={["geocode"]}
                  componentRestrictions={{ country: ["us", "ca"] }}
                />
              </div>
            </div>
            <div
              className="destination-select"
              style={{ backgroundImage: this.state.destinationImage }}
            >
              <div className="trans-box">
                <h1>{destinationName}</h1>
                <AutoComplete
                  ref="destination"
                  style={{ width: "65%" }}
                  onPlaceSelected={this.destinationPicker}
                  types={["geocode"]}
                  componentRestrictions={{ country: ["us", "ca"] }}
                />
              </div>
            </div>
            <div className="submitButton">
              <button
                onClick={this.submitTrip}
                disabled={this.state.submitDisable}
              >
                LET'S GO!
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    trips: state.trips,
    currentTrip: state.currentTrip
  };
};
const mapDispatchToProps = {
  updateUserTrips,
  updateTripInfo,
  updateTripId
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(StartTripModal)
);
