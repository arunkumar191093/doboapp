import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import DoboTV from './DoboTV';
import DoboVideoPlayer from './DoboTV/DoboVideoPlayer';
import { createStackNavigator } from 'react-navigation-stack';
import { Icon } from 'react-native-elements';
import React from 'react'
import TrendingOffers from './TrendingOffers';
import DoboCategoryFilter from './DoboTV/DoboCategoryFilter';
import StorePage from '../../StorePage/StorePage';
import StoreByCampaign from '../../StoreByCampaign';
import * as Constants from '../../../services/Constants'
import StorePageDetails from '../../StorePage/StorePageDetails';

const TrendingOffersStack = createStackNavigator(
    {
        TrendingOffers: TrendingOffers,
        StoreByCampaign: StoreByCampaign,
        StorePage: StorePage,
        StorePageDetails: {
            screen: StorePageDetails,
        }
    },
    {
        headerMode: 'none',
        navigationOptions: {
            header: false,
        },
    },
);


const DoboTVStack = createStackNavigator(
    {
        DoboTV: DoboTV,
        DoboCategoryFilter: DoboCategoryFilter,
        DoboVideoPlayer: DoboVideoPlayer
    },
    {
        headerMode: 'none',
        navigationOptions: {
            header: false,
            tabBarIcon: ({ tintColor, focused }) => (
                <Icon
                    name={focused ? 'tv' : 'tv'}
                    type='font-awesome'
                    color={tintColor}
                    size={20}
                />
            )
        }
    }
);

export const Trending = createMaterialTopTabNavigator(
    {
        'Trending Offers': TrendingOffersStack,
        'Dobo TV': DoboTVStack
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
            },
        },
        lazy: true
    }
);