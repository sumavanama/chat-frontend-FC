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

        default: return state;
    }
}

export default userReducer;

