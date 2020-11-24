import React, { Component } from 'react'
import {
    View, ActivityIndicator, RefreshControl, Alert
} from 'react-native'
import { GetTrend, GetUserList, DeleteUserActions } from '../../../../services/UserActions'
import TrendingGridComponent from './TrendingGridComponent'
import { mergeCampaignsAndStoreAds, likeContent, createShareUserAction, createClickUserAction, shareProduct } from '../../../../services/Helper'
import NoDataFound from '../../../Common/NoDataFound'
import * as Constants from '../../../../services/Constants'
import { EntityType } from '../../../../services/ApiConstants'
import { DataProvider } from 'recyclerlistview'
import LayoutProvider from '../../MyList/LayoutProvider'
import { GetStoreByStoreAds } from '../../../../services/StoreApi'
import NoNetwork from '../../../Common/NoNetwork'
import { connect } from 'react-redux'
import * as likeActions from '../../../../actions/like'
import { bindActionCreators } from 'redux';
import Loader from '../../../Common/Loader'

class TrendingOffers extends Component {
    state = {
        trendingDataLoaded: false,
        refreshing: false,
        loading: false
    }
    trendingList = []

    async componentDidMount() {
        await this.getTrend()
    }

    async getUserList() {
        let response = await GetUserList()
        let campaigns = []
        let storeAds = []
        if (response.status == 200) {
            let userList = response.responseJson
            let jsonUserList = JSON.parse(userList)
            campaigns = jsonUserList.campaigns
            storeAds = jsonUserList.storeAds
        }
        else {
            //TODO Handle the error condition to show some default Error View

        }
        return {
            campaigns: campaigns,
            storeAds: storeAds
        }
    }

    async getTrend() {
        let { campaigns, storeAds } = await this.getUserList()
        let response = await GetTrend()
        if (response.status == 200) {
            let userTrend = response.responseJson
            let jsonUserTrend = JSON.parse(userTrend)
            let trendCampaigns = jsonUserTrend.campaigns;
            let trendStoreAds = jsonUserTrend.storeAds;
            let result = mergeCampaignsAndStoreAds(trendCampaigns, trendStoreAds)
            let userListResult = this.mergeWithUserList(result, campaigns, storeAds)
            this.trendingList = userListResult
            let dataProvider = new DataProvider((r1, r2) => {
                return r1 !== r2;
            }).cloneWithRows(userListResult);
            let layoutProvider = new LayoutProvider(dataProvider)
            console.log('Trend Userlist Result>>', JSON.stringify(userListResult))
            this.setState({ dataProvider: dataProvider, trendingDataLoaded: true, layoutProvider: layoutProvider })

        }
        this.setState({ trendingDataLoaded: true })

    }

    mergeWithUserList(trendList, campaigns, storeAds) {
        trendList.forEach(function (trend, index) {
            if (trend.type == 'CN_ITEM') {
                let foundCampaign = campaigns.find(value => value.campaign.id === trend.values.id)
                if (foundCampaign) {

                    console.log('Trend Campaign included in userlist >>>', trend)
                    trend.values['wishList'] = true
                    trend.values['useraction'] = foundCampaign.useraction
                }
                else {
                    trend.values['wishList'] = false
                }
            }
            else {
                let foundStoreAd = storeAds.find(value => value.storeAd.id === trend.values.id)
                if (foundStoreAd) {

                    console.log('Trend Campaign included in userlist >>>', trend)
                    trend.values['wishList'] = true
                    trend.values['useraction'] = foundStoreAd.useraction
                }
                else {
                    trend.values['wishList'] = false
                }

            }
            this[index] = trend;
        }, trendList);
        return trendList
    }

    onRefresh = async () => {
        this.setState({
            refreshing: true
        });
        await this.getTrend();
        this.setState({
            refreshing: false
        });
    }

    startLoading = () => {
        this.setState({ loading: true })
    }

    stopLoading = () => {
        this.setState({ loading: false })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <NoNetwork />
                <Loader
                    loading={this.state.loading}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {this.renderMainView()}
                </View>
            </View>
        )
    }

    renderMainView = () => {
        if (this.state.trendingDataLoaded) {
            if (this.trendingList.length > 0) {
                return (
                    <View style={{ height: '100%', width: '100%' }}>
                        <TrendingGridComponent
                            dataProvider={this.state.dataProvider}
                            layoutProvider={this.state.layoutProvider}
                            onShareClickHandler={this.onShareClickHandler}
                            onImageClickHandler={this.onImageClickHandler}
                            onWishlistClickHandler={this.onWishlistClickHandler}
                            scrollViewProps={{
                                stickyHeaderIndices: [1],
                                refreshControl:
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this.onRefresh}
                                    />
                            }} />
                    </View>
                )
            }
            else {
                return <NoDataFound message='No Trending Offers' />
            }
        }
        else {
            return (
                <ActivityIndicator
                    size="large"
                    color={Constants.DOBO_RED_COLOR} />
            )
        }
    }

    onImageClickHandler = async (data) => {
        console.log('Data of Image selected store>>', data);
        let entityType
        if (data.type === 'CN_ITEM') {
            this.props.navigation.navigate('StoreByCampaign', {
                campaignvalue: data.values,
            });
            entityType = EntityType.Campaign
        } else if (data.type === 'STORE_ITEM') {
            console.log('Data of Image selected STORE_ITEM Id>>', data.values.id);
            let response = await GetStoreByStoreAds(data.values.id)
            if (response.status === 200) {
                let storeData = response.responseJson;
                let jsonStoreData = JSON.parse(storeData)
                console.log('storeData>>', storeData)
                if (jsonStoreData != undefined)
                    this.props.navigation.navigate('StorePage', { listVal: jsonStoreData })
            } else {
                Alert.alert('No Store Found')
            }
            entityType = EntityType.Offer
        }
        let response = await createClickUserAction(entityType, data.values.id)
        console.log('Click UserAction Response>>>', response)
    };
    onWishlistClickHandler = async (data) => {
        this.startLoading()
        const { actions } = this.props
        console.log('Trend WishlistData>>>', data)
        let entityType
        if (data.type == 'CN_ITEM') {
            entityType = EntityType.Campaign

        }
        else {
            entityType = EntityType.Offer
        }
        console.log('entityType>>>', entityType)
        if (data.values.wishList == false) {
            if (entityType != undefined)
                await likeContent(entityType, data.values)
        }
        else {
            if (data.values.useraction != undefined) {
                let result = await DeleteUserActions(data.values.useraction.id)
                console.log('Delete Result>>', result)
            }
        }
        actions.changeLikeState(true)
        actions.changeLikeShowBadge(true)
        await this.getTrend()
        this.stopLoading()

    }

    onShareClickHandler = async (data) => {
        console.log("Trending Page ITEM_Share>>>>", data)
        let entityType
        let sharedData = 'DOBO APP'
        let isVideo = false;
        if (data.type === 'STORE_ITEM') {
            if (data.values.mediaType == 0) {
                let replaceUrl = data.values.media.replace(/\\/gi, '/')
                sharedData = Constants.baseURL + replaceUrl
            }
            else {
                let replaceUrl = data.values.media
                sharedData = replaceUrl
                isVideo = true
            }
            entityType = EntityType.Offer
        }
        else if (data.type === 'CN_ITEM') {
            if (data.values.bannerType == 0) {
                let replaceUrl = data.values.media.replace(/\\/gi, '/')
                sharedData = Constants.baseURL + replaceUrl
            }
            else {
                let replaceUrl = data.values.media
                sharedData = replaceUrl
                isVideo = true
            }
            entityType = EntityType.Campaign
        }

        try {
            let result = await shareProduct(sharedData, isVideo)
            console.log('shared with App ', result.app)
            let response = await createShareUserAction(entityType, data.values.id)
            console.log('Share UserAction Response', response)
        } catch (error) {
            console.error('Could not share', error)
        }
    }
}


const ActionCreators = Object.assign(
    {},
    likeActions
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(TrendingOffers)