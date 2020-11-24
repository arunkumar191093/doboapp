import { LOCATION_CHANGE, CURRENT_LOCATION_CHANGE } from '../constants';
export function changeLocation(location) {
    return {
        type: LOCATION_CHANGE,
        payload: location
    }
}

export function changeCurrentLocation(location) {
    return {
        type: CURRENT_LOCATION_CHANGE,
        payload: location
    }
}