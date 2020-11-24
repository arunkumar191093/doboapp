import React, { Component } from 'react'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import BuyVouchers from './BuyVouchers';
import MyVouchers from './MyVouchers';
import * as Constants from '../../services/Constants'
import { View,Text } from 'react-native';
import VoucherBadge from '../Common/VoucherBadge';


export const GiftVoucher = createMaterialTopTabNavigator({
  BuyVouchers: {
    screen: BuyVouchers,
    navigationOptions: {
      title: 'Buy Vouchers'
    }
  },
  MyVouchers: {
    screen: MyVouchers,
    navigationOptions: {
        tabBarIcon: ({focused, tintColor}) =>  {
          return(
            <View style={{flex:1,right:-125}}>
             <VoucherBadge />
            </View>
          ) 
      },
      title: 'My Vouchers'
    }
  }
},
  {
    tabBarOptions: {
      activeTintColor: Constants.DOBO_RED_COLOR,
      inactiveTintColor: Constants.DOBO_GREY_COLOR,
      pressColor: Constants.DOBO_RED_COLOR,
      indicatorStyle: {
        backgroundColor: Constants.DOBO_RED_COLOR,
      },
      showIcon: true,
      showLabel: true,
      tabStyle: {
        flexDirection: 'row',
      },
      style: {
        backgroundColor: 'white'
      }
    },
  });