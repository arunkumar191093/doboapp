import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    ImageBackground,
    StyleSheet,
    ScrollView,
    Modal,
    TouchableOpacity,

} from 'react-native';
import { Button } from 'react-native-elements';
import Barcode from 'react-native-barcode-builder';
import * as Constants from '../../../services/Constants';
import { vouchersDetails } from '../../../services/VoucherApi';
import Loader from '../../Common/Loader';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loadingActions from '../../../actions/isLoading'

class RedeemVoucher extends Component {

    state = {
        loading: false,
        redeemTrue: false
    }
    constructor(props) {
        super(props);
        this.redValue = this.props.navigation.getParam('redValue');
        this.onRedeemClickHandler = this.onRedeemClickHandler.bind(this);

    }

    onRedeemClickHandler = () => {
        this.props.navigation.navigate('GiftVoucherTab')
    }

    onMyRedeemDonClickHandler = async () => {
        this.startLoading();
        let { actions } = this.props;
        let data = {
            id: this.redValue.id,
            endTime: this.redValue.endTime,
            code: this.redValue.code,
            sold: this.redValue.sold,
            soldDate: this.redValue.soldDate,
            redeemed: true,
            redeemDate: this.redValue.redeemDate,
            shared: this.redValue.shared,
            shareLink: this.redValue.shareLink,
            userProfile: this.redValue.userProfile,
            userProfileRedeemed: this.redValue.userProfileRedeemed
        };
        let response = await vouchersDetails(data);
        console.log('vouchersDetails>>>', response.status)
        if (response.status === 204) {
            this.stopLoading();
            this.setState({ redeemTrue: true })
        } else {
            console.log('onMyRedeemDonClickHandler not Updated')
            this.stopLoading();
        }
        actions.changeLoadingState(true)
    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false });
    }

    renderTermsView = () => {
        return (
            <View style={{ flex: 1, marginTop: "3%", marginLeft: '6%', }}>
                <Text style={styles.termText}>Terms and Conditions</Text>
                <View style={{ flexDirection: 'row', marginTop: '1%' }}>
                    <ImageBackground
                        style={styles.circle}
                        resizeMode='contain'>
                    </ImageBackground>
                    <Text style={styles.textStyle}>{this.redValue.voucherPolicy}</Text>
                </View>

            </View>
        );

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Loader
                    loading={this.state.loading}
                />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <Image
                            style={{ height: 200, width: '100%' }}
                            source={{ uri: Constants.imageResBaseUrl + this.redValue.voucherBanner }}
                            resizeMode='stretch'>
                        </Image>
                    </View>
                    <View style={{ marginVertical: '10%', height: '15%' }}>
                        <Text style={{
                            textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY,
                            fontSize: Constants.LIST_FONT_SIZE_ADDRESS, color: Constants.DOBO_GREY_COLOR
                        }}
                        >
                            {`Use the below voucher ID or Barcode to redeem the \nvoucher`}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{
                            textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY,
                            fontSize: Constants.LIST_FONT_HEADER_SIZE, color: Constants.DOBO_GREY_COLOR
                        }}>
                            Voucher ID
                        </Text>
                        <Text style={{
                            textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY,
                            fontSize: 16, color: 'black', marginTop: '1%'
                        }}>
                            {this.redValue.code}
                        </Text>
                        <View style={{ marginLeft: '25%', marginRight: '25%', marginTop: '3%' }}>
                            <Barcode
                                height={50}
                                value={this.redValue.code}
                                format="CODE128"
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: '12%', flex: 1 }}>
                        {this.renderTermsView()}
                    </View>
                </ScrollView>
                <View style={{
                    position: "absolute", bottom: 0, width: "100%", paddingLeft: '20%', paddingRight: '20%'
                }}>
                    <Button
                        title='DONE'
                        type="outline"
                        buttonStyle={styles.myRedeemDonButton}
                        titleStyle={{ fontSize: 16, color: 'white' }}
                        onPress={() => this.onMyRedeemDonClickHandler()} />
                </View>
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={this.state.redeemTrue}
                    onRequestClose={() => { console.log('close modal') }}>
                    <View style={styles.modalBackground}>
                        <View style={styles.activityIndicatorWrapper}>
                            <Text style={{ fontFamily: Constants.BOLD_FONT_FAMILY, color: 'green' }}>SUCCESSFUL</Text>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    redeemTrue: false
                                })
                                this.onRedeemClickHandler()
                            }}>
                                <View style={{}}>
                                    <Text>OK</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    circle: {
        // marginTop: '2%',
        alignSelf: 'center',
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        backgroundColor: Constants.DOBO_RED_COLOR
    },
    textStyle: {
        marginLeft: '2%',
        marginRight: '3%',
        // paddingBottom: '2%',
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 12,
    },
    myRedeemDonButton: {
        width: '100%',
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: 'red',
        justifyContent: 'center',
        bottom: 5
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
        height: 150,
        width: 150,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    termText: {
        color: Constants.LIGHT_GREY_COLOR,
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 16,
        fontWeight: 'bold'
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(RedeemVoucher);
