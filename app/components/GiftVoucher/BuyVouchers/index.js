import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-elements';
import BuyVoucherListComponent from './BuyVoucherListComponent'
import { GetRetailerWithVoucher } from '../../../services/VoucherApi'
import NoNetwork from '../../Common/NoNetwork';
import * as Constants from '../../../services/Constants';
import ByVoucherImageCard from './ByVoucherImageCard';
import AutoPlayCarousel from '../../Common/AutoPlayCarousel';
import * as loadingActions from '../../../actions/isLoading';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ScrollView } from 'react-native-gesture-handler';

class BuyVouchers extends Component {
    constructor(props) {
        super(props);
    }

    couponCode = ''
    state = {
        voucherBanners: [],
        isFabButtonClicked: false,
        loading: false,
        carouselLoader: false,
        voucherBannerLoaded: false
    };

    componentDidMount() {
        this.couponCode = this.props.navigation.getParam('couponCode') || '';
        console.log('Coupon Code in BuyVoucher', this.couponCode)
        this.getCarouselGiftVouchers();
        this.getRetailerVoucher();
        this.unsubscribe = this.props.navigation.addListener('didFocus', () => {
            console.log('Voucher selected')
            this.props.actions.changeLoadingState(false)
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdateBuyvoucher>>>', this.props.isLoadingState)
        if (this.props.isLoadingState == true) {
            console.log('IsLoading Action Has Changed')
            this.props.actions.changeLoadingState(false)
            await this.getCarouselGiftVouchers();
            await this.getRetailerVoucher();

        }
    }

    async getRetailerVoucher() {
        this.startLoading();
        let { actions } = this.props;
        let response = await GetRetailerWithVoucher();
        if (response.status == 200) {
            let voucherData = response.responseJson;
            this.setState({ listData: JSON.parse(voucherData) });
            this.stopLoading();
        } else {
            this.stopLoading();
        }
        // actions.changeLoadingState(true)
    }


    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false });
    }

    async getCarouselGiftVouchers() {
        this.startCarouselLoading()
        let response = await GetRetailerWithVoucher();
        let { actions } = this.props;
        if (response.status == 200) {
            let voucherBanners = response.responseJson;
            let voucherBannersJSON = JSON.parse(voucherBanners)
            this.setState({ voucherBanners: voucherBannersJSON, voucherBannerLoaded: true })

        } else {
            //this.stopLoading();
            this.setState({ voucherBannerLoaded: true })
        }
        this.stopCarouselLoading()
        // actions.changeLoadingState(true)
    }

    onWishlistClickHandler = () => {

    }

    onShareClickHandler = () => {

    }

    onImageClickHandler = () => {

    }

    onCurrentItemClick = (item) => {
        this.props.navigation.navigate('RetailerVouchers', { listVal: item.retailers, couponCode: this.couponCode })
    }

    renderCarouselItem = ({ item, index }) => {
        let itemMediaURL = item.retailers.voucherBanner && item.retailers.voucherBanner.indexOf('http') > -1 ? item.retailers.voucherBanner : Constants.imageResBaseUrl + item.retailers.voucherBanner
        return (
            <ByVoucherImageCard
                key={index}
                mediaUrl={itemMediaURL}
                data={item}
            // onWishlistClickHandler={(data) => this.onWishlistClickHandler(data)}
            // onShareClickHandler={(data) => this.onShareClickHandler(data)}
            // onImageClickHandler={(data) => this.onImageClickHandler(data)}
            />
        )
    }

    startCarouselLoading = () => {
        this.setState({ carouselLoader: true })
    }

    stopCarouselLoading = () => {
        this.setState({ carouselLoader: false })
    }

    render() {
        return (
            <View style={styles.container}>
                <NoNetwork />
                <View>
                    <AutoPlayCarousel
                        children={this.state.voucherBanners}
                        renderItem={this.renderCarouselItem}
                        height={Constants.BANNER_HEIGHT}
                        autoplay={true}
                        loading={this.state.carouselLoader}
                        isDataLoaded={this.state.voucherBannerLoaded}
                    />
                </View>
                <ScrollView>
                    <View style={styles.buyView}>
                        <Text style={styles.buyText}>BUY OR</Text>
                        <Text style={styles.giftText}>GIFT SOMEONE!</Text>
                        <Text style={styles.redeemText}>Redeem yourself or gift your loved ones.</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={{ alignSelf: 'center', }}>
                        <Text style={styles.retailerText}>CHOOSE A RETAILER</Text>
                    </View>
                    <View>
                        <BuyVoucherListComponent data={this.state.listData}
                            onCurrentItemClick={(item) => this.onCurrentItemClick(item)} />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buyView: {
        alignSelf: 'center',
        marginTop: '2%',
    },
    buyText: {
        alignSelf: 'center',
        color: '#F64658',
        fontSize: 22,
        fontFamily: Constants.BOLD_FONT_FAMILY

    },
    giftText: {
        alignSelf: 'center',
        color: '#F64658',
        fontSize: 22,
        fontFamily: Constants.BOLD_FONT_FAMILY
    },
    redeemText: {
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: '#8398A8'
    },
    divider: {
        backgroundColor: '#CEDCCE',
        margin: '2%'
    },
    retailerText: {
        color: '#577389',
        fontSize: 16,
        fontFamily: Constants.LIST_FONT_FAMILY,
    }
});

const mapStateToProps = state => ({
    isLoadingState: state.isLoading.isLoadingState
});

const ActionCreators = Object.assign(
    {},
    loadingActions
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyVouchers);