import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import { coupons } from '../../services/ProfileListApi';
import Loader from '../Common/Loader';
import NoDataFound from '../Common/NoDataFound';
import ViewCouponList from '../GiftVoucher/BuyVouchers/ViewCouponsList';

class Coupons extends Component {
    constructor(props) {
        super(props);
        this.onCouponClickHandler = this.onCouponClickHandler.bind(this);
    }

    state = {
        loading: false,
        couponDetails: [],
        isDataLoaded: false
    };

    componentDidMount = async () => {
        this.callCouponsDetails()
    }


    callCouponsDetails = async () => {
        this.startLoading();
        let response = await coupons();
        if (response.status == 200) {
            let couponData = response.responseJson;
            console.log('callCouponsDetails>>>', couponData)
            this.setState({ couponDetails: JSON.parse(couponData) });
            this.stopLoading();
        } else {
            this.stopLoading();
        }
        this.setState({ isDataLoaded: true })
    }



    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false });
    }

    onCouponClickHandler = () => {
        //this.props.navigation.navigate();
    }

    onUsePress = (item) => {
        if (item.retailer == null) {
            this.props.navigation.navigate('GiftVoucherTab', { couponCode: item.code })
        }
        else {
            this.props.navigation.navigate('RetailerVouchers', { listVal: item.retailer, couponCode: item.code })
        }
    }

    render() {
        const { isDataLoaded, couponDetails, loading } = this.state
        return (
            <View style={styles.container}>
                <Loader loading={loading} />
                {isDataLoaded && couponDetails.length == 0
                    ? <View style={styles.noDatacontainer}>
                        <NoDataFound message='No Coupons Found' />
                    </View>
                    : <ViewCouponList
                        data={couponDetails}
                        onUsePress={this.onUsePress}
                    />
                }

            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noDatacontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default Coupons;