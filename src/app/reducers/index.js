const initialState = {
    userDetails: {
        username: '',
        email: '',
        mobile: '',
        profile: '',
        token: ''
    }
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SUBMIT_REGISTER":
            return Object.assign({}, state, { userDetails: action.details });
            
        case "USER_LOGIN":
            return Object.assign({}, state, { userDetails: action.data });

        default: return state;
    }
}

export default userReducer;

