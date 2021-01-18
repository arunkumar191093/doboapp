import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Linking,
    Image,
    Modal,
    Platform,
    Animated,
    Alert
} from 'react-native';
import * as Constants from '../../services/Constants'
import { Icon, Divider, Button } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GridComponent from './GridComponent'
import { GetStoreBanners, GetStorePageDetails, Storecheckins, GetStoresProductsByFilter } from '../../services/StoreApi';
import { likeContent, GetDistance, createShareUserAction, createClickUserAction, shareProduct, checkForCheckinValidity, removeStoreFromStorage, callNumber } from '../../services/Helper';
import StoreBannerImageCard from './StoreBannerImageCard';
import StoreBannerVideoCard from './StoreBannerVideoCard';
import { GetUserList, DeleteUserActions } from '../../services/UserActions';
import { EntityType, StoreEntityType } from '../../services/ApiConstants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as likeActions from '../../actions/like'
import NoNetwork from '../Common/NoNetwork';
import moment from 'moment';
import AutoPlayCarousel from '../Common/AutoPlayCarousel';
import Loader from '../Common/Loader';
import * as loadingActions from '../../actions/isLoading'
import ModalPopUp from '../Common/ModalPopUp';
import RatingsPage from '../Common/RatingsPage';
import ThanksPage from '../Common/ThanksPage';
import IconComponent from '../Common/IconComponent';
import { ImageConst } from '../../services/ImageConstants';
import CartBag from '../Common/CartBag';
import NavHeader from '../Common/NavHeader';
import { getAllProductByStoreId } from '../../services/StoreBag';
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import Filter from '../Filter';
import { productFilterOptions } from '../Filter/FilterValue';
import { getCategoriesForFilterForStore } from '../../services/Categories';

const DEFAULT_TIMER = 29 // total minutes - 1

class StorePage extends Component {
    storeDetails = {};
    imageUrl = '';
    isStoreCheckin = false
    state = {
        isModalVisible: false,
        isFabButtonClicked: false,
        storeAdsData: [],
        storeBanners: [],
        isStoreAdsAvailable: false,
        exclusiveDealsCount: 0,
        totalDeals: 0,
        value: '',
        carouselLoader: false,
        storeBannerLoaded: false,
        loading: false,
        isTimerOn: false,
        minutes: DEFAULT_TIMER,
        seconds: 59,
        checkoutFabClicked: true,
        showRating: false,
        showThanks: false,
        showHeaderName: false,
        cartCount: 0,
        bagId: 0,
        isStoreCheckin: false,
        checkinDetails: {},
        isFilterModalVisible: false,
        categories: []
    };
    constructor(props) {
        super(props);
        this.filterOptions = productFilterOptions;
        this.onFabClickHandler = this.onFabClickHandler.bind(this);
        this.onFabArrowClickHandler = this.onFabArrowClickHandler.bind(this);
        this.onCloseClickHandler = this.onCloseClickHandler.bind(this);
        this.onWishlistClickHandler = this.onWishlistClickHandler.bind(this);
        this.onShareClickHandler = this.onShareClickHandler.bind(this);
        this.onListScrollHandler = this.onListScrollHandler.bind(this);
        this.onOpenMapHandler = this.onOpenMapHandler.bind(this);
        this.onFabExpandClickHandler = this.onFabExpandClickHandler.bind(this);
        this.checkout = this.checkout.bind(this);
        this.renderRating = this.renderRating.bind(this);
        this.handleRatingSubmit = this.handleRatingSubmit.bind(this);
        this.onRatingModalClose = this.onRatingModalClose.bind(this);
        this.storeDetails = props.navigation.getParam('listVal');
        console.log('this.storeDetails', this.storeDetails)
        let isStoreCheckin = props.navigation.getParam('isStoreCheckin')
        this.isStoreCheckin = isStoreCheckin ? isStoreCheckin : false;
        this.setState({ isStoreCheckin: this.isStoreCheckin });
        this.scrollY = new Animated.Value(0);
        this.headerHeight = this.scrollY.interpolate({
            inputRange: [0, 270],
            outputRange: [0, -(Constants.BANNER_HEIGHT + 14)],
            extrapolate: 'clamp',
        });
        this.counter = null;
        this.headerScrolled = false;
        this.expiredStoreDetails = null;
    }

    componentDidMount() {
        console.log('component mounted in store page')
        //this.getStoreAds()
        // this.isStoreCheckin ? this.startTimer() : null;
        this.checkForCheckout();
        this.getStoreBanners()
        // this.getStorePageDetails()
        this.getStoreProductsByFliter();
        this.getBagItems(this.storeDetails.id)
        let rating = this.calculateAggRating();
        this.setState({ value: rating })
        this.getFilterCategoriesForStore();

    }

