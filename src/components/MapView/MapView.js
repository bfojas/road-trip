import React, {Component} from 'react';
import MapRender from './mapRender/mapRender'


class MapView extends Component {
    constructor(props){
        super(props)
    }


    render(){

        return(
            <div>
                <div className="map-container">
                    <MapRender/>
                </div>
                <div className="route-container">
                
                </div>
            </div>
        )
    }
}

export default MapView