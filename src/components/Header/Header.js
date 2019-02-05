import './Header.scss'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

class Header extends Component {
    constructor(props){
        super(props)
        this.state={
            toggle: "hide"
        }
    }    

    toggleMenu = () =>{
        console.log('toggle')
        this.setState((prevState) => {
            return {
                toggle: !prevState.toggle
            }
        })
    }

    render(){
        let navHide = "block"
        let profileHide = "none"
        let headerColor = '#2955D9'
        console.log("match",this.props.match)
        if (this.props.match.path === '/')
        {}

        return(
            <div className="header-container" 
            style={{backgroundColor: headerColor}}>
                <div className="header-icon">
                Header
                </div>
                <div className="header-nav"
                style={{display: navHide}}>
                    <ul>
                        <li>Plan a Trip</li>
                        <li>Explore</li>
                        <li>Sign Up</li>
                    </ul>
                </div>
                <div className="header-user" style={{display: profileHide}}>
                    <img src="" alt="user-profile"
                    onError={(e)=>{e.target.onerror = null; 
                        e.target.src="images/unavailable.jpg"}}
                    />
                </div>
                <div className="header-menu" onClick={()=>this.toggleMenu()}>
                    <div className="header-burger"></div>
                    <div className="header-burger"></div>
                    <div className="header-burger"></div>
                </div>
                <ul className={this.state.toggle?"hide-menu": "show-menu"}>
                        <li>Plan a Trip</li>
                        <li>Explore</li>
                        <li>Sign Up</li>
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        user: state.user

    }
}

export default withRouter(connect(mapStateToProps)(Header))
