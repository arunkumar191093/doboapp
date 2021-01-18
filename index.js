/**
 * @format
 */

import { AppRegistry } from 'react-native';
import React from 'react';
import App from './App.js';
import { name as appName } from './app.json';

import Reactotron from 'reactotron-react-native';
import apisaucePlugin from 'reactotron-apisauce';

import { Provider } from 'react-redux';

import configureStore from './app/store/configureStore';

console.disableYellowBox = true;

const store = configureStore()

const RNRedux = () => (
    <Provider store={store}>
        <App />
    </Provider>
)

AppRegistry.registerComponent(appName, () => RNRedux);

Reactotron.use(apisaucePlugin()).useReactNative().connect();

// var sharedBlacklist = [
//   /node_modules[\/\\]react[\/\\]dist[\/\\].*/,
//   /website\/node_modules\/.*/,
//   /heapCapture\/bundle\.js/,
//   /.*\/__tests__\/.*/
// ];
