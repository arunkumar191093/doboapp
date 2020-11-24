import { IS_LOADING } from '../constants';
export function changeLoadingState(loadingState) {
    return {
        type: IS_LOADING,
        payload: loadingState
    }
}
