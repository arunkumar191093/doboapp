import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Divider, CheckBox, Button, Icon } from 'react-native-elements';
import * as Constants from '../../../services/Constants';
import RazorpayCheckout from 'react-native-razorpay';
import { getOrderId, capturePayment } from '../../../services/paymentApi';
import Loader from '../../Common/Loader';
import { GetUserProfile } from '../../../services/Api';
import IconComponent from '../../Common/IconComponent';
import { ImageConst } from '../../../services/ImageConstants';
import RazorIcon from '../../../assets/images/dobo-app-icon3.png'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loadingActions from '../../../actions/isLoading'
import { roundToTwoDecimalPlaces } from '../../../services/Helper';

class BuyVoucher extends Component {

    detalis = {};
    userProfileDetails = {};
    data = {};
    couponCode = '';
    paymentSuccessData = {};
    state = {
        loading: false,
        successfullPayment: false,
        failPayment: false,
        order_Id: 0
    }
    constructor(props) {
        super(props);
        this.onRazorpayHandler = this.onRazorpayHandler.bind(this);
        this.details = this.props.navigation.getParam('details');
        this.data = this.props.navigation.getParam('data');
        this.couponCode = this.props.navigation.getParam('couponCode');
    }

    async componentDidMount() {
        await this.setUserProfile()
        console.log("details>>>>", this.details);
        console.log("total>>>>", this.data.AmountToPay);
        //this.getOrderId();
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdate>>>', this.props.isLoadingState)
        if (this.props.isLoadingState == true) {
            console.log('IsLoading Action Has Changed')
            this.props.actions.changeLoadingState(false)
        }
    }
    async setUserProfile() {
        let response = await GetUserProfile()
        if (response.status == 200) {
            let userProfile = response.responseJson
            let jsonUserProfile = JSON.parse(userProfile)
            this.userProfileDetails = jsonUserProfile
            console.log('Userprofile>>>', jsonUserProfile)
        }
    }

    async getOrderId() {
        //this.startLoading();
        console.log('this.details',this.details)
        let data = {
            "Amount": (this.data.AmountToPay) * 100,
            "Currency": "INR",
            "Reciept": Date.now(),
            "Payment_Capture": 1,
            "EntityId": this.details.id,
            "EntityType": 0,
            "CouponCode": this.couponCode
        }

        let response = await getOrderId(data);
        if (response.status == 200) {
            this.stopLoading();
            let res = JSON.parse(response.responseJson);
            console.log('getOrderIdData>>>', res)
            console.log("order>>>", (this.data.AmountToPay * 100).toString());
            console.log('userProfileDetails', this.userProfileDetails)
            this.setState({ order_Id: res.attributes.id })
            let options = {
                description: 'Credits towards consultation',
                image: 'https://retailer-dobo.app/assets/images/dobologo.png',
                // image: 'https://i.imgur.com/3g7nmJC.png',
                currency: 'INR',
                key: 'rzp_test_pfVlnju821oXsT',
                amount: (this.data.AmountToPay * 100).toString(),
                name: this.details.name,
                order_id: res.attributes.id,//Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.    
                // order_id: 'order_EQ8eLjIYPjsTvj',//Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.    
                prefill: {
                    email: this.userProfileDetails.email,
                    contact: this.userProfileDetails.phoneNumber,
                    name: this.userProfileDetails.name
                },
                theme: { color: Constants.DOBO_RED_COLOR }
            }
            RazorpayCheckout.open(options).then((data) => {
                console.log('RazorpayCheckoutData>>>', data)
                // handle success
                // alert(`Success: ${data.razorpay_payment_id}`);
                let paymentId = data.razorpay_payment_id;
                this.callSuccessApi(paymentId);
            }).catch((error) => {
                console.log('RazorpayCheckoutDataError>>>', error)
                // this.setState({ failPayment: true })
                this.callErrorApi(this.state.order_Id);
                // handle failure
                //alert(`Error: ${error.code} | ${error.description}`);
            });

        }
        else {
            //TODO Handle the error condition to show some default Error View

        }

    }

    async callSuccessApi(paymentId) {
        this.startLoading();
        let data = {
            "PaymentId": paymentId
        }
        let { actions } = this.props;
        let response = await capturePayment(data);
        if (response.status == 200) {
            let paymentJsonData = response.responseJson;
            let jsonPaymentData = JSON.parse(paymentJsonData)
            this.paymentSuccessData = jsonPaymentData;
            this.stopLoading();
            this.setState({ successfullPayment: true })
            console.log("callSuccessApiresponse>>>", jsonPaymentData);
            //this.props.navigation.navigate('Home')

        }
        else {
            //TODO Handle the error condition to show some default Error View

        }
        actions.changeLoadingState(true)
    }

    async callErrorApi(orderId) {
        this.startLoading();
        let data = {
            "orderId": orderId
        }
        let response = await capturePayment(data);
        if (response.status == 200) {
            let paymentJsonData = response.responseJson;
            this.stopLoading();
            this.setState({ failPayment: true })
            console.log("callErrorApiresponse>>>", paymentJsonData);
            //this.props.navigation.navigate('Home')

        }
        else {
            //TODO Handle the error condition to show some default Error View

        }

    }
    onSuccessClickHandler = () => {
        // this.props.navigation.goBack();
        //this.props.navigation.popToTop()
        this.props.navigation.navigate('GiftVoucherTab')
    }

