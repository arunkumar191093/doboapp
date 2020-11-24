import { NETWORK_STATE_CHANGE } from '../constants';
export function changeNetworkState(networkState) {
    return {
        type: NETWORK_STATE_CHANGE,
        payload: networkState
    }
}