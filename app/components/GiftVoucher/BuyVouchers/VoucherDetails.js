import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Divider, Button } from 'react-native-elements';
import * as Constants from '../../../services/Constants';
import Loader from '../../Common/Loader';
import { getcouponbycode } from '../../../services/VoucherApi';

class VoucherDetails extends Component {

    static navigationOptions = {
        title: 'Gift Vouchers'
    }
    voucherDetails = {};
    state = {
        checked: false,
        finalAmount: '0',
        couponCode: '',
        loading: false,
        couponCodeJson: null
    }
    constructor(props) {
        super(props);
        this.voucherDetails = props.navigation.getParam('value');
        this.onBuyVoucherClickHandler = this.onBuyVoucherClickHandler.bind(this);
        this.handleCouponCode = this.handleCouponCode.bind(this);
    }

    componentDidMount() {
        let couponCode = this.props.navigation.getParam('couponCode') || '';
        this.handleCouponCode(couponCode)
    }

    handleCouponCode(value) {
        if (value !== '') {
            this.setState({
                couponCode: value.toUpperCase(),
                backgroundColor: Constants.DOBO_GREY_COLOR
            });
            //this.applyCoupon(value)
        }

    }
    onBuyVoucherClickHandler = (data) => {
        console.log('finalAmount', data)
        this.props.navigation.navigate('BuyVoucher', { details: this.voucherDetails, data: data, couponCode: this.state.couponCode })
    }