    onFailClickHandler = () => {
        //  this.props.navigation.pop();
        //this.props.navigation.navigate('GiftVoucherTab')
    }
    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false })
    }

    onRazorpayHandler = () => {
        this.getOrderId();
        // var options = {
        //     description: 'Credits towards consultation',
        //     image: 'https://i.imgur.com/3g7nmJC.png',
        //     currency: 'INR',
        //     key: 'rzp_test_pfVlnju821oXsT',
        //     amount: '1200',
        //     name: 'Acme Corp',
        //     order_id: 'order_EO3VjAAiG41QhY',//Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.    
        //     prefill: {
        //         email: 'gaurav.kumar@example.com',
        //         contact: '9191919191',
        //         name: 'Gaurav Kumar'
        //     },
        //     theme: { color: '#53a20e' }
        // }
        // RazorpayCheckout.open(options).then((data) => {
        //     // handle success
        //     alert(`Success: ${data.razorpay_payment_id}`);
        // }).catch((error) => {
        //     // handle failure
        //     alert(`Error: ${error.code} | ${error.description}`);
        // });
    }

    render() {
        // let AmountToPay = (this.details.amount) - (this.details.amount * (this.details.discount / 100));
        let AmountToPay = roundToTwoDecimalPlaces(this.data.AmountToPay)
        let Discount = roundToTwoDecimalPlaces((this.details.amount * (this.data.DiscountUpdate / 100)));
        let mediaURL = this.details.retailer && this.details.retailer.voucherBanner && this.details.retailer.voucherBanner.indexOf('http') > -1 ? this.details.retailer.voucherBanner : Constants.imageResBaseUrl + this.details.retailer.voucherBanner
        return (
            <View style={{ flex: 1 }}>
                <Loader
                    loading={this.state.loading}
                />
                <Image
                    style={{ width: '100%', height: '40%' }}
                    source={{ uri: mediaURL }}
                    resizeMode='stretch'
                />
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={styles.voucherDetailsText1}>Discount</Text>
                            <Text style={styles.voucherDetailsValue}>{'\u20B9'} {Discount}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={styles.voucherDetailsText1}>Amount to pay</Text>
                            <Text style={styles.voucherDetailsValue}>{'\u20B9'} {AmountToPay}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: '#D3FFE8', marginTop: '5%' }}>
                    <Text style={{ padding: '2%', textAlign: 'center', color: '#48BE7A' }}>10% additional discount applied via coupon</Text>
                </View>
                <View style={{ marginTop: '2%' }}>
                    <Text style={{ fontSize: 18, padding: 20 }}>Payment Method</Text>
                </View>
                <View style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CEDCCE",
                }}
                />
                <TouchableOpacity onPress={this.onRazorpayHandler}>
                    <View style={{ flexDirection: 'row', }}>
                        {/* <TouchableOpacity onPress={this.onRazorpayHandler}> */}
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <IconComponent
                                name={ImageConst['rezorpay-icon']}
                                size={50}
                                style={styles.categoryImage} />
                            {/* <Image
                                style={{ width: '12%', height: '80%', margin: 20, borderRadius: 10 }}
                                source={{ uri: 'https://i.imgur.com/3g7nmJC.png' }}
                            /> */}
                            <Text style={{ padding: '6%', fontSize: 16, fontFamily: Constants.LIST_FONT_FAMILY }}>Razorpay</Text>
                        </View>

                        <View style={{ right: 0, marginRight: 20, marginTop: '5%' }}>
                            <Icon name="chevron-right" type='material-community' color="black"></Icon>
                        </View>
                        {/* </TouchableOpacity> */}
                    </View >
                </TouchableOpacity>
                <View style={{
                    marginTop: '1%',
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CEDCCE",
                }}
                />
                {/* <View>
                    <Text style={{ textAlign: 'right', fontSize: 16, padding: 15, color: 'red', fontFamily: Constants.LIST_FONT_FAMILY }}>CHANGE PAYMENT METHOD</Text>
                </View> */}
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={this.state.successfullPayment}
                    onRequestClose={() => { console.log('close modal') }}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY, color: 'green', fontSize: 15, top: 10 }}>CONGRATS</Text>
                            <Image
                                style={{ height: '40%', width: '40%' }}
                                source={require('../../../assets/images/successfully-completed.png')}
                            />
                            <View style={{}}>
                                <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY, }}>Amount: {this.data.AmountToPay}</Text>
                                <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY, }}>Code: {this.paymentSuccessData.code}</Text>
                            </View>

                            <TouchableOpacity style={{ padding: 10, }} onPress={() => {
                                this.setState({
                                    successfullPayment: false
                                })
                                this.onSuccessClickHandler()
                            }}>
                                <View style={{}}>
                                    <Text style={{ fontFamily: Constants.BOLD_FONT_FAMILY }}>OK</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={this.state.failPayment}
                    onRequestClose={() => { console.log('close modal') }}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY, color: 'red', fontSize: 15, top: 10 }}>FAIL</Text>
                            <Image
                                style={{ height: '25%', width: '25%' }}
                                source={require('../../../assets/images/close.png')}
                            />
                            <TouchableOpacity style={{ padding: 10, bottom: 15 }} onPress={() => {
                                this.setState({
                                    failPayment: false
                                })
                                this.onFailClickHandler()
                            }}>
                                <View style={{}}>
                                    <Text style={{ fontFamily: Constants.BOLD_FONT_FAMILY }}>OK</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            </View >
        );
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
    voucherDetailsText1: {
        fontSize: 16,
        paddingLeft: 20,
        paddingTop: 20,
        fontFamily: Constants.LIST_FONT_FAMILY
    },
    voucherDetailsValue: {
        fontSize: 16,
        paddingLeft: 20,
        paddingTop: 5
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        height: 200,
        width: 200,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
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

export default connect(mapStateToProps, mapDispatchToProps)(BuyVoucher);