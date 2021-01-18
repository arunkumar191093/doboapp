import React from 'react'
import HomeStack from './HomeStack';
import { Trending } from '../components/tabs/Trending';
import { NearMeStack } from './NearMeStack';
import { MyListStack } from './MyListStack';
import { ProfileStack } from './ProfileStack';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import * as Constants from '../services/Constants'
import IconWithBadge from '../components/tabs/MyList/IconWithBadge';
import { ImageConst } from '../services/ImageConstants';
import IconComponent from '../components/Common/IconComponent';
import { StackActions, NavigationActions } from 'react-navigation';

const TabBarComponent = props => <BottomTabBar {...props} />;

export const MainTabs = createBottomTabNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            tabBarLabel: 'HOME',
            tabBarIcon: ({ focused }) => (
                <IconComponent size={25} name={focused ? ImageConst['home-active'] : ImageConst['home-default']} />
            )
        },
    },
    Trending: {
        screen: Trending,
        navigationOptions: {
            tabBarLabel: 'TRENDING',
            tabBarIcon: ({ focused }) => (
                <IconComponent size={25} name={focused ? ImageConst['trending-active'] : ImageConst['trending-default']} />
            )
        },
    },
    NearMe: {
        screen: NearMeStack,
        navigationOptions: {
            tabBarLabel: 'NEAR ME',
            tabBarIcon: ({ focused }) => (
                <IconComponent size={25} name={focused ? ImageConst['near-me-active'] : ImageConst['near-me-default']} />
            )
        },
    },
    MyList: {
        screen: MyListStack,
        navigationOptions: {
            tabBarLabel: 'MY LIST',
            tabBarIcon: ({ focused }) => (
                <IconWithBadge size={25} name={focused ? ImageConst['my-list-active'] : ImageConst['my-list-default']} />
            )

        },
    },
    Profile: {
        screen: ProfileStack,
        navigationOptions: {
            tabBarLabel: 'PROFILE',
            tabBarIcon: ({ focused }) => (
                <IconComponent size={25} name={focused ? ImageConst['profile-active'] : ImageConst['profile-default']} />
            )
        },
    },
},
    {
        initialRouteName: "Home",
        tabBarOptions: {
            activeTintColor: Constants.DOBO_RED_COLOR,
            style: { height: Constants.BOTTOM_TAB_HEIGHT },
            labelStyle: {
                fontFamily: Constants.LIST_FONT_FAMILY
            }
            //activeBackgroundColor: '#F64658'
        },
        tabBarComponent: props => (
            <TabBarComponent {...props} />
        ),
        //commenting below code because it was breaking in some cases, this code is for resetting stack to first value
        // defaultNavigationOptions:{
        //     tabBarOnPress: ({ navigation, defaultHandler }) => {
        //       defaultHandler(); // Switch tab
        //       if (navigation.state.index > 0) { // In case the stack is not positioned at the first screen
        //         const resetAction = StackActions.reset({ // Reset the stack
        //           index: 0,
        //           actions: [
        //             NavigationActions.navigate({ routeName: navigation.state.routes[0].routeName })
        //           ],
        //         });
        //         navigation.dispatch(resetAction);
        //       }
        //     },
        // }
    },
);