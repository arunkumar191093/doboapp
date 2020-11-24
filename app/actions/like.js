import { LIKE_STATE_CHANGE, LIKE_SHOW_BADGE } from '../constants';
export function changeLikeState(likeState) {
    return {
        type: LIKE_STATE_CHANGE,
        payload: likeState
    }
}

export function changeLikeShowBadge(showBadge) {
    return {
        type: LIKE_SHOW_BADGE,
        payload: showBadge
    }
}