    applyCoupon = async () => {
        this.startLoading();
        let retailerId = this.voucherDetails.retailer.id
        let couponCode = this.state.couponCode.toUpperCase();
        let response = await getcouponbycode(couponCode);
        let couponJsonData = response.responseJson;
        let jsonCouponData = JSON.parse(couponJsonData)
        let couponRetailer = jsonCouponData.retailer
        // If retailer is null then it is DOBO coupon
        if (jsonCouponData.redeemed == false && (couponRetailer == null || couponRetailer.id == retailerId)) {
            this.setState({ couponCodeJson: jsonCouponData, couponCode: jsonCouponData.code.toUpperCase() })
            this.stopLoading();
        } else {
            this.stopLoading();
            this.setState({ couponCodeJson: null, couponCode: '' })
            Alert.alert('Invalid Coupon')
        }
    }


    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false })
    }


    // componentDidMount() {
    //     this.onBuyVoucherClickHandler()
    //     // this.setState({ finalAmount: this.state.finalAmount});
    // }

    onUsePress = (coupon) => {
        console.log('Coupon Code after Use>>', coupon)
        let couponCode = coupon.code
        this.setState({ couponCode: couponCode.toUpperCase(), couponCodeJson: null })
        //this.applyCoupon(couponCode)
    }

    viewCoupons = () => {
        let retailerId = this.voucherDetails.retailer.id
        console.log('Voucher Details retailerId', retailerId)
        this.props.navigation.push('ViewCoupons', { retailerId: retailerId, onUsePress: this.onUsePress })
    }

    render() {
        let AmountToPay
        let DiscountUpdate = parseInt(this.voucherDetails.discount)
        if (this.state.couponCodeJson == null) {
            AmountToPay = (this.voucherDetails.amount) - (this.voucherDetails.amount * (this.voucherDetails.discount / 100));
        } else {
            let couponCodeDisc = parseInt(this.state.couponCodeJson.discount);
            DiscountUpdate = (DiscountUpdate + couponCodeDisc);
            let AmountToPayPrevious = (this.voucherDetails.amount) - (this.voucherDetails.amount * (this.voucherDetails.discount / 100));
            AmountToPay = (AmountToPayPrevious) - (AmountToPayPrevious * (couponCodeDisc / 100));
        }
        let data = {
            AmountToPay,
            DiscountUpdate
        }
        let itemMediaURL = this.voucherDetails.retailer && this.voucherDetails.retailer.voucherBanner && this.voucherDetails.retailer.voucherBanner.indexOf('http') > -1 ? this.voucherDetails.retailer.voucherBanner : Constants.imageResBaseUrl + this.voucherDetails.retailer.voucherBanner
        return (
            <View style={{ flex: 1 }}>
                <Loader
                    loading={this.state.loading}
                />
                <Image
                    style={{ width: '100%', height: '40%' }}
                    source={{ uri: itemMediaURL }}
                    resizeMode='stretch'
                />
                <ScrollView>
                    <View style={{ flex: 1, }}>

                        <View style={{ marginTop: 20, flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1, }}>
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={styles.voucherDetailsText1}>Voucher amount</Text>
                                    <Text style={styles.voucherDetailsTextValue1}>{'\u20B9'}{this.voucherDetails.amount}</Text>
                                </View>
                                <View style={{ flexDirection: "column", marginTop: '12%' }}>
                                    <Text style={styles.voucherDetailsText1}>Discount</Text>
                                    <Text style={styles.voucherDetailsTextValue1}>{DiscountUpdate}%</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={styles.voucherDetailsText2}>Quantity</Text>
                                    <Text style={styles.voucherDetailsTextValue2}>1</Text>
                                </View>
                                <View style={{ flexDirection: "column", marginTop: '12%' }}>
                                    <Text style={styles.voucherDetailsText2}>Amount to pay</Text>
                                    <Text style={styles.voucherDetailsTextValue2}>{'\u20B9'}{AmountToPay}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 0.1 }}>
                                <Divider style={{ backgroundColor: '#CEDCCE', width: 1, height: '30%', alignSelf: "center", marginLeft: '1%', marginRight: '1%' }} />
                            </View>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <View style={{ flex: 0.6 }}>
                                    <Text style={{ paddingRight: '3%', fontSize: 14, color: Constants.DOBO_RED_COLOR, fontFamily: Constants.LIST_FONT_FAMILY }}>CHANGE</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={{ marginTop: '5%', }}>
                            <View style={{
                                height: 1,
                                width: "100%",
                                backgroundColor: "#CEDCCE",
                            }} />
                        </View>
                        <View style={{ flexDirection: 'row', paddingHorizontal: '5%' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.coupons}>Apply Coupons</Text>
                            </View>
                            <TouchableOpacity
                                style={{ alignItems: 'flex-end', alignSelf: 'center' }}
                                onPress={() => this.viewCoupons()}>
                                <Text style={{ color: Constants.DOBO_RED_COLOR, fontFamily: Constants.LIST_FONT_FAMILY }}>
                                    VIEW COUPONS
					            </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, marginHorizontal: '5%', flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    placeholder="Coupon code"
                                    placeholderTextColor="#B6C6CE"
                                    style={{ height: 40, borderColor: Constants.DOBO_GREY_COLOR, borderWidth: 1, justifyContent: 'center' }}
                                    onChangeText={this.handleCouponCode}
                                    value={this.state.couponCode}
                                />
                            </View>

                            <Button
                                title='APPLY COUPON'
                                type="outline"
                                buttonStyle={styles.continueButton}
                                titleStyle={{ fontSize: 14, color: Constants.DOBO_RED_COLOR, fontFamily: Constants.LIST_FONT_FAMILY }}
                                containerStyle={{ flex: 1, marginStart: '5%' }}
                                onPress={() => this.applyCoupon()} />
                        </View>
                    </View>
                    <View style={{ marginTop: '20%', width: "100%", paddingLeft: '10%', paddingRight: '10%', backgroundColor: Constants.LIGHT_BACKGROUND_GREY_COLR, paddingVertical: '2%' }}>
                        <Button
                            title='BUY VOUCHER'
                            type="outline"
                            buttonStyle={styles.buyVoucherButton}
                            titleStyle={{ fontSize: 16, color: 'white', paddingTop: '2%', paddingBottom: '2%' }}
                            onPress={() =>
                                //this.setState({finalAmount:AmountToPay})
                                this.onBuyVoucherClickHandler(data)
                            } />
                    </View>
                </ScrollView>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    continueButton: {
        borderRadius: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'red',
    },
    buyVoucherButton: {
        width: '100%',
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'center',
    },
    voucherDetailsText1: {
        paddingLeft: 16,
        fontSize: 14,
        fontFamily: Constants.LIST_FONT_FAMILY
    },
    voucherDetailsText2: {
        paddingLeft: 25,
        fontSize: 14,
        fontFamily: Constants.LIST_FONT_FAMILY

    },
    voucherDetailsTextValue1: {
        paddingLeft: 16,
        fontSize: 16,

    },
    voucherDetailsTextValue2: {
        paddingLeft: 25,
        fontSize: 16,
    },
    coupons: {
        paddingVertical: 20,
        fontSize: 18,
        // fontFamily: Constants.LIST_FONT_FAMILY
    }
});

export default VoucherDetails;