import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { Alert } from 'react-native';
import { Storecheckins } from '../../services/StoreApi';
import QRCodeScanner from 'react-native-qrcode-scanner';
import NoNetwork from '../Common/NoNetwork';
import * as Constants from '../../services/Constants';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as loadingActions from '../../actions/isLoading'
import { validateLocationFromStore } from '../../services/Helper';

class StoreCheckinQR extends Component {

    static navigationOptions = {
        header: null
    }
    state = {
        isAlertShown: false,
        description: ''
    }
    storeDetails = {}
    constructor(props) {
        super(props);
        this.onCloseClickHandler = this.onCloseClickHandler.bind(this);
        this.onBarcodeRead = this.onBarcodeRead.bind(this);
        this.performStoreCheckin = this.performStoreCheckin.bind(this)
        this.storeDetails = props.navigation.getParam('listVal')
        this.onAlertOkHandler = this.onAlertOkHandler.bind(this);

    }

    componentDidMount = async () => {
        // const granted = await requestCameraPermission();
        // this.setState({
        //     hasCameraPermission: granted
        // });
    }

    onCloseClickHandler = () => {
        this.props.navigation.goBack();
    };

    onBarcodeRead = (e) => {
        this.performStoreCheckin(e.data)
    }

    onAlertOkHandler = () => {
        this.setState({ isAlertShown: false });
        if (!this.state.isAlertShown) {
            this.scanner.reactivate();
        }

    }

    async performStoreCheckin(storeID) {
        let data = { "StoreId": storeID, "CheckInTime": new Date() }
        console.log("DATA>>>", data);
        let { actions } = this.props;
        if (this.storeDetails.store.id == storeID) {
            const [lng, lat] = this.storeDetails.store.location.coordinates
            const coords = {
                lat: lat,
                lng: lng
            }
            const isValid = await validateLocationFromStore(coords); //TODO: use this flag for validation in below IF
            if (isValid) {
                let checkinResponse = await Storecheckins(data)
                console.log('Checkin rsponse>>>', checkinResponse)
                if (checkinResponse.status == 201) {
                    console.log('Store Checkin successfull, Moving to Store Page')
                    let couponDetail = checkinResponse.responseJson;
                    const { storeCheckIn } = couponDetail;
                    let objectValue = { "coupon": couponDetail, "storeId": storeID }
                    console.log('checkinResponse', JSON.parse(checkinResponse.responseJson));
                    // this.props.navigation.navigate('StorePage', {
                    //     listVal: this.storeDetails.store, isStoreCheckin: true, onClose: () => {
                    //         // update your state to open back the camera
                    //         if (this.scanner != null) {
                    //             this.scanner.reactivate()
                    //         }
                    //     }
                    // })
                    this.props.navigation.navigate('CheckinConfirmation', {
                        listVal: objectValue, onClose: () => {
                            // update your state to open back the camera
                            if (this.scanner != null) {
                                this.scanner.reactivate()
                            }
                        }
                    })
                    actions.changeLoadingState(true)
                }
                else {
                    this.handleError();
                }
            }
            else {
                this.handleError(true);
            }
        } else {
            this.handleError();

        }

    }

    handleError = (isLocationErr) => {
        this.setState({ isAlertShown: true });
        Alert.alert(
            'Invalid Store',
            isLocationErr ? 'Please be near to store while checking-in' : 'Invalid Store, Please try again!',
            [
                { text: 'OK', onPress: () => { this.onAlertOkHandler() } },
            ],
            { cancelable: false });
    }

    render() {
        return (
            <View >
                <NoNetwork />
                <View style={{ position: 'absolute', top: 0, zIndex: 10 }}>
                    <TouchableWithoutFeedback onPress={this.onCloseClickHandler} >
                        <View style={{ padding: 10, alignItems: 'flex-start' }}>
                            <Icon name="arrow-back" color="white"></Icon>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{ paddingLeft: '10%', paddingBottom: '15%' }}>
                        <Text style={{ fontSize: 22, marginLeft: '5%', fontFamily: Constants.BOLD_FONT_FAMILY, color: '#fff' }}>{this.storeDetails.store.description}</Text>
                        <Text style={{ fontSize: 22, marginLeft: '5%', fontFamily: Constants.BOLD_FONT_FAMILY, color: '#fff' }}>Check in</Text>
                        <Text style={{ fontSize: 12, paddingLeft: '4%', paddingTop: '5%', fontFamily: Constants.LIST_FONT_FAMILY, color: '#fff' }}>Scan Merchant's QR code to view exclusive offers.</Text>
                    </View>
                </View>
                <View style={{ marginRight: '15%' }}>
                    <QRCodeScanner
                        onRead={this.onBarcodeRead}
                        showMarker={true}
                        ref={(node) => { this.scanner = node }}
                        checkAndroid6Permissions={true}
                        cameraStyle={{
                            height: Constants.SCREEN_HEIGHT,
                        }}
                        markerStyle={{
                            borderColor: Constants.DOBO_RED_COLOR,
                            borderWidth: 2,
                            borderRadius: 10
                        }}
                    />
                </View>


            </View>
        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(StoreCheckinQR);
