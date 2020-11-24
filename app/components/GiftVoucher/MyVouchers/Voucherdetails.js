import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet
} from 'react-native';
import { Button } from 'react-native-elements';
import ShareVoucher from './ShareVoucher';
import * as Constants from '../../../services/Constants';
import moment from 'moment';
import { shareGiftVoucher } from '../../../services/Helper';
import { GetUserProfile } from '../../../services/Api';
import Loader from '../../Common/Loader';

class Voucherdetails extends Component {
    userName = ''
    state = {
        termsText: [],
        isModalVisible: false,
        loading: false
    }
    details = {};
    constructor(props) {
        super(props);
        this.details = this.props.navigation.getParam('val');
        this.onRedeemClickHandler = this.onRedeemClickHandler.bind(this);
        this.onSendClickHandler = this.onSendClickHandler.bind(this);
    }

    componentDidMount() {
        this.getUserProfile()
    }

    getUserProfile = async () => {
        this.startLoading();
        let response = await GetUserProfile()
        if (response.status == 200) {
            let userProfile = response.responseJson
            let jsonUserProfile = JSON.parse(userProfile)
            console.log('Userprofile>>>', jsonUserProfile)

            if (jsonUserProfile != null && jsonUserProfile != undefined) {

                this.userName = jsonUserProfile.name
            }
            this.stopLoading();
        }
    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false });
    }

    onRedeemClickHandler = () => {
        this.props.navigation.navigate('RedeemVoucher', { redValue: this.details })
    }

    onSendClickHandler = async (item) => {

        console.log('onInviteShareClickHandler>>', item)
        const { amount, code, name, endTime } = item

        const shareDetails = {
            amount: amount,
            userName: this.userName,
            code: code,
            brand: name,
            expiryDate: moment(endTime).format("DD MMM YYYY")
        }
        let sharedData = ''
        if (item != undefined) {
            if (item.voucherBanner == null) {
                sharedData = Constants.DEFAULT_STORE_IMAGE
            } else {
                let replaceUrl = item.voucherBanner.replace(/\\/gi, '/')
                sharedData = Constants.baseURL + replaceUrl
            }
            try {
                let result = await shareGiftVoucher(sharedData, shareDetails)
                console.log('shared with App ', result.app)
            } catch (error) {
                console.error('Could not share', error)
            }

        }
    }

    openModal = () => {
        if (this.state.isModalVisible) {
            return (

                <ShareVoucher
                    onModalClose={() => this.setState({ isModalVisible: false })}
                    categoryData={this.state.categories}
                />

            );
        } else {
            return (null);
        }
    }


    render() {
        // console.log('Voucherdetails', this.details.validity)
        //const afterToFormat = moment(this.details.startTime).add(this.details.validity, 'days').calendar();
        const PurchasedDateToFormat = moment(this.details.startTime).format("DD MMM YYYY");
        const ValidToDateToFormat = moment(this.details.endTime).format("DD MMM YYYY");
        //const ValidToDateToFormat = moment(afterToFormat, 'MM/DD/YYYY').format("DD MMM YYYY");
        console.log('MyVoucherDetails', this.details)

        return (
            <View style={{ flex: 1 }}>
                <Loader loading={this.state.loading} />
                <ScrollView style={{ backgroundColor: "#DCF7FF", marginBottom: '14%', flex: 1 }}>
                    <View>
                        <Text style={styles.congratsText}>CONGRATULATIONS!</Text>
                        <Text style={styles.belowText}>Your voucher is ready to use.</Text>
                        <View style={{ margin: '3%' }}>
                            <Image
                                style={{ height: 200, width: '100%' }}
                                source={{ uri: Constants.imageResBaseUrl + this.details.voucherBanner }}
                                resizeMode='stretch'>
                            </Image>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View>
                                <View style={{ flexDirection: "column", marginLeft: '15%' }}>
                                    <Text style={styles.titleText}>Purchase ID</Text>
                                    <Text style={styles.valueText}>{this.details.code}</Text>
                                </View>
                                <View style={{ flexDirection: "column", marginTop: '15%', marginLeft: '15%' }}>
                                    <Text style={styles.titleText}>Valid from</Text>
                                    <Text style={styles.valueText}>{PurchasedDateToFormat}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>

                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "column" }}>
                                    <Text style={styles.titleText}>Purchased on</Text>
                                    <Text style={styles.valueText}>{PurchasedDateToFormat}</Text>
                                </View>
                                <View style={{ flexDirection: "column", marginTop: '15%' }}>
                                    <Text style={styles.titleText}>Valid to</Text>
                                    <Text style={styles.valueText}>{ValidToDateToFormat}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            marginTop: '8%',
                            height: 1,
                            width: "100%",
                            backgroundColor: "#CEDCCE",
                        }} />
                        <View style={{ marginTop: "2%", marginLeft: '6%', flex: 1 }}>
                            <Text style={styles.termText}>Terms and Conditions</Text>
                            <Text style={styles.textStyle}>{this.details.voucherPolicy}</Text>
                            {/* <TermsList data={this.state.details}></TermsList> */}
                        </View>

                    </View>
                    {this.openModal()}
                </ScrollView>
                <View style={{
                    position: "absolute", bottom: 0, width: "100%",
                    borderTopColor: Constants.DOBO_GREY_COLOR, borderTopWidth: 1

                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, paddingTop: '2%', paddingBottom: '2%' }}>
                            <Button
                                title='GIFT TO SOMEONE'
                                type="outline"
                                buttonStyle={styles.sendButton}
                                titleStyle={{ fontSize: 12, color: 'red', padding: '3%' }}
                                onPress={() => this.onSendClickHandler(this.details)} />
                        </View>
                        {
                            this.details.redeemed ?
                                <View style={{ flex: 1, paddingTop: '2%', paddingBottom: '2%' }}>
                                    <Button
                                        disabled={true}
                                        title='REDEEMED'
                                        type="outline"
                                        buttonStyle={styles.buyVoucherButton}
                                        titleStyle={{ fontSize: 12, color: 'white' }}
                                        onPress={() => this.onRedeemClickHandler()} />
                                </View>
                                :
                                <View style={{ flex: 1, paddingTop: '2%', paddingBottom: '2%' }}>
                                    <Button
                                        title='REDEEM NOW'
                                        type="outline"
                                        buttonStyle={styles.buyVoucherButton}
                                        titleStyle={{ fontSize: 12, color: 'white' }}
                                        onPress={() => this.onRedeemClickHandler()} />
                                </View>
                        }

                    </View>
                </View>
            </View>
        );
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
    },
    textStyle: {
        marginLeft: '2%',
        marginRight: '3%',
        paddingBottom: '2%',
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 12
    }
});

export default Voucherdetails;