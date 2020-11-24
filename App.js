import React, { Component } from 'react';
import {
  createAppContainer,
  createSwitchNavigator,
} from 'react-navigation';
import AuthLoadingScreen from './app/components/Common/AuthLoadingScreen'
import Geocoder from 'react-native-geocoding';


import { SafeAreaView, Platform } from 'react-native';
import { AuthStack } from './app/navigation/AuthStack';
import { MainTabs } from './app/navigation/MainTabs';
import { getFCMToken, saveFCMToken } from './app/services/Helper';
import { notificationManager } from './app/services/NotificationManager';
import * as notificationAction from './app/actions/notification'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Constants from './app/services/Constants'


Geocoder.init("AIzaSyBu4y9cmY9yqrwcnAbV0o8ofRl__YjJuQk");

const MainNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: MainTabs,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

const AppContainer = createAppContainer(MainNavigator);


class App extends Component {

  constructor(props) {
    super(props)
    this.localNotify = null
    this.senderID = Constants.FIREBASE_SENDER_ID
  }

  componentDidMount() {
    this.localNotify = notificationManager
    this.localNotify.configure(this.onRegister, this.onNotification,
      this.onOpenNotification, this.senderID)
  }

  onRegister = async (token) => {
    console.log("[Notification] Registered :", token);
    try {
      let fcmToken = await getFCMToken()
      console.log('Saved fcm token', fcmToken)
      if (fcmToken.localeCompare(token) != 0) {
        console.log('FCM Token Has changed')
        await saveFCMToken(token)
      }

    } catch (error) {

    }
  }

  onNotification = (notify) => {
    console.log("[Notification] onNotification :", notify);
    // const { route } = notify.data
    // console.log('Route', route)
    // if (route !== undefined && route !== '') {
    //   //this.setState({ route: route })
    //   this.props.actions.updateNotificationRoute(route)
    // }
  }

  onOpenNotification = (notify) => {
    console.log("[Notification] onOpenNotification :", notify);
    //alert("onOpenNotification " + notify.title)
    let route = ''
    if (Platform.OS == 'android') {
      route = notify.route
    }
    else if (Platform.OS == 'ios') {
      const { data } = notify
      if (data)
        route = data.route
    }
    console.log('Route', route)
    if (route !== undefined && route !== '') {
      //this.setState({ route: route })
      this.props.actions.updateNotificationRoute(route)
    }
  }

  onPressSendNotification = () => {
    const options = {
      soundName: 'default',
      playSound: true,
      vibrate: true

    }
    this.localNotify.showNotification(
      1,
      "App Notification",
      "Local Notification",
      {}, //data
      options // options
    )
  }

  onPressCancelNotification = () => {
    this.localNotify.cancelAllLocalNotification()
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AppContainer />
      </SafeAreaView>
    );
  }
}

const ActionCreators = Object.assign(
  {},
  notificationAction,
);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(App)