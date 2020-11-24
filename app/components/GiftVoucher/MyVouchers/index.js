import React, { Component } from 'react'
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { Button } from 'react-native-elements';
import * as Constants from '../../../services/Constants';
import TermsList from './TermsList'
import VoucherList from './VoucherList';
import NoNetwork from '../../Common/NoNetwork';
import { GetVoucherByUser } from '../../../services/VoucherApi';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loadingActions from '../../../actions/isLoading'

class MyVouchers extends Component {

    state = {
        refreshing: false,
        loading: false,
        byVoucherData: [],
        isByVoucherLoaded: false,
        // image: 'https://source.unsplash.com/1024x768/?nature',
        // termsText: [{
        //     id: '1',
        //     text: "This voucher is valid until six months from the date of issurance, and can be redeemed at any Shoppers Stop shop in india.",
        // }, {
        //     id: '2',
        //     text: "This voucher is non-refundable and cannot be exchanged with any other voucher."
        // }

        // ],
        // listData: [
        //     {
        //         id: '1',
        //         image: 'https://source.unsplash.com/1024x768/?nature',
        //         name: 'Shoppers Stop',
        //         value: '1000',
        //         off: '5%'
        //     },
        //     {
        //         id: '2',
        //         image: 'https://source.unsplash.com/1024x768/?water',
        //         name: 'Shoppers Stop',
        //         value: '2000',
        //         off: '10%'
        //     },
        //     {
        //         id: '3',
        //         image: 'https://source.unsplash.com/1024x768/?girl',
        //         name: 'Shoppers Stop',
        //         value: '3000',
        //         off: '15%'
        //     },
        //     {
        //         id: '4',
        //         image: 'https://source.unsplash.com/1024x768/?tree',
        //         name: 'Shoppers Stop',
        //         value: '5000',
        //         off: '20%'
        //     },
        //     {
        //         id: '5',
        //         image: 'https://source.unsplash.com/1024x768/?nature',
        //         name: 'Shoppers Stop',
        //         value: '3000',
        //         off: '15%'
        //     },
        //     {
        //         id: '6',
        //         image: 'https://source.unsplash.com/1024x768/?water',
        //         name: 'Shoppers Stop',
        //         value: '2000',
        //         off: '10%'
        //     },
        //     {
        //         id: '7',
        //         image: 'https://source.unsplash.com/1024x768/?girl',
        //         name: 'Shoppers Stop',
        //         value: '5000',
        //         off: '20%'
        //     },
        //     {
        //         id: '8',
        //         image: 'https://source.unsplash.com/1024x768/?tree',
        //         name: 'Shoppers Stop',
        //         value: '1000',
        //         off: '5%'
        //     },

        // ]
    }
    constructor(props) {
        super(props);
        this.onSendClickHandler = this.onSendClickHandler.bind(this);
        this.onRedeemClickHandler = this.onRedeemClickHandler.bind(this);
        this.onVoucherClickHandler = this.onVoucherClickHandler.bind(this);
    }

    onSendClickHandler = () => {

    }

    onRedeemClickHandler = () => {

    }

    async componentDidMount() {
        await this.callGetVoucherByUser();
        this.unsubscribe = this.props.navigation.addListener('didFocus', () => {
            console.log('Voucher selected')
            this.props.actions.changeLoadingState(false)
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdateMyvoucher>>>', this.props.isLoadingState)
        if (this.props.isLoadingState == true) {
          console.log('IsLoading Action Has Changed')
          this.props.actions.changeLoadingState(false)
           await this.callGetVoucherByUser();

        }
      }

    async callGetVoucherByUser() {
        this.startLoading();
        let response = await GetVoucherByUser();
        console.log('callGetVoucherByUser', response)
        let voucherImageCard = [];
        if (response.status === 200) {
            let voucherByUser = response.responseJson;
            this.setState({ voucherData: JSON.parse(voucherByUser) });
            let jsonVoucherData = JSON.parse(voucherByUser);
            jsonVoucherData.forEach((Object1, i) => {
                let Object3 = Object1.voucherDetails;
                Object3.forEach((Object2, j) => {
                    let voucherImageCardObject = Object2;
                    voucherImageCardObject.iconURL = Object1.retailer.iconURL;
                    voucherImageCardObject.voucherPolicy = Object1.voucherPolicy;
                    voucherImageCardObject.startTime = Object1.startTime;
                    voucherImageCardObject.endTime = Object1.endTime;
                    voucherImageCardObject.amount = Object1.amount;
                    voucherImageCardObject.discount = Object1.discount;
                    voucherImageCardObject.quantity = Object1.quantity;
                    voucherImageCardObject.voucherBanner = Object1.retailer.voucherBanner;
                    voucherImageCardObject.name = Object1.retailer.name;
                    voucherImageCardObject.validity = Object1.validity;
                    voucherImageCard.push(voucherImageCardObject)
                })
            });
            this.setState({
                refreshing: false
            });
            console.log('voucherImageCard', voucherImageCard)
            this.stopLoading();
        } else {
            this.stopLoading();
        }
        //console.log(voucherImageCard)
        this.setState({ byVoucherData: voucherImageCard, isByVoucherLoaded: true })
    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false });
    }

    onVoucherClickHandler = (item) => {
        console.log('My Voucher Details Clicked>>>', item)
        this.props.navigation.navigate('Voucherdetails', { val: item });
    }

    onRefresh = async () => {
        this.setState({
            refreshing: true
        });
        await this.callGetVoucherByUser();
    }

    renderVoucherDetails = () => {
        console.log(this.state.refreshing)
        if (this.state.isByVoucherLoaded) {
            return (
                <View style={{ height: '100%', width: '100%' }}>
                    <VoucherList
                        data={this.state.byVoucherData}
                        onCurrentItemClick={(item) => this.onVoucherClickHandler(item)}
                        onRefresh = {this.onRefresh}
                        isRefreshing = {this.state.refreshing}
                    />
                </View>

            )

        } else {
            return (
                <ActivityIndicator
                    size="large"
                    color={Constants.DOBO_RED_COLOR} />
            )
        }
    }



    render() {
        //  console.log('byVoucherData', byVoucherData)
        return (
            <View style={{ flex: 1 }}>
                <NoNetwork />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                 {this.renderVoucherDetails()}
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    congratsText: {
        color: Constants.DOBO_RED_COLOR,
        fontFamily: Constants.BOLD_FONT_FAMILY,
        fontSize: 18,
        textAlign: "center",
        padding: '2%'
    },
    belowText: {
        color: Constants.LIGHT_GREY_COLOR,
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 16,
        textAlign: "center",
    },
    titleText: {
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: Constants.LI,
        fontSize: 12
    },
    valueText: {
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: 'black',
        fontSize: 16,
        paddingTop: '2%'
    },
    termText: {
        color: Constants.LIGHT_GREY_COLOR,
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 16,
        fontWeight: 'bold'
    },
    buyVoucherButton: {
        width: '80%',
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: 'red',
        justifyContent: 'center',
    },
    sendButton: {
        width: '90%',
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: 'white',
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

export default connect(mapStateToProps, mapDispatchToProps)(MyVouchers);