import { NETWORK_STATE_CHANGE } from '../constants';
const initialState = {
    isConnected: true,
};
const networkReducer = (state = initialState, action) => {
    console.log('Network Action', action.type)
    switch (action.type) {
        case NETWORK_STATE_CHANGE:
            console.log('Network Payload>>>', action.payload)
            return {
                ...state,
                isConnected: action.payload
            };
        default:
            return state;
    }
}
export default networkReducer;