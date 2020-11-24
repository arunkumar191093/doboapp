import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    AppState,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import HomeHeder from './HomeHeader';
import * as Constants from '../../../services/Constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CategoryListComponent from './CategoryListComponent'
import Loader from '../../Common/Loader';
import { getCampaigns } from '../../../services/Campaigns'
import { getCategories } from '../../../services/Categories'
import ImageCard from '../../Common/ImageCard';
import YoutubeWebView from '../../Common/YoutubeWebView';
import { GetStoresUsingGPS, GetStoresByFilter, Storecheckins } from '../../../services/StoreApi';
import { getLocation, geocodeLocationByCoords, hasLocationPermission } from '../../../services/LocationServices';
import StoreListComponent from '../../Common/StoreListComponent';
import { connect } from 'react-redux';
import * as locationActions from '../../../actions/location';
import * as likeActions from '../../../actions/like'
import * as notificationAction from '../../../actions/notification'
import { bindActionCreators } from 'redux';
import { GetUserList, DeleteUserActions } from '../../../services/UserActions';
import {
    likeContent,
    createShareUserAction,
    createClickUserAction,
    createViewUserAction,
    shareProduct,
    checkForCheckinValidity,
    removeStoreFromStorage
} from '../../../services/Helper';
import { EntityType } from '../../../services/ApiConstants';
import NoNetwork from '../../Common/NoNetwork';
import IconComponent from '../../Common/IconComponent';
import { ImageConst } from '../../../services/ImageConstants';
import AutoPlayCarousel from '../../Common/AutoPlayCarousel';
import { PostUserLocation } from '../../../services/Api';
import LocationDeny from '../../Common/LocationDeny';
import Filter from '../../Filter';
import { filterOptions } from '../../Filter/FilterValue';
import Geolocation from 'react-native-geolocation-service';
import { GetReferralDetails } from '../../../services/ProfileListApi';
import Global from '../../../services/Global'
import ModalPopUp from '../../Common/ModalPopUp';
import RatingsPage from '../../Common/RatingsPage';
import ThanksPage from '../../Common/ThanksPage';
import { NavigationEvents } from 'react-navigation';

class Home extends Component {

    watchId = null;
    static navigationOptions = {
        header: null,
    }
    viewedCampaingns = []
    state = {
        storeList: [],
        isFabButtonClicked: false,
        loading: true,
        campaigns: [],
        categories: [],
        isFilterModalVisible: false,
        locationPermissionDeny: false,
        carouselLoader: false,
        campaignsLoaded: false,
        appState: AppState.currentState,
        showRating: false,
        showThanks: false,
        canCloseRating: true,
        isStoreCheckin: false,
        checkinDetails: {}
        //filterOptions: filterOptions
    };



    constructor() {
        super()
        this.filterOptions = JSON.parse(JSON.stringify(filterOptions));
        this.onFabClickHandler = this.onFabClickHandler.bind(this);
        this.onFabExpandClickHandler = this.onFabExpandClickHandler.bind(this);
        this.onFabArrowClickHandler = this.onFabArrowClickHandler.bind(this);
        this.onGiftVoucherClicked = this.onGiftVoucherClicked.bind(this);
        this.onLocationEdit = this.onLocationEdit.bind(this);
        this.currentListItemClick = this.currentListItemClick.bind(this);
        this.onCategoryClickHandler = this.onCategoryClickHandler.bind(this);
        this.onFilterClickHandler = this.onFilterClickHandler.bind(this);
        this.expiredStoreDetails = {};
        this.isStoreCheckin = false;

    }


    async componentDidMount() {
        //await requestLocationPermission();
        await this.getUserLocation()
        this.getLocationUpdates()
        this.startLoading()
        await this.getCampaigns();
        await this.getCategories();
        await this.getStoresList()
        await this.callGetReferralDetails()
        this.stopLoading()

        AppState.addEventListener('change', this.handleAppStateChange);
        //check for stores to checkout when opening the application
        this.checkForCheckout();

    }

    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === "active") {
            console.log("App has come to the foreground!");
            //check for stores to checkout when app comes to foreground
            this.checkForCheckout();
        }
        this.setState({ appState: nextAppState });
    }

    checkForCheckout = async () => {
        let storesData = await checkForCheckinValidity();
        console.log('expired stores', storesData.expired);
        this.setState({
            isStoreCheckin: false
        })
        if (storesData.checkedIn.length) {
            this.setState({
                isStoreCheckin: true,
                isFabButtonClicked: true
            })
        }
        if (storesData.expired.length) {
            // show rating only for the last store that checked out
            this.expiredStoreDetails = storesData.expired[0];
            this.checkoutStoreAPI();
        }
    }

    checkoutStoreAPI = async () => {
        let dataFromStorage = await AsyncStorage.getItem('storeCheckInData') || {};
        const { id, storeId, checkInTime } = JSON.parse(dataFromStorage);
        let data = { "id": id, "StoreId": storeId, "checkInTime": checkInTime, "checkOutTime": new Date() }
        let checkoutResponse = await Storecheckins(data, id);
        if (checkoutResponse.status == 200) {
            this.setState({
                checkinDetails: JSON.parse(dataFromStorage),
                isStoreCheckin: false,
                canCloseRating: true,
                showRating: true
            })
        }
    }

    checkNotificationRoute = () => {
        let { notificationRoute, actions, navigation } = this.props;
        if (notificationRoute == 'voucher') {
            navigation.navigate('MyVouchers')
            actions.updateNotificationRoute('Home')
        }
        else if (notificationRoute == 'mylist') {
            navigation.navigate('MyList')
            actions.updateNotificationRoute('Home')
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.coordinates !== this.props.coordinates) {
            console.log('Home::Coordinates Has Changed')
            await this.getStoresList()
        }
        if (this.props.isLikeStateChanged == true) {
            console.log('HomePage::Like User Action Has Changed')
            this.props.actions.changeLikeState(false)
            await this.getCampaigns()
        }
    }

    componentWillUnmount() {
        this.removeLocationUpdates();
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    callGetReferralDetails = async () => {
        let response = await GetReferralDetails();
        if (response.status == 200) {
            let referalData = response.responseJson;
            console.log('callGetReferralDetails>>>', referalData)
            //this.setState({ referalDetails: JSON.parse(referalData) });
            let jsonReferalData = JSON.parse(referalData)
            Global.referral_Code = jsonReferalData.referral_Code

        } else {

        }
    }

    getLocationUpdates = async () => {
        const hasPermission = await hasLocationPermission();

        if (!hasPermission) return;

        this.watchId = Geolocation.watchPosition(
            (position) => {
                console.log('Position from watch', position.coords);
                this.sendUserLocation(position.coords)
            },
            (error) => {
                console.log(error);
            },
            { enableHighAccuracy: true, distanceFilter: Constants.DISTANCE_FILTER_MTR, interval: Constants.LOCATION_INTERVAL, fastestInterval: Constants.LOCATION_INTERVAL }
        );
    }

    removeLocationUpdates = () => {
        if (this.watchId !== null) {
            Geolocation.clearWatch(this.watchId);
        }
    }

    sendUserLocation = async (coords) => {
        let lat = parseFloat(coords.latitude)
        let long = parseFloat(coords.longitude)
        console.log('User current position is:');
        console.log(`Latitude : ${lat}`);
        console.log(`Longitude: ${long}`);
        console.log(`More or less ${coords.accuracy} meters.`);
        if (isNaN(lat) || isNaN(long))
            return
        let initialRegion = {
            latitude: lat,
            longitude: long
        }
        let response = await PostUserLocation(initialRegion);
        if (response.status === 201) {
            console.log('User Location Posted Successfully')
        }
    }

    getUserLocation = async () => {
        console.log('Home::getUserLocation()')
        try {
            let coords = await getLocation()
            console.log('coords>>>>', coords)
            this.setState({ locationPermissionDeny: false })
            //TODO: remove hardcoded data
            //domlur
            // var lat = 12.9599062 //parseFloat(coords.latitude)
            // var long = 77.64154429999999 //parseFloat(coords.longitude)
            //yashwantpur
            var lat = 13.0250302 //parseFloat(coords.latitude) //13.0250302
            var long = 77.53402419999999 //parseFloat(coords.longitude) //77.53402419999999
            console.log('Your current position is:');
            console.log(`Latitude : ${lat}`);
            console.log(`Longitude: ${long}`);
            console.log(`More or less ${coords.accuracy} meters.`);
            let initialRegion = {
                latitude: lat,
                longitude: long
            }
            this.sendUserLocation(coords)
            this.getUserLocationName(initialRegion)
        } catch (error) {
            // if (error.PERMISSION_DENIED == 1) {
            //     // console.log('locationPermissionDeny', error)
            //     // Alert.alert('pradeep')
            //     this.setState({ locationPermissionDeny: true })
            // }
            // Alert.alert(error.message)
            console.log('locationPermissionDeny', error)
            this.setState({ locationPermissionDeny: true })
        };

    }

    getUserLocationName(crd) {
        let { actions } = this.props;
        let lat = parseFloat(crd.latitude)
        let long = parseFloat(crd.longitude)
        let address = {
            shortAddress: '',
            longAddress: '',
            coordinates: crd
        }
        let currentAddress = {
            currentUserAddress: '',
            currentUserCoordinates: crd
        }
        geocodeLocationByCoords(lat, long).then(
            (data) => {
                if (data.shortAddress !== undefined) {
                    address.shortAddress = data.shortAddress
                }
                if (data.longAddress !== undefined) {
                    address.longAddress = data.longAddress
                    currentAddress.currentUserAddress = data.longAddress
                }
                actions.changeLocation(address);
                actions.changeCurrentLocation(currentAddress)
            }).catch(error => console.warn(error))
    };

    onWishlistClickHandler = async (data) => {
        this.startCarouselLoading()
        console.log('heart pressed', data)
        let { actions } = this.props;
        if (data.wishList == false) {
            await likeContent(EntityType.Campaign, data)
        }
        else {
            if (data.useraction != undefined) {
                let result = await DeleteUserActions(data.useraction.id)
                console.log('Delete Result>>', result)
            }
        }
        actions.changeLikeState(true)
        actions.changeLikeShowBadge(true)
        await this.getCampaigns()
        this.stopCarouselLoading()
    }

    onShareClickHandler = async (data) => {
        console.log('Share pressed Home', data)
        let sharedData = 'DOBO APP'
        let isVideo = false;
        console.log('Data Banner Type>>', data.bannerType)
        if (data != undefined) {
            if (data.bannerType == 0) {
                let replaceUrl = data.media.replace(/\\/gi, '/')
                sharedData = Constants.baseURL + replaceUrl
            }
            else {
                sharedData = data.media
                isVideo = true;
            }

            try {
                let result = await shareProduct(sharedData, isVideo)
                console.log('shared with App ', result.app)
                let response = await createShareUserAction(EntityType.Campaign, data.id)
                console.log('Share UserAction Response', response)
            } catch (error) {
                console.error('Could not share', error)
            }
        }

    }

    onImageClickHandler = async (data) => {
        console.log('Campaign Clicked Data>>>', data)
        let response = await createClickUserAction(EntityType.Campaign, data.id)
        console.log('Click UserAction Response>>>', response)
        //Navigate to Campaign Retailers Page here by using Campaign Id.
        this.props.navigation.navigate('StoreByCampaign', { campaignvalue: data });
    }

    onFabClickHandler = () => {
        this.setState({ isFabButtonClicked: true })

    }
    onFabExpandClickHandler = () => {

        this.setState({ isFabButtonClicked: false })
        const { navigation } = this.props
        navigation.navigate('HomeCheckinQR')
    }
    onFabArrowClickHandler = () => {
        this.setState({ isFabButtonClicked: false });
    }
    currentListItemClick = (item) => {
        this.props.navigation.navigate('StorePage', { listVal: item.store })
    }

    onCategoryClickHandler = (item) => {
        this.props.navigation.navigate('StoreCategory', { value: item });
    }
    onFilterClickHandler = () => {
        this.setState({ isFilterModalVisible: !this.state.isFilterModalVisible })

    }

    onApplyFilter = async (data) => {
        console.log('Filter Options Applied>', JSON.stringify(data))
        this.filterOptions = data
        //this.setState({ filterOptions: data })
        await this.getStoresByFliter(data)

    }

    onClearFilter = async (data) => {
        this.filterOptions = data
        //this.setState({ filterOptions: data })
        await this.getStoresList(data)
    }

    getStoresByFliter = async (filterData) => {
        const { coordinates } = this.props
        let body = {
            "Latitude": coordinates.latitude,
            "Longitude": coordinates.longitude,
            "Distance": 35000,
            "SortBy": "Nearby",
            "Categories": [],
            "Brands": []
        }
        filterData.forEach(element => {
            if (element.value === 'Categories') {
                element.details.forEach(element => {
                    if (element.checked === true) {
                        body.Categories.push({ id: element.id })
                    }
                });

            }
            else if (element.value === 'Brands') {
                element.details.forEach(element => {
                    if (element.checked === true) {
                        body.Brands.push({ id: element.id })
                    }
                });
            }
        });

        console.log('Filter Body>>>', body)
        let response = await GetStoresByFilter(body)
        if (response.status == 200) {
            let storeListData = response.responseJson
            //Important step to convert to object or else it crashes
            let jsonStroreList = JSON.parse(storeListData)
            this.setState({ storeList: jsonStroreList })
        }
        else {
            this.setState({ storeList: [] })
        }

    }
    openModal = () => {
        if (this.state.isFilterModalVisible) {
            console.log('Filter Options State', JSON.stringify(this.filterOptions))
            return (

                <Filter
                    onModalClose={() => this.setState({ isFilterModalVisible: false })}
                    onApplyFilter={this.onApplyFilter}
                    onClearFilter={this.onClearFilter}
                    filterOptions={this.filterOptions}

                />

            );
        } else {
            return (null);
        }
    }

    async getUserListCampaigns() {
        let response = await GetUserList()
        let campaigns = []
        if (response.status == 200) {
            let userList = response.responseJson
            let jsonUserList = JSON.parse(userList)
            campaigns = jsonUserList.campaigns;
        }
        else {
            //TODO Handle the error condition to show some default Error View

        }
        return campaigns
    }

    async getCampaigns() {
        let userListCampaigns = await this.getUserListCampaigns()
        console.log('userListCampaigns>>', userListCampaigns)
        let response = await getCampaigns();
        if (response.status == 200) {
            //this.setState({ campaigns: response.responseJson });
            let campaigns = response.responseJson;
            let jsonCampaigns = JSON.parse(campaigns)
            //jsonCampaigns = []
            jsonCampaigns.forEach((image, index) => {
                console.log('Campaign ID', image.id)
                let foundCampaign = userListCampaigns.find(value => value.campaign.id === image.id)
                if (foundCampaign) {

                    console.log('Campaign included in userlist >>>', image)
                    image['wishList'] = true
                    image['useraction'] = foundCampaign.useraction
                }
                else {
                    image['wishList'] = false
                }
                //console.log('Image json>>>', image)
                this[index] = image;

            }, jsonCampaigns);
            this.setState({ campaigns: jsonCampaigns, campaignsLoaded: true })

        }
        else {
            //TODO Handle the error condition to show some default Error View
            this.setState({ campaignsLoaded: true })
        }
    }



    async getCategories() {
        //this.startLoading();
        let response = await getCategories();
        if (response.status == 200) {
            let jsonCategories = JSON.parse(response.responseJson)
            this.setState({ categories: jsonCategories });

        }
        else {
            //this.stopLoading()
        }
        //this.stopLoading();
    }

    async getStoresList() {

        const { coordinates } = this.props
        let body = {
            "Latitude": coordinates.latitude,
            "Longitude": coordinates.longitude,
            "Distance": 35000
        }
        let response = await GetStoresUsingGPS(body)
        if (response.status == 200) {
            let storeListData = response.responseJson
            //Important step to convert to object or else it crashes
            let jsonStroreList = JSON.parse(storeListData)
            this.setState({ storeList: jsonStroreList })
        }
        else {
            this.setState({ storeList: [] })
        }

    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false })
    }

    showcolapsableView = () => {

        if (this.state.isFabButtonClicked) {
            return (
                <View style={{ position: "absolute", top: Constants.STORE_CHECKIN_BUTTON_POSITION, right: -10 }}>

                    <View style={styles.fabExpandButton}>
                        <TouchableOpacity onPress={this.onFabArrowClickHandler}>
                            <MaterialCommunityIcons name='qrcode-scan' size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onFabExpandClickHandler} style={{ justifyContent: 'center' }}>
                            <Text style={{ color: "white", marginLeft: '5%', fontFamily: Constants.LIST_FONT_FAMILY }}>STORE CHECK-IN</Text>
                        </TouchableOpacity>
                    </View >

                </View >
            );
        } else {
            return (
                <View style={{ position: "absolute", top: Constants.STORE_CHECKIN_BUTTON_POSITION, right: -5 }}>

                    <View style={styles.fabButton}>
                        <TouchableOpacity onPress={this.onFabClickHandler}>
                            <MaterialCommunityIcons name='qrcode-scan' size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                </View>
            );
        }
    }

    showCheckout() {
        return (
            this.state.isFabButtonClicked ? (
                <View style={{ position: "absolute", top: Constants.STORE_CHECKIN_BUTTON_POSITION, right: -10 }}>

                    <View style={styles.fabExpandButton}>
                        <TouchableOpacity onPress={this.onFabArrowClickHandler}>
                            <MaterialCommunityIcons name='logout' size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.checkout(true)} style={{ justifyContent: 'center' }}>
                            <Text style={{ color: "white", marginLeft: '5%', fontFamily: Constants.LIST_FONT_FAMILY }}>STORE CHECK-OUT</Text>
                        </TouchableOpacity>
                    </View >

                </View >
            ) :
                (
                    <View style={{ position: "absolute", top: Constants.STORE_CHECKIN_BUTTON_POSITION, right: -5 }}>

                        <View style={styles.fabButton}>
                            <TouchableOpacity onPress={this.onFabClickHandler}>
                                <MaterialCommunityIcons name='logout' size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                    </View>
                )
        )
    }

    onGiftVoucherClicked() {
        this.props.navigation.navigate('GiftVoucherTab')
    }
    onLocationEdit() {

        console.log('Edit Location Selected')
        this.props.navigation.navigate('LocationEditView')
    }

    renderCarouselItem = ({ item, index }) => {

        if (item.bannerType === 0) {
            return (
                <ImageCard
                    key={index}
                    mediaUrl={Constants.imageResBaseUrl + item.media}
                    data={item}
                    onWishlistClickHandler={(data) => this.onWishlistClickHandler(data)}
                    onShareClickHandler={(data) => this.onShareClickHandler(data)}
                    onImageClickHandler={(data) => this.onImageClickHandler(data)}
                />
            )
        }
        else {
            return (
                <YoutubeWebView
                    key={index}
                    mediaUrl={item.media}
                    data={item}
                    onWishlistClickHandler={(data) => this.onWishlistClickHandler(data)}
                    onShareClickHandler={(data) => this.onShareClickHandler(data)}
                    onImageClickHandler={(data) => this.onImageClickHandler(data)}
                />
            )
        }
    }

    startCarouselLoading = () => {
        this.setState({ carouselLoader: true })
    }

    stopCarouselLoading = () => {
        this.setState({ carouselLoader: false })
    }

    onSnapToItem = (index) => {
        //console.log('Item Index:', this.state.campaigns[index])
        let campaignId = this.state.campaigns[index].id
        //console.log('Snap Camapaign ID', campaignId)
        if (!this.viewedCampaingns.includes(campaignId)) {
            //Adding the viewed campaigns to a stack to avoid Posting view again.
            this.viewedCampaingns.push(campaignId)
            console.log('Calling create View UserAction')
            createViewUserAction(EntityType.Campaign, campaignId)
        }

    }

    handleRatingSubmit = () => {
        removeStoreFromStorage(this.expiredStoreDetails.storeId);
        // this.onRatingModalClose();
        this.setState({
            showRating: false,
            showThanks: true
        })
    }

    onRatingModalClose = async () => {
        //remove expired store from storage if rating pop up is closed by user
        // if user submits rating
        removeStoreFromStorage(this.expiredStoreDetails.storeId);
        await AsyncStorage.removeItem('storeCheckInData');
        this.setState({
            canCloseRating: true,
            showRating: false,
            showThanks: false
        });
        // this.props.navigation.navigate('Home');
    }

    renderRating() {
        return (
            <ModalPopUp canClose={this.state.canCloseRating} onClose={this.onRatingModalClose} closeIcon="close">
                <RatingsPage storeDetails={this.expiredStoreDetails} checkinDetails={this.state.checkinDetails} onRatingSubmit={this.handleRatingSubmit} />
            </ModalPopUp>
        )
    }

    renderThanks() {
        return (
            <ModalPopUp canClose={true} onClose={this.onRatingModalClose} >
                <ThanksPage storeDetails={this.expiredStoreDetails} />
            </ModalPopUp>
        )
    }

    checkout = async (isManual) => {
        console.log('store checkout from home')
        let storesData = await checkForCheckinValidity();
        if (isManual) {
            Alert.alert(
                'Checkout',
                'Are you sure you want to checkout?',
                [
                    {
                        text: 'Yes', onPress: () => {
                            if (storesData.checkedIn.length) {
                                this.expiredStoreDetails = storesData.checkedIn[storesData.checkedIn.length - 1];
                                this.setState({
                                    isStoreCheckin: false
                                })
                                this.setState({
                                    canCloseRating: false,
                                    showRating: true,
                                    isFabButtonClicked: false
                                })
                            }
                        }
                    },
                    { text: 'No', onPress: () => { } }
                ],
                { cancelable: true });
        }
        else {
            if (storesData.checkedIn.length) {
                this.expiredStoreDetails = storesData.checkedIn[storesData.checkedIn.length - 1];
                this.setState({
                    isStoreCheckin: false
                })
                this.setState({
                    canCloseRating: false,
                    showRating: true,
                    isFabButtonClicked: false
                })
            }
        }

    }

    onPageFocus = () => {
        console.log('home page focused');
        this.checkForCheckout();
    }

    render() {
        const { shortAddress } = this.props;
        this.checkNotificationRoute()
        console.log('this.state.locationPermissionDeny render', this.state.locationPermissionDeny)
        return (
            <View style={styles.container}>
                <NoNetwork />
                <LocationDeny
                    visible={this.state.locationPermissionDeny}
                    onAllowLocationPress={this.getUserLocation} />
                <Loader
                    transparent={false}
                    loading={this.state.loading}
                />
                <NavigationEvents
                    onDidFocus={() => this.onPageFocus()}
                />
                <View style={{
                    height: Constants.TOP_HEADER_HEIGHT,
                    width: Constants.SCREEN_WIDTH
                }}>
                    <HomeHeder
                        giftVoucherClicked={this.onGiftVoucherClicked}
                        onLocationEdit={this.onLocationEdit}
                        locationName={shortAddress}
                    />
                </View>
                <View
                    pointerEvents={this.state.carouselLoader ? 'none' : 'auto'}
                    style={styles.pager}>
                    <AutoPlayCarousel
                        children={this.state.campaigns}
                        renderItem={this.renderCarouselItem}
                        height={Constants.BANNER_HEIGHT}
                        autoplay={true}
                        //loading={this.state.carouselLoader}
                        isDataLoaded={this.state.campaignsLoaded}
                        onSnapToItem={this.onSnapToItem}
                    />
                    {this.state.carouselLoader &&
                        <View style={styles.overlay}>
                            <ActivityIndicator size='large'
                                color={Constants.DOBO_RED_COLOR} />
                        </View>
                    }
                </View>
                <View style={{ ...styles.category, height: '16%' }}>
                    <View style={{ flex: 4, paddingBottom: 4, paddingTop: 8, marginLeft: 4 }}>
                        <CategoryListComponent
                            data={this.state.categories}
                            onCategoryClick={(item) => this.onCategoryClickHandler(item)}>

                        </CategoryListComponent>
                    </View>
                    <View style={{ flexDirection: 'row-reverse', flex: 0.7 }}>
                        <View style={{ ...styles.filterView }}>
                            <TouchableOpacity onPress={this.onFilterClickHandler}>
                                <IconComponent
                                    name={ImageConst['category-filter']}
                                    size={30}
                                    style={styles.categoryImage} />
                                <Text style={{
                                    fontFamily: Constants.LIST_FONT_FAMILY,
                                    color: Constants.DOBO_GREY_COLOR
                                }}>Filter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <StoreListComponent data={this.state.storeList}
                    onCurrentItemClick={(item) => this.currentListItemClick(item)}
                />
                {!this.state.isStoreCheckin ? this.showcolapsableView() : this.showCheckout()}
                {this.openModal()}
                {this.state.showRating ? this.renderRating() : null}
                {this.state.showThanks ? this.renderThanks() : null}
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    pager: {
        //marginTop: Constants.TOP_HEADER_HEIGHT,
    },
    category: {
        flexDirection: "row",
        //width: '100%',
        // backgroundColor: Constants.BACKGROUND_COLOR
    },
    categoryImage: {
        marginBottom: 5
    },
    filterView: {
        //marginVertical: 10,
        //position: "absolute",
        //right: 10,
        justifyContent: 'center',
        // alignSelf: 'center',
        // alignContent: 'center',
        // alignItems: 'center',
        marginEnd: '10%',
        //marginStart: '5%'
    },
    fabButton: {
        borderRadius: 35,
        marginRight: -20,
        padding: 12,
        paddingRight: 40,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: Constants.DOBO_RED_COLOR,
        overflow: 'hidden'
    },
    fabExpandButton: {
        flexDirection: "row",
        borderRadius: 35,
        marginRight: -20,
        padding: 12,
        paddingRight: 40,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: Constants.DOBO_RED_COLOR,
        overflow: 'hidden'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = state => ({
    shortAddress: state.location.shortAddress,
    longAddress: state.location.longAddress,
    coordinates: state.location.coordinates,
    currentUserAddress: state.location.currentUserAddress,
    currentUserCoordinates: state.location.currentUserCoordinates,
    isLikeStateChanged: state.like.isStateChanged,
    notificationRoute: state.route.routeName
});

const ActionCreators = Object.assign(
    {},
    locationActions,
    likeActions,
    notificationAction
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home)
//export default Home