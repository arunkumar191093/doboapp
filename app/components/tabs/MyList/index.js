import React, { Component } from 'react'
import {
    View, ActivityIndicator, RefreshControl, Alert
} from 'react-native'
import MyListGridComponent from './MyListGridComponent'
import { GetUserList, DeleteUserActions } from '../../../services/UserActions'
import MyListHeader from './MyListHeader'
import { mergeCampaignsAndStoreAds, createShareUserAction, createClickUserAction, shareProduct } from '../../../services/Helper'
import * as Constants from '../../../services/Constants'
import NoDataFound from '../../Common/NoDataFound'
import { DataProvider } from 'recyclerlistview'
import LayoutProvider from './LayoutProvider'
import { GetStoreByStoreAds, GetStoreByProductId } from '../../../services/StoreApi'
import * as likeActions from '../../../actions/like'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import NoNetwork from '../../Common/NoNetwork'
import { EntityType } from '../../../services/ApiConstants'

class MyList extends Component {
    state = {
        myListDataLoaded: false,
        refreshing: false
    }
    myList = []

    async componentDidMount() {
        await this.getUserList()
        this.unsubscribe = this.props.navigation.addListener('didFocus', () => {
            console.log('My List selected')
            this.props.actions.changeLikeShowBadge(false)
        });
    }

    componentWillUnmount() {
        //this.unsubscribe && this.unsubscribe();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdate>>>', this.props.isLikeStateChanged)
        if (this.props.isLikeStateChanged == true) {
            console.log('MyList::Like User Action Has Changed')
            this.props.actions.changeLikeState(false)
            await this.getUserList()
        }
    }

    async getUserList() {
        let response = await GetUserList()
        if (response.status == 200) {
            let userList = response.responseJson
            let jsonUserList = JSON.parse(userList)
            let campaigns = jsonUserList.campaigns;
            let storeAds = jsonUserList.storeAds;
            let products = jsonUserList.products;
            let result = mergeCampaignsAndStoreAds(campaigns, storeAds, products)
            console.log('Result>>>', JSON.stringify(result))
            this.myList = result;
            let dataProvider = new DataProvider((r1, r2) => {
                return r1 !== r2;
            }).cloneWithRows(result);
            let layoutProvider = new LayoutProvider(dataProvider)
            this.setState({ dataProvider: dataProvider, myListDataLoaded: true, layoutProvider: layoutProvider })
        }
        else {

            this.setState({ myListDataLoaded: true })
        }

    }

    giftVoucherClicked = () => {
        this.props.navigation.navigate('GiftVoucherTab')
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Constants.BACKGROUND_COLOR }}>
                <NoNetwork />
                <MyListHeader
                    giftVoucherClicked={this.giftVoucherClicked}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {this.renderMainView()}
                </View>
            </View>
        )
    }

    onRefresh = async () => {
        this.setState({
            refreshing: true
        });
        await this.getUserList();
        this.setState({
            refreshing: false
        });
    }

    renderMainView = () => {
        if (this.state.myListDataLoaded) {
            if (this.myList.length > 0) {
                return (
                    <View style={{ height: '100%', width: '100%' }}>
                        <MyListGridComponent
                            dataProvider={this.state.dataProvider}
                            layoutProvider={this.state.layoutProvider}
                            onShareClickHandler={this.onShareClickHandler}
                            onImageClickHandler={this.onImageClickHandler}
                            onDeleteClickHandler={this.onDeleteClickHandler}
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
                return <NoDataFound message='Your List is waiting for your deal and product likes!!' />
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
                campaignvalue: data.values.campaign,
            });
            entityType = EntityType.Campaign
        } else if (data.type === 'STORE_ITEM') {
            console.log('Data of Image selected STORE_ITEM Id>>', data.values.storeAd.id);
            let response = await GetStoreByStoreAds(data.values.storeAd.id)
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
        else if (data.type === 'PRODUCT_ITEM') {
            console.log('Data of Image selected STORE_ITEM Id>>', data.values.product.id);
            let response = await GetStoreByProductId(data.values.product.id)
            if (response.status === 200) {
                let jsonStoreData = response.responseJson;
                console.log('storeData>>', jsonStoreData)
                if (jsonStoreData != undefined)
                    this.props.navigation.navigate('StorePage', { listVal: jsonStoreData })
            } else {
                Alert.alert('No Store Found')
            }
            entityType = EntityType.FeatureProduct
        }
        let DataId
        if (data.type === 'STORE_ITEM') {
            DataId = data.values.storeAd.id
        }
        else if (data.type === 'PRODUCT_ITEM') {
            DataId = data.values.product.id
        }
        else {
            DataId = data.values.campaign.id
        }
        let response = await createClickUserAction(entityType, DataId)
        console.log('Click UserAction Response>>>', response)

    }

    onDeleteClickHandler = async (data) => {
        console.log('Delete Data>>', data)
        if (data.values.useraction != undefined) {
            let result = await DeleteUserActions(data.values.useraction.id)
            console.log('Delete Result>>', result)
            await this.getUserList()
            this.props.actions.changeLikeState(true)
        }
        this.props.actions.changeLikeState(false)
    }

    onShareClickHandler = async (data) => {
        console.log('MyList Shared Selected data>>>', data)
        let entityType
        let sharedData = 'DOBO APP'
        let isVideo = false
        if (data.type === 'STORE_ITEM') {
            if (data.values.storeAd.mediaType == 0) {
                let replaceUrl = data.values.storeAd.media.replace(/\\/gi, '/')
                sharedData = Constants.baseURL + replaceUrl
            }
            else {
                let replaceUrl = data.values.campaign.media
                sharedData = replaceUrl
                isVideo = true
            }
            entityType = EntityType.Offer
        }
        else if (data.type === 'PRODUCT_ITEM') {
            if (data.values.product.mediaType == 0) {
                let replaceUrl = data.values.product.media.replace(/\\/gi, '/')
                let firstUrl = replaceUrl.split(',')[0];
                let finalUrl = firstUrl && firstUrl.indexOf('http') > -1 ? firstUrl : Constants.baseURL + firstUrl;
                sharedData = finalUrl;
            }
            else {
                let replaceUrl = data.values.campaign.media
                sharedData = replaceUrl
                isVideo = true
            }
            entityType = EntityType.FeatureProduct
        }
        else if (data.type === 'CN_ITEM') {
            if (data.values.campaign.bannerType == 0) {
                sharedData = Constants.baseURL + data.values.campaign.media
            }
            else {
                sharedData = data.values.campaign.media
                isVideo = true
            }
            entityType = EntityType.Campaign
        }

        try {
            let result = await shareProduct(sharedData, isVideo)
            console.log('shared with App ', result.app)
            let DataId
            if (data.type === 'STORE_ITEM') {
                DataId = data.values.storeAd.id
            } else {
                DataId = data.values.campaign.id
            }
            let response = await createShareUserAction(entityType, DataId)
            console.log('Share UserAction Response', response)
        } catch (error) {
            console.log('Could not share', error)
        }
    }
}

const mapStateToProps = state => ({
    isLikeStateChanged: state.like.isStateChanged
});

const ActionCreators = Object.assign(
    {},
    likeActions
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyList)