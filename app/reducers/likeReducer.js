import { LIKE_STATE_CHANGE, LIKE_SHOW_BADGE } from '../constants';
const initialState = {
    isStateChanged: false,
    showBadge: false
};
const likeReducer = (state = initialState, action) => {
    console.log('Like Action', action.type)
    switch (action.type) {
        case LIKE_STATE_CHANGE:
            console.log('Like Payload>>>', action.payload)
            return {
                ...state,
                isStateChanged: action.payload
            };
        case LIKE_SHOW_BADGE:
            return {
                ...state,
                showBadge: action.payload
            };
        default:
            return state;
    }
}
export default likeReducer;