const initialState = {
    userDetails: {
        username: '',
        email: '',
        mobile: '',
        profile: '',
        token: ''
    },
    client: null,
    searchContactData:[],
    pin_data: []
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SUBMIT_REGISTER":
            return Object.assign({}, state, { userDetails: action.payload });

        case "USER_LOGIN":
            return Object.assign({}, state, { userDetails: action.payload });

        case "CREATE_CLIENT":
            return Object.assign({}, state, { client: action.payload });
            
        case "PIN_CONVERSATION":
            return Object.assign({}, state, { pin_data: action.data });
        case "LOGOUT":
             return initialState;
        case "SEARCH_DATA":
             return Object.assign({},state,{searchContactData:action.payload});
        default: return state;
    }
}

export default userReducer;

