import { NOTIFICATION_ROUTE_CHANGE } from '../constants';
const initialState = {
    routeName: 'Home',
};
const notificationReducer = (state = initialState, action) => {
    console.log('Notification Action', action.type)
    switch (action.type) {
        case NOTIFICATION_ROUTE_CHANGE:
            console.log('Route Payload>>>', action.payload)
            return {
                ...state,
                routeName: action.payload
            };
        default:
            return state;
    }
}
export default notificationReducer;