    getFilterCategoriesForStore = async () => {
        let response = await getCategoriesForFilterForStore(this.storeDetails.id)
        if (response.status == 200) {
            let jsonCategories = response.responseJson
            console.log('getFilterCategoriesForStore', jsonCategories)
            jsonCategories = jsonCategories.map(v => ({ ...v, checked: false }))
            this.setState({
                categories: jsonCategories
            });
        }
    }

    calculateAggRating() {
        const { storeReviewAnalytics } = this.storeDetails;
        if (storeReviewAnalytics) {
            let total = storeReviewAnalytics.productQualityAverage + storeReviewAnalytics.purchaseExpAverage + storeReviewAnalytics.storeStaffSupportAverage;
            let aggStoreRating = (total / 3).toFixed(1);
            return aggStoreRating.toString();
        }
        else {
            return ''
        }

    }


    async componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdate>>>', this.props.isLikeStateChanged)
        console.log('componentDidUpdateStorepage>>>', this.props.isLoadingState)
        if (this.props.isLikeStateChanged == true) {
            console.log('StorePage::Like User Action Has Changed')
            this.props.actions.changeLikeState(false)
            //await this.getStoreAds()
            // await this.getStorePageDetails()
            await this.getStoreProductsByFliter()
        }
        if (this.props.isLoadingState == true) {
            console.log('IsLoading Action Has Changed')
            this.props.actions.changeLoadingState(false)
            await this.getStoreBanners()
            //await this.getStoreAds();
            // await this.getStorePageDetails()
            await this.getStoreProductsByFliter()
            await this.onFabArrowClickHandler();

        }
    }

    async getUserListStoreAds() {
        let response = await GetUserList()
        let storeAds = []
        if (response.status == 200) {
            let userList = response.responseJson
            let jsonUserList = JSON.parse(userList)
            storeAds = jsonUserList.storeAds;
        }
        else {
            //TODO Handle the error condition to show some default Error View

        }
        return storeAds
    }

    async getUserListStoreDetails() {
        let response = await GetUserList()
        let storeAds = []
        let products = []
        if (response && response.status == 200) {
            let userList = response.responseJson
            let jsonUserList = JSON.parse(userList)
            storeAds = jsonUserList.storeAds;
            products = jsonUserList.products
        }
        else {
            //TODO Handle the error condition to show some default Error View

        }
        return [storeAds, products]
    }

    getStorePageDetails = async () => {
        const [userListStoreAds, userListProducts] = await this.getUserListStoreDetails()
        //console.log("UserList StoreAds and Products>>>", JSON.stringify(userListProducts))
        let response = await GetStorePageDetails(this.storeDetails.id, this.isStoreCheckin)
        if (response.status == 200) {
            let storePageDetails = response.responseJson
            console.log('Ads and Products for Store>>>', JSON.parse(storePageDetails))
            let jsonStorePageDetails = JSON.parse(storePageDetails)
            let totalDeals = jsonStorePageDetails.length
            console.log('Total Deals Count>>>', totalDeals)

            jsonStorePageDetails.forEach(function (image, index) {
                if (image.type == StoreEntityType.Offer) {
                    let foundStoreAd = userListStoreAds.find(value => value.storeAd.id === image.id)
                    if (foundStoreAd) {

                        console.log('StoreAds included in userlist >>>', image)
                        image['wishList'] = true
                        image['useraction'] = foundStoreAd.useraction
                    }
                    else {
                        image['wishList'] = false
                    }
                }
                else {
                    let foundStoreProduct = userListProducts.find(value => value.product.id === image.id)
                    if (foundStoreProduct) {

                        console.log('StoreProduct included in userlist >>>', image)
                        image['wishList'] = true
                        image['useraction'] = foundStoreProduct.useraction
                    }
                    else {
                        image['wishList'] = false
                    }
                }
                this[index] = image;

            }, jsonStorePageDetails)

            this.setState({ storeAdsData: jsonStorePageDetails, isStoreAdsAvailable: true, totalDeals: totalDeals })
        }
    }

    getBagItems = async (storeId) => {
        const response = await getAllProductByStoreId(storeId);
        if (response.status == 200) {
            let cartItems = response.responseJson;
            console.log('cartItems', cartItems)
            this.setState({
                cartCount: cartItems.itemCount,
                bagId: (cartItems.baggedProducts[0].baggedProduct && cartItems.baggedProducts[0].baggedProduct.bagId) || 0
            })
        }
    }

    // async getStoreAds() {
    //   let userListStoreAds = await this.getUserListStoreAds()
    //   console.log('isStoreCheckin>>>', this.isStoreCheckin)
    //   let response = await GetStoreAds(this.storeDetails.id)
    //   if (response.status == 200) {
    //     let storeAds = response.responseJson
    //     console.log('Ads for Store>>>', storeAds)
    //     let jsonStoreAds = JSON.parse(storeAds)
    //     let totalDeals = jsonStoreAds.length
    //     console.log('Total Deals Count>>>', totalDeals)
    //     jsonStoreAds.forEach(function (image, index) {
    //       console.log('Campaign ID', image.id)
    //       let foundStoreAd = userListStoreAds.find(value => value.storeAd.id === image.id)
    //       if (foundStoreAd) {

    //         console.log('StoreAds included in userlist >>>', image)
    //         image['wishList'] = true
    //         image['useraction'] = foundStoreAd.useraction
    //       }
    //       else {
    //         image['wishList'] = false
    //       }
    //       this[index] = image;
    //     }, jsonStoreAds);
    //     console.log('Store Ads after merge>>>', jsonStoreAds)
    //     if (this.isStoreCheckin == true) {
    //       console.log('Exclusive Store Page, show all ads')
    //       this.setState({ storeAdsData: jsonStoreAds, isStoreAdsAvailable: true, totalDeals: totalDeals })
    //     }
    //     else {
    //       console.log('Non-Exclusive store page')
    //       let nonExclusiveStoreAds = this.getNonExclusiveStoreAds(jsonStoreAds)
    //       console.log('Non Exclusive Store Ads>>>', nonExclusiveStoreAds)
    //       let exclusiveDealsCount = totalDeals - nonExclusiveStoreAds.length
    //       console.log('exclusiveDealsCount>>', exclusiveDealsCount)
    //       this.setState({ storeAdsData: nonExclusiveStoreAds, isStoreAdsAvailable: true, exclusiveDealsCount: exclusiveDealsCount, totalDeals: totalDeals })
    //     }
    //   }
    // }

    getNonExclusiveStoreAds(storeAds) {
        return storeAds.filter((x) => { return x.checkInMandotory === false })
    }

    async getStoreBanners() {
        this.startCarouselLoading()
        let response = await GetStoreBanners(this.storeDetails.id)
        if (response.status == 200) {
            let storeBanners = response.responseJson
            let storebannersJson = JSON.parse(storeBanners)
            this.setState({ storeBanners: storebannersJson, storeBannerLoaded: true })
        }
        else {
            // TODO Handle Negative Case here
            this.setState({ storeBannerLoaded: true })
        }
        this.stopCarouselLoading()
    }

    onCloseClickHandler = () => {
        this.props.navigation.popToTop();
    }

    onShareClickHandler = async (item) => {
        console.log("Store Page ITEM_Share>>>>", item)

        let sharedData = 'DOBO APP'
        let isVideo = false;
        if (item != undefined) {

            if (item.mediaType == 0) {
                let replaceUrl = item.media.replace(/\\/gi, '/')
                let firstUrl = replaceUrl.split(',')[0];
                let finalUrl = firstUrl && firstUrl.indexOf('http') > -1 ? firstUrl : Constants.baseURL + firstUrl;
                sharedData = finalUrl
            }
            else {
                let replaceUrl = item.media
                sharedData = replaceUrl
            }
            try {
                let result = await shareProduct(sharedData, isVideo)
                console.log('shared with App ', result.app)
                const entityType = item.type == StoreEntityType.Offer ? EntityType.Offer : EntityType.FeatureProduct
                let response = await createShareUserAction(entityType, item.id)
                console.log('Share UserAction Response', response)
            } catch (error) {
                console.log('Could not share', error)
            }
        }
    }

    onWishlistClickHandler = async (item) => {
        console.log("Store Page ITEM_WISH>>>>", item)
        this.startLoading()
        let { actions } = this.props;
        if (item.wishList == false) {
            if (item.type == StoreEntityType.Offer) {
                await likeContent(EntityType.Offer, item)
                actions.changeLikeState(true)
                actions.changeLikeShowBadge(true)
            }
            else
                await likeContent(EntityType.FeatureProduct, item)
            actions.changeLikeState(true)
            actions.changeLikeShowBadge(true)
        }
        else {
            if (item.useraction != undefined) {
                let result = await DeleteUserActions(item.useraction.id)
                console.log('Delete Result>>', result)
            }
        }
        // actions.changeLikeState(true)
        // actions.changeLikeShowBadge(true)
        //await this.getStoreAds()
        // await this.getStorePageDetails()
        await this.getStoreProductsByFliter()
        this.stopLoading()
    }

    onGirdImageClickHandler = async (item) => {
        console.log('Store Clicked Data>>>', item)
        const entityType = item.type == StoreEntityType.Offer ? EntityType.Offer : EntityType.FeatureProduct
        console.log('EntityType', entityType)
        createClickUserAction(entityType, item.id)
        //console.log('Click UserAction Response>>>', response);
        this.props.navigation.navigate('StorePageDetails', { value: item, storeInfo: this.storeDetails, bagId: this.state.bagId })


        // this.imageUrl = Constants.imageResBaseUrl + item.media;
        // this.setState({
        //   isModalVisible: true
        // })
    }

    onOpenMapHandler = () => {
        let latitude = this.storeDetails.location.coordinates[1];
        let longitude = this.storeDetails.location.coordinates[0];
        console.log("lat-long>>>", latitude + ">>>>>" + longitude);
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${latitude},${longitude}`;
        const label = this.storeDetails.description.trim();
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }


    onFabClickHandler = () => {
        this.setState({ isFabButtonClicked: true })

    }
    onFabExpandClickHandler = () => {
        let description = {
            store: {
                description: this.storeDetails.description,
                id: this.storeDetails.id,
                location: this.storeDetails.location
            }
        }
        console.log('onFabExpandClickHandler', description)
        this.props.navigation.navigate('StoreCheckinQR', { listVal: description })
    }
    onFabArrowClickHandler = () => {
        this.setState({ isFabButtonClicked: false });
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
                            <Text style={{ color: "white", alignSelf: "center", marginLeft: '5%', fontFamily: Constants.LIST_FONT_FAMILY }}>STORE CHECK-IN</Text>
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
            this.state.checkoutFabClicked ? (
                <View style={{ position: "absolute", top: Constants.STORE_CHECKIN_BUTTON_POSITION, right: -10 }}>

                    <View style={styles.fabExpandButton}>
                        <TouchableOpacity onPress={() => this.setState({
                            checkoutFabClicked: false
                        })}>
                            <MaterialCommunityIcons name='logout' size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.checkout(true)} style={{ justifyContent: 'center', flexDirection: 'row' }}>
                            {/* <Text style={{ color: "white", alignSelf: "center", marginLeft: '5%', fontFamily: Constants.LIST_FONT_FAMILY }} >
                                {this.state.minutes <= 9 ? `0${this.state.minutes}` : this.state.minutes} : {this.state.seconds <= 9 ? `0${this.state.seconds}` : this.state.seconds} |
                            </Text> */}
                            <Text style={{ color: "white", alignSelf: "center", marginLeft: '2%', fontFamily: Constants.LIST_FONT_FAMILY }}>STORE CHECK-OUT</Text>
                        </TouchableOpacity>
                    </View >

                </View >
            ) :
                (
                    <View style={{ position: "absolute", top: Constants.STORE_CHECKIN_BUTTON_POSITION, right: -5 }}>

                        <View style={styles.fabButton}>
                            <TouchableOpacity onPress={() => this.setState({
                                checkoutFabClicked: true
                            })}>
                                <MaterialCommunityIcons name='logout' size={20} color="white" />
                            </TouchableOpacity>
                        </View>

                    </View>
                )
        )
    }

    startTimer() {
        this.counter = setInterval(() => {
            let seconds = this.state.seconds - 1;
            // reduce mintues once seconds hit 0
            if (seconds <= 0) {
                seconds = 59;
                this.setState({
                    minutes: this.state.minutes - 1
                });
            }
            //resetting/ checkout when timer ends
            if (this.state.minutes < 0) {
                this.checkout();
            }

            this.setState({
                seconds: seconds
            })
        }, 1000);
    }

    checkout = async (isManual) => {
        console.log('store checkout')
        let storesData = await checkForCheckinValidity()
        // this.setState({
        //     minutes: DEFAULT_TIMER
        // });
        // clearInterval(this.counter);
        if (isManual) {
            Alert.alert(
                'Checkout',
                'Are you sure you want to checkout?',
                [
                    {
                        text: 'Yes', onPress: () => {
                            if (storesData.checkedIn.length) {
                                this.checkoutStoreAPI(storesData);
                            }
                        }
                    },
                    { text: 'No', onPress: () => { } }
                ],
                { cancelable: true });
        }
        else {
            if (storesData.checkedIn.length) {
                this.checkoutStoreAPI(storesData);
            }
        }
    }

    checkoutStoreAPI = async (storesData) => {
        let dataFromStorage = await AsyncStorage.getItem('storeCheckInData') || {};
        const { id, storeId, checkInTime } = JSON.parse(dataFromStorage);
        let data = { "id": id, "StoreId": storeId, "checkInTime": checkInTime, "checkOutTime": new Date() }
        let checkoutResponse = await Storecheckins(data, id);
        if (checkoutResponse.status == 200) {
            this.isStoreCheckin = false;
            this.setState({ isStoreCheckin: false, checkinDetails: JSON.parse(dataFromStorage) });
            this.expiredStoreDetails = storesData.checkedIn[storesData.checkedIn.length - 1];
            this.setState({
                showRating: true
            })
        }
    }

    checkForCheckout = async () => {
        let storesData = await checkForCheckinValidity(),
            isStoreExpired = false;

        if (storesData.expired.length) {
            this.expiredStoreDetails = storesData.expired[0];
            this.isStoreCheckin = true;
            this.setState({ isStoreCheckin: true });
            isStoreExpired = true;
            this.checkout();
        }
        //below code checks if current store is expired
        // storesData.expired.some((store) => {

        //     // if (store.storeId == this.storeDetails.id) {
        //     //     this.isStoreCheckin = true;
        //     //     isStoreExpired = true;
        //     //     this.checkout();
        //     //     return true;
        //     // }
        // });
        if (!isStoreExpired) {
            // showing checkout if any of the store is checked in
            if (storesData.checkedIn.length) {
                this.setState({ isStoreCheckin: true });
                this.isStoreCheckin = true;
            }
            //checking for individual store check in
            // storesData.checkedIn.some((item) => {
            //     if (item.storeId == this.storeDetails.id) {
            //         this.isStoreCheckin = true;
            //         return true;
            //     }
            // })
        }

        console.log('storesData', storesData);
    }



    renderStoreAdsView() {
        if (this.state.isStoreAdsAvailable) {
            return (
                <GridComponent
                    data={this.state.storeAdsData}
                    onImageClick={(item) => this.onGirdImageClickHandler(item)}
                    onWishlistClick={(item) => this.onWishlistClickHandler(item)}
                    onShareClick={(item) => this.onShareClickHandler(item)}
                    onListScroll={(data) => this.onListScrollHandler(data)}
                // onListScroll={Animated.event(
                //     [{
                //         nativeEvent: { contentOffset: { y: this.scrollY } },
                //     }],
                //     { listener: () => this.onListScrollHandler() }
                // )}
                />
            )
        }
        else {
            return (
                <Text style={{
                    textAlign: 'center',
                    justifyContent: 'center',
                    fontFamily: Constants.LIST_FONT_FAMILY,
                    fontSize: Constants.LIST_FONT_HEADER_SIZE,
                    color: Constants.DOBO_GREY_COLOR
                }}>
                    No Results Found
                </Text>
            )
        }
    }

    renderRating() {
        return (
            <ModalPopUp canClose={false} onClose={this.onRatingModalClose} closeIcon="close">
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

    onRatingModalClose() {
        this.setState({
            showRating: false,
            showThanks: false
        });
        this.props.navigation.navigate('Home', {
            isStoreCheckin: false
        });
    }


    onListScrollHandler(data) {
        if (data > 269 && !this.headerScrolled) {
            this.headerScrolled = true;
            this.scrollY.setValue(270)
            this.setState({
                showHeaderName: true
            })
        }
        if (data == 0) {
            this.headerScrolled = false;
            this.scrollY.setValue(0)
            this.setState({
                showHeaderName: false
            })
        }
        // if (this.scrollY._value > 100 && !this.state.showHeaderName) {
        //     this.setState({
        //         showHeaderName: true
        //     })
        // } else if (this.scrollY._value < 50) {
        //     this.setState({
        //         showHeaderName: false
        //     })
        // }
    }

    handleRatingSubmit() {
        removeStoreFromStorage(this.storeDetails.id);
        // this.onRatingModalClose();
        this.setState({
            showThanks: true
        })
    }

    componentWillUnmount() {
        // if (this.isStoreCheckin === true) {
        //     this.props.navigation.state.params.onClose()
        // }
    }
    //Don't know what is the use of this function, thus commenting it
    // openModal = () => {
    //     if (!this.state.isModalVisible) {
    //         return (
    //             <View>
    //                 <Modal
    //                     animationType="slide"
    //                     //transparent={true}
    //                     visible={this.state.isModalVisible}
    //                     onRequestClose={() => {
    //                         this.setState({
    //                             isModalVisible: false
    //                         })
    //                     }}>
    //                     <View style={{ marginTop: 22 }}>
    //                         <View>
    //                             <TouchableWithoutFeedback>
    //                                 <TouchableOpacity style={{ left: 10, position: 'absolute' }}
    //                                     onPress={() => {
    //                                         this.setState({
    //                                             isModalVisible: false
    //                                         })
    //                                     }}>
    //                                     <Icon name="arrow-back" color="grey"></Icon>
    //                                 </TouchableOpacity>
    //                             </TouchableWithoutFeedback>

    //                             <View style={{ alignSelf: 'center', marginTop: Constants.NEAR_ME_BUTTON_POSITION }}>
    //                                 <Image style={styles.modalImage}
    //                                     source={{ uri: this.imageUrl }}
    //                                     resizeMode='contain' />
    //                             </View>

    //                         </View>
    //                     </View>
    //                 </Modal>
    //             </View>
    //         )
    //     }
    // }

    // renderExclusiveDealsCount = () => {
    //   if (this.isStoreCheckin == false && this.state.exclusiveDealsCount > 0) {
    //     return <Text style={{ fontSize: 10, marginLeft: '5%', color: '#295C73', textAlign: 'left', justifyContent: 'flex-start', fontFamily: Constants.BOLD_FONT_FAMILY }}>*Check-in to the store to unlock {this.state.exclusiveDealsCount} deals</Text>
    //   }
    //   else {
    //     return null
    //   }
    // }

    renderCarouselItem = ({ item, index }) => {
        let mediaURL = item.imageUrl && item.imageUrl.indexOf('http') > -1 ? item.imageUrl : Constants.imageResBaseUrl + item.imageUrl
        if (item.bannerType === 0) {
            return (
                <StoreBannerImageCard
                    key={index}
                    mediaUrl={mediaURL}
                />
            )
        }
        else {
            return (
                <StoreBannerVideoCard
                    key={index}
                    mediaUrl={item.imageUrl}
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

    startLoading = () => {
        this.setState({ loading: true })
    }

    stopLoading = () => {
        this.setState({ loading: false })
    }

    handleCartPress = () => {
        this.props.navigation.navigate('StoreBag', { storeInfo: this.storeDetails, bagId: this.state.bagId });
    }

    onPageFocus = async () => {
        console.log('store page focused');
        this.startLoading();
        this.checkForCheckout();
        // await this.getStorePageDetails()
        await this.getStoreProductsByFliter()
        await this.getBagItems(this.storeDetails.id)
        this.stopLoading();
    }

    handleCall = () => {
        callNumber(this.storeDetails.phone || this.storeDetails.retailer.alternateContact || this.storeDetails.retailer.phone)
    }

    onApplyFilter = async (data) => {
        console.log('Filter Options Applied>', data)
        this.filterOptions = data
        await this.getStoreProductsByFliter(data)

    }

    onClearFilter = async (data) => {
        this.filterOptions = data
        await this.getStoreProductsByFliter()
    }

    getStoreProductsByFliter = async (filterData) => {
        let body = {
            "sortBy": "whatsnew",
            "categories": []
        }
        if (filterData) {
            filterData.forEach(element => {
                if (element.value === 'Categories') {
                    element.details.forEach(element => {
                        if (element.checked === true) {
                            body.categories.push({ id: element.id })
                        }
                        if (element.children && element.children.length) {
                            element.children.forEach((child) => {
                                if (child.checked) {
                                    body.categories.push({ id: child.id })
                                }
                                if (child.children && child.children.length) {
                                    child.children.forEach((subChild) => {
                                        if (subChild.checked) {
                                            body.categories.push({ id: subChild.id })
                                        }
                                    })
                                }
                            })
                        }
                    });

                }
                else if (element.value === 'Sort by') {
                    body.sortBy = element.details[element.selectedIndex].mapping ? element.details[element.selectedIndex].mapping : 'whatsnew'
                }
            });
        }

        const [userListStoreAds, userListProducts] = await this.getUserListStoreDetails() //fetching liked products and ads
        let response = await GetStoresProductsByFilter(body, this.storeDetails.id, this.isStoreCheckin)
        console.log('GetStoresProductsByFilter', response)
        if (response.status == 200) {
            let jsonStorePageDetails = response.responseJson
            // console.log('Ads and Products for Store>>>', JSON.parse(storePageDetails))
            // let jsonStorePageDetails = JSON.parse(storePageDetails)
            let totalDeals = jsonStorePageDetails.length
            console.log('Total Deals Count>>>', totalDeals)
            console.log('jsonStorePageDetails', jsonStorePageDetails)

            jsonStorePageDetails.forEach(function (image, index) {
                if (image.type == StoreEntityType.Offer) {
                    let foundStoreAd = userListStoreAds.find(value => value.storeAd.id === image.id)
                    if (foundStoreAd) {

                        console.log('StoreAds included in userlist >>>', image)
                        image['wishList'] = true
                        image['useraction'] = foundStoreAd.useraction
                    }
                    else {
                        image['wishList'] = false
                    }
                }
                else {
                    let foundStoreProduct = userListProducts.find(value => value.product.id === image.id)
                    if (foundStoreProduct) {

                        console.log('StoreProduct included in userlist >>>', image)
                        image['wishList'] = true
                        image['useraction'] = foundStoreProduct.useraction
                    }
                    else {
                        image['wishList'] = false
                    }
                }
                this[index] = image;

            }, jsonStorePageDetails)

            this.setState({ storeAdsData: jsonStorePageDetails, isStoreAdsAvailable: true, totalDeals: totalDeals })

        }
        else {
            // this.setState({ storeList: [] })
        }

    }

    openModal = () => {
        if (this.state.isFilterModalVisible) {
            console.log('Filter Options State', this.filterOptions)
            return (

                <Filter
                    onModalClose={() => this.setState({ isFilterModalVisible: false })}
                    onApplyFilter={this.onApplyFilter}
                    onClearFilter={this.onClearFilter}
                    filterOptions={this.filterOptions}
                    isFilterInsideStore={true}
                    categoriesForStore={this.state.categories}
                    showFilter={this.state.isFilterModalVisible}
                    storeData={this.storeDetails}

                />

            );
        } else {
            return (null);
        }
    }

    render() {
        console.log('this.StorDetails.openingTime', this.storeDetails)
        let StartTime = moment(this.storeDetails.openingTime, "LTS").format('h:mma');
        let EndTime = moment(this.storeDetails.closingTime, "LTS").format('h:mma');

        let beginningTime = moment(StartTime, 'h:mma');
        let endingTime = moment(EndTime, 'h:mma');
        console.log('beginningTime', StartTime)
        console.log('endingTime', EndTime)
        console.log('openTimeFormat', beginningTime.isBefore(endingTime))
        console.log('closeTimeFormat', endingTime.isBefore(beginningTime))
        let openTimeFormat
        let closeTimeFormat
        if (beginningTime.isBefore(endingTime)) {

            openTimeFormat = 'Open'

        } else {
            // openTimeFormat = moment(this.storeDetails.openingTime,"LTS").format("HH:mm");
            openTimeFormat = 'Opens' + ' ' + moment(this.storeDetails.openingTime, "LTS").utcOffset('+05:30').format('LT');
        }

        if (endingTime.isBefore(beginningTime)) {

            closeTimeFormat = 'Closed'

        } else {

            //closeTimeFormat = moment(this.storeDetails.closingTime,"LTS").format("HH:mm");
            closeTimeFormat = 'Closes' + ' ' + moment(this.storeDetails.closingTime, "LTS").utcOffset('+05:30').format('LT');
        }

        const { coordinates } = this.props
        let distance = GetDistance(coordinates.latitude, coordinates.longitude, this.storeDetails.location.coordinates[1], this.storeDetails.location.coordinates[0]),
            distanceMsg = distance > 1 ? `${Math.round(distance)} km` : distance <= 1 ? `${Math.round(distance * 1000)} m` : '';
        let storeMediaURL = this.storeDetails.retailer && this.storeDetails.retailer.iconURL && this.storeDetails.retailer.iconURL.indexOf('http') > -1 ? this.storeDetails.retailer.iconURL : Constants.imageResBaseUrl + this.storeDetails.retailer.iconURL
        console.log('this.storeDetails', this.storeDetails)
        return (
            <View style={styles.container}>
                <NoNetwork />
                <Loader
                    loading={this.state.loading}
                />
                <NavigationEvents
                    onDidFocus={this.onPageFocus}
                />
                <NavHeader backPressHandler={this.onCloseClickHandler} isTransparent={!this.state.showHeaderName} heading={this.state.showHeaderName ? this.storeDetails.description.trim() : ""}>
                    <View style={styles.rightContainer}>
                        <MaterialCommunityIcons name='phone' size={20} color="#31546e" style={styles.callIcon} onPress={this.handleCall} />
                        {
                            // Constants.SHOW_FEATURE &&
                            <CartBag count={this.state.cartCount} onBadgePress={this.handleCartPress} />
                        }
                    </View>
                </NavHeader>
                <Animated.View style={
                    { transform: [{ translateY: this.headerHeight }] }
                }>
                    <View>
                        <AutoPlayCarousel
                            children={this.state.storeBanners}
                            renderItem={this.renderCarouselItem}
                            height={Constants.BANNER_HEIGHT - 20}
                            autoplay={true}
                            loading={this.state.carouselLoader}
                            isDataLoaded={this.state.storeBannerLoaded}
                        />
                    </View>

                    <View>
                        <View style={styles.listRow}>
                            <Image style={styles.listImage}
                                source={{ uri: storeMediaURL || Constants.DEFAULT_STORE_ICON }} />
                            <View style={styles.rowText}>
                                <Text
                                    style={styles.listNameText}>
                                    {this.storeDetails.description.trim()}
                                </Text>
                                <Text numberOfLines={3}
                                    style={styles.listAddressText}>
                                    {(this.storeDetails.address.address1 || '') + '\n' + (this.storeDetails.address.address2 || '')}
                                </Text>
                            </View>
                            {/*Commented on DOBO team request*/}
                            {/* <View style={{ flex: 0.2, flexDirection: 'row', marginTop: 15, marginHorizontal: '5%', alignSelf: 'flex-start' }}>
                            <Text style={{
                                fontSize: Constants.LIST_FONT_SIZE_ADDRESS,
                                fontFamily: Constants.LIST_FONT_FAMILY,
                                color: Constants.DOBO_GREY_COLOR,
                            }}>
                                {this.state.value}
                            </Text>
                            <IconComponent
                                style={{ marginHorizontal: '5%' }}
                                name={ImageConst["star-rating"]}
                                size={12}
                            />
                        </View> */}
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                {
                                    !!this.state.value &&
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.storeStarRating}>{this.state.value || ''}</Text>
                                        <Icon
                                            name='star'
                                            color="#ffc106"
                                            size={14}
                                            style={{
                                                fontFamily: Constants.LIST_FONT_FAMILY
                                            }}
                                        />
                                    </View>
                                }
                                {/* <View style={{ flex: 1, marginTop: '10%' }}>
                                <Button
                                    title={distanceMsg}
                                    onPress={this.onOpenMapHandler}
                                    buttonStyle={styles.locButton}
                                    icon={{
                                        name: 'map-marker',
                                        type: 'font-awesome',
                                        size: 10,
                                        color: 'white',
                                    }}
                                    titleStyle={{ fontSize: 10 }}
                                />
                            </View> */}
                            </View>
                            {/* Commented as per new design */}
                            {/* <Divider style={{ backgroundColor: '#CEDCCE', width: 1, height: '80%', alignSelf: "center", }} />
                        <View style={{ flex: 1, marginStart: '3%', marginTop: 15 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.storeInfoText}>
                                    {openTimeFormat}
                                </Text>
                                <Text style={styles.storeInfoText}>
                                    {closeTimeFormat}
                                </Text>
                            </View>

                            <View style={{ flex: 1, marginTop: '5%' }}>
                                <Button
                                    title={distanceMsg}
                                    onPress={this.onOpenMapHandler}
                                    buttonStyle={styles.locButton}
                                    containerStyle={{
                                        marginEnd: '15%'
                                    }}
                                    icon={{
                                        name: 'map-marker',
                                        type: 'font-awesome',
                                        size: 10,
                                        color: 'white',
                                    }}
                                    titleStyle={{ fontSize: 10 }}
                                />
                            </View>

                        </View> */}
                        </View>
                    </View>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#e0eaed', paddingHorizontal: 16, paddingTop: 8 }}>
                        {/* <View style={{ flexDirection: "column" }}>
                        <Text style={{ fontSize: 18, justifyContent: 'center', margin: '5%', color: '#295C73', fontFamily: Constants.BOLD_FONT_FAMILY }}>Explore the store..</Text> */}
                        {/* {
              this.renderExclusiveDealsCount()
            } */}
                        {/* </View> */}
                        <TouchableOpacity style={styles.filterView} onPress={() => this.setState({ isFilterModalVisible: true })}>
                            <Icon
                                name="sort"
                                color="#4d6b82"
                                size={20} />
                            <Text style={styles.filterText}>Sort</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterView} onPress={() => this.setState({ isFilterModalVisible: true })}>
                            <Icon
                                name="sliders"
                                type="feather"
                                color="#4d6b82"
                                size={20} />
                            <Text style={styles.filterText}>Filter</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingHorizontal: '2%' }}>
                        {this.renderStoreAdsView()}
                    </View>
                </Animated.View>

                {!this.state.isStoreCheckin ? this.showcolapsableView() : this.showCheckout()}
                {this.openModal()}
                {this.state.showRating ? this.renderRating() : null}
                {this.state.showThanks ? this.renderThanks() : null}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headContainer: {
        position: 'absolute',
        padding: 8,
        paddingRight: 16,
        backgroundColor: 'white',
        opacity: 0.8,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    back: {},
    listRow: {
        flexDirection: "row",
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 12,
        //borderBottomColor: "black"
    },
    listImage: {
        width: 50,
        height: 50,
        marginHorizontal: 10,
        // marginVertical: 8,
        // borderRadius: 10
    },
    rowText: {
        flexDirection: "column",
        flex: 2.5
    },
    listNameText: {
        // marginTop: 10,
        fontSize: 12,
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: Constants.DOBO_GREY_COLOR
    },
    listAddressText: {
        marginTop: 5,
        fontSize: 10,
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: Constants.BODY_TEXT_COLOR
    },
    iconImage: {
        marginLeft: 20,

    },
    iconImage1: {
        marginLeft: 20,
        marginBottom: 15
    },
    filterView: {
        flexDirection: 'row'
    },
    filterText: {
        marginLeft: 10,
        marginBottom: 10,
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 12,
        paddingTop: 2
    },
    modalImage: {

        height: Constants.EXPAND_IMAGE_HEIGHT,
        width: Constants.EXPAND_IMAGE_WIDTH
    },
    locButton: {
        //justifyContent: 'space-evenly',
        backgroundColor: Constants.DOBO_RED_COLOR,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden',
        //marginTop: '5%',
        height: Platform.OS === 'ios' ? 30 : '80%',
    },
    checkinButton: {

        backgroundColor: Constants.DOBO_RED_COLOR,
        borderRadius: 40,
        borderColor: '#fff',

        height: Platform.OS === 'ios' ? 30 : '90%',
    },
    storeInfoText: {
        fontSize: 11,
        padding: 3,
        // marginTop: '5%',
        //fontWeight:'700',
        fontFamily: Constants.LIST_FONT_FAMILY,
    },
    fabButton: {
        borderRadius: 35,
        marginRight: -20,
        padding: 10,
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
        padding: 10,
        paddingRight: 40,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: Constants.DOBO_RED_COLOR,
        overflow: 'hidden'
    },
    storeStarRating: {
        paddingRight: 4,
        fontSize: 12,
        color: '#5E7A90',
        justifyContent: 'center',
        fontFamily: Constants.LIST_FONT_FAMILY,
    },
    rightContainer: {
        flexDirection: 'row'
    },
    callIcon: {
        paddingHorizontal: 12
    }
});

const mapStateToProps = state => ({
    coordinates: state.location.coordinates,
    isLikeStateChanged: state.like.isStateChanged,
    isLoadingState: state.isLoading.isLoadingState

});

const ActionCreators = Object.assign(
    {},
    likeActions,
    loadingActions

);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(StorePage)
