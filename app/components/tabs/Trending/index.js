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
import { ImageConst } from '../../../services/ImageConstants';
import IconComponent from '../../Common/IconComponent';

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
            tabBarIcon: ({ tintColor, focused }) => (
                <IconComponent size={25} name={focused ? ImageConst['trending-active'] : ImageConst['trending-default']} />
            )
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
            labelStyle: {
                fontFamily: Constants.LIST_FONT_FAMILY,
                textAlign: 'center'
            },
            tabStyle: {
                flexDirection: 'row',
                justifyContent: 'center',
                textAlign: 'center'
            },
            style: {
                backgroundColor: 'white',
                justifyContent: 'center',
                textAlign: 'center'
            },
        },
        lazy: true
    }
);