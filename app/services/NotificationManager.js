import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class NotificationManager {
    configure = (onRegister, onNotification, onOpenNotification, senderID) => {
        console.log('Calling configure')
        PushNotification.configure({
            onRegister: function (token) {
                onRegister(token.token)
                console.log("[NotificationManager] onRegister token:", token.token);
            },

            onNotification: function (notification) {
                console.log("[NotificationManager] onNOTIFICATION:", JSON.stringify(notification));
                if (Platform.OS === 'ios') {
                    if (notification.data.openedInForeground) {
                        notification.userInteraction = true
                    }
                }
                if (Platform.OS === 'android') {
                    if (notification.foreground == false)
                        notification.userInteraction = true
                }

                if (notification.userInteraction) {
                    onOpenNotification(notification)
                } else {
                    onNotification(notification)
                }

                // if (Platform.OS === 'android') {
                //     notification.userInteraction = true
                // }

                //Only call callback  if not from foreground
                if (Platform.OS === 'ios') {
                    if (!notification.data.openedInForeground) {
                        notification.finish(PushNotificationIOS.FetchResult.NoData)
                    }
                }
                // else {
                //     notification.finish('backgroundFetchResultNewData')
                // }
            },
            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            requestPermissions: true,
            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: senderID,
        })
    }
    _buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
        return {
            id: id,
            autoCancel: true,
            largeIcon: options.largeIcon || "ic_launcher",
            smallIcon: options.smallIcon || "ic_launcher",
            bigText: message || '',
            subText: title || '',
            vibrate: options.vibrate || false,
            vibration: options.vibration || 300,
            priority: options.priority || "high",
            importance: options.importance || "high",
            data: data
        }
    }
    _buildIOSNotification = (id, title, message, data = {}, options = {}) => {
        return {
            alertAction: options.alertAction || "view",
            category: options.category || "",
            userInfo: {
                id: id,
                item: data
            }
        }
    }

    showNotification = (id, title, message, data = {}, options = {}) => {
        PushNotification.localNotification({
            /* Android Only Properties*/
            ...this._buildAndroidNotification(id, title, message, data, options),
            /* IOS Only Properties*/
            ...this._buildIOSNotification(id, title, message, data, options),
            /* IOSand Android Properties*/
            title: title || "",
            message: message || "",
            playSound: options.playSound || false,
            soundName: options.soundName || 'default',
            userInteraction: false //if the notification was opened by the user from the notification area or not
        })
    }
    cancelAllLocalNotification = () => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications()
        } else {
            PushNotification.cancelAllLocalNotifications()
        }
    }

    unregister = () => {
        PushNotification.unregister()
    }
}

export const notificationManager = new NotificationManager()