import React, { Component } from 'react';
import { connect } from 'react-redux';

function Profile(props) {
        return (
            <div className="header-profile-main">
                <div className="header-profile-item">
                    <img className="header-profile-image" src={props.user.profile} alt="image" />
                </div>
                <div className="header-profile-item">Name : {props.user.username}</div>
                <div className="header-profile-item">Email : {props.user.email}</div>
                <div className="header-profile-item">Mobileno : (+91) {props.user.mobile}</div>
            </div>
        )
    }


const mapStateToProps = (state) => (
    {
        user: state.user.userDetails,
    }
);

export default connect(mapStateToProps, null)(Profile);