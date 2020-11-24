import { NOTIFICATION_ROUTE_CHANGE } from '../constants';
export function updateNotificationRoute(route) {
    return {
        type: NOTIFICATION_ROUTE_CHANGE,
        payload: route
    }
}