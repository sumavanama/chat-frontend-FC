import React from 'react';
import './Header.css';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
//import { logOut } from '../../actions/actions';

function Options(props) {
    const logOut = () => {
        props.logOut();
        props.history.push('/');
    }
        return (
            <div className='overlay' onClick={props.onClose}>
                <div className="options">
                    <div className="option-item" onClick={props.showProfile}>Profile</div>
                    <div className="option-item">Add to archive</div>
                    <div className="option-item-logout" onClick={logOut}>Logout</div>
                </div>
            </div>
        )
}

// const mapDispatchToProps = (dispatch) => ({
//     logOut: () => dispatch(logOut()),
// })

export default connect(null, null)(withRouter(Options));