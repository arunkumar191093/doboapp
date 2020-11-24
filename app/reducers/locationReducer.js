import { LOCATION_CHANGE, CURRENT_LOCATION_CHANGE } from '../constants';
const initialState = {
    shortAddress: 'locating...',
    longAddress: '',
    coordinates: {
        latitude: 12.9798195,
        longitude: 77.6775588,
    },
    currentUserAddress: '',
    currentUserCoordinates: {
        latitude: 12.9798195,
        longitude: 77.6775588,
    }
};
const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOCATION_CHANGE:
            return {
                ...state,
                shortAddress: action.payload.shortAddress,
                longAddress: action.payload.longAddress,
                coordinates: action.payload.coordinates
            };
        case CURRENT_LOCATION_CHANGE:
            return {
                ...state,
                currentUserAddress: action.payload.currentUserAddress,
                currentUserCoordinates: action.payload.currentUserCoordinates
            };
        default:
            return state;
    }
}
export default locationReducer;