import React from 'react';
import './StopModal.scss'


function StopModal (props) {
    const {show, stopInfo, hide} = props


    return(
        show
        ?
        <div className="stop-modal">
            <button onClick={()=>hide()}>X</button>
            <div className="stop-info">
            name: {stopInfo.name}
            </div>
        </div>
        :null
    )


}

export default StopModal