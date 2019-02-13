import React, {Component} from 'react';
import './StopModal.scss'
import { renderComponent } from 'recompose';


class StopModal extends Component {

    render(){
    const {show, stopInfo, hide} = this.props

        return(
            show
            ?<div className="stop-fade" onClick={()=>hide()}>
                <div className="stop-modal">
                    <div className="stop-info">
                    <div className="stop-background" style={{backgroundImage: `url(${stopInfo.image})`}}/>
                    name: {stopInfo.name}
                    </div>
                </div>
            </div>
            :null
        )

    }
}

export default StopModal