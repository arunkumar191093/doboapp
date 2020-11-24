import { createStore, combineReducers } from 'redux';
import locationReducer from '../reducers/locationReducer';
import networkReducer from '../reducers/networkReducer';
import likeReducer from '../reducers/likeReducer';
import giftVoucherReducer from '../reducers/giftVoucherReducer';
import loadingReducer from '../reducers/loadingReducer';
import notificationReducer from '../reducers/notificationReducer';

const rootReducer = combineReducers(
    {
        location: locationReducer,
        network: networkReducer,
        like: likeReducer,
        countGift: giftVoucherReducer,
        isLoading: loadingReducer,
        route: notificationReducer
    },
);
const configureStore = () => {
    return createStore(rootReducer);
}
export default configureStore;