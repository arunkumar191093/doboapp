/**
 * @format
 */

import { AppRegistry } from 'react-native';
import React from 'react';
import App from './App.js';
import { name as appName } from './app.json';

import { Provider } from 'react-redux';

import configureStore from './app/store/configureStore';

const store = configureStore()

const RNRedux = () => (
    <Provider store={store}>
        <App />
    </Provider>
)

AppRegistry.registerComponent(appName, () => RNRedux);

// var sharedBlacklist = [
//   /node_modules[\/\\]react[\/\\]dist[\/\\].*/,
//   /website\/node_modules\/.*/,
//   /heapCapture\/bundle\.js/,
//   /.*\/__tests__\/.*/
// ];
