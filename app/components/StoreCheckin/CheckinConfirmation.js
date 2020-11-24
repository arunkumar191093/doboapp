import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Image } from 'react-native';
import * as Constants from '../../services/Constants'
import { GetStoreById } from '../../services/StoreApi';
import moment from 'moment';
import Loader from '../Common/Loader';
import { isObjectEmpty } from '../../services/Helper'
import NoDataFound from '../Common/NoDataFound';
import { setCheckinInfo } from '../../services/Helper';
import ModalPopUp from '../Common/ModalPopUp';

class CheckinConfirmation extends Component {
    checkinDetail = {}
    couponDetail = {}
    constructor(props) {
        super(props);
        this.checkinDetail = this.props.navigation.getParam('listVal')
        this.state = {
            storeDetails: {},
            loader: true
        }
    }

    componentDidMount() {
        this.getStoreData()
        this.couponDetail = JSON.parse(this.checkinDetail.coupon);
        const { storeCheckIn } = this.couponDetail;
        this.setCheckInInfoInStorage(storeCheckIn);
    }

    setCheckInInfoInStorage = async (data) => {
        await AsyncStorage.setItem('storeCheckInData', JSON.stringify(data));
    }

    getStoreData = async () => {
        let storeId = this.checkinDetail.storeId;
        this.startLoading()
        let response = await GetStoreById(storeId)
        if (response.status == 200) {
            let storeDetails = JSON.parse(response.responseJson)
            console.log('checkin store details', storeDetails)
            this.setState({ storeDetails: storeDetails })
            this.updatedCheckinData(storeDetails);
        }
        this.stopLoading()
    }

    onCloseClickHandler = () => {
        this.props.navigation.goBack();
    };

    onExploreStore = () => {
        this.props.navigation.navigate('StorePage', {
            listVal: this.state.storeDetails, isStoreCheckin: true, onClose: () => { }
        })
    }

    startLoading = () => {
        this.setState({ loader: true })
    }

    stopLoading = () => {
        this.setState({ loader: false })
    }

    updatedCheckinData = (storeDetails) => {
        let { location: { coordinates: [lng, lat] }, retailer, address, description } = storeDetails;
        const currentTime = (new Date()).getTime(); //time in miliseconds
        let storeInfo = {
            storeId: storeDetails.id,
            location: {
                lat: lat,
                lng: lng
            },
            checkinAt: currentTime,
            retailer,
            address,
            description
        };
        setCheckinInfo(storeInfo);
    }

    renderConfirmationPage = () => {
        const { retailer, address, description } = this.state.storeDetails
        console.log('Coupon Details>>', this.couponDetail.discount)
        let discount = this.couponDetail.discount
        let expiryDate = moment(this.couponDetail.endTime).format("MMMM DD, YYYY")
        let message = `Enjoy ${discount}% off on Gift Vouchers in Dobo.App. Valid once per user. Expires ${expiryDate}`
        let imageURL = retailer != null ? (Constants.imageResBaseUrl + retailer.iconURL) : Constants.DEFAULT_STORE_ICON
        return (
            <ModalPopUp canClose={true} showClose={false} onClose={this.onCloseClickHandler} >
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ alignSelf: 'center', marginTop: '10%' }}>
                        <Text style={{ fontSize: 22, color: Constants.DOBO_RED_COLOR, alignSelf: 'center', fontFamily: Constants.LIST_FONT_FAMILY }}>Welcome!</Text>
                        <Image style={styles.listImage}
                            source={{ uri: imageURL }} />
                        <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginTop: '10%' }}>
                            <Text style={{ fontSize: 18, color: "#5E7A90", fontWeight: '700', fontFamily: Constants.LIST_FONT_FAMILY }}>{description.trim()}</Text>
                            <Text numberOfLines={3} style={{ fontSize: 12, color: "#5E7A90", textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY, paddingTop: 12 }}>
                                {(address.address1 || '') + '\n' + (address.address2 || '')}
                            </Text>
                        </View>
                    </View>
                    <View style={{ padding: '10%' }}>
                        <Text style={{ fontSize: 16, textAlign: 'center', color: Constants.DOBO_RED_COLOR, fontFamily: Constants.BOLD_FONT_FAMILY }}>Congratulations!</Text>
                        <Text style={{ fontSize: 14, textAlign: 'center', fontStyle: 'italic', color: Constants.DOBO_RED_COLOR, fontFamily: Constants.LIST_FONT_FAMILY, marginTop: '5%' }}>{message}</Text>
                    </View>
                    <View style={{ marginLeft: 50, marginRight: 50 }}>
                        <Button
                            title='EXPLORE THE STORE'
                            buttonStyle={styles.continueButton}
                            containerStyle={{
                                marginVertical: '10%',
                                borderRadius: 30,
                            }}
                            titleStyle={{ fontSize: 16 }}
                            onPress={() => this.onExploreStore()}
                        />
                    </View>
                </ScrollView>
            </ModalPopUp>
        );
    }

    render() {
        if (this.state.loader) {
            return (
                <Loader
                    loading={true}
                />
            )
        }
        else {
            if (isObjectEmpty(this.state.storeDetails)) {
                return (
                    <NoDataFound
                        message='Something Went Wrong!'
                    />
                )
            }
            else {
                return this.renderConfirmationPage()
            }
        }

    }
}

const styles = StyleSheet.create({
    listImage: {
        width: 90,
        height: 90,
        marginTop: '10%',
        alignSelf: 'center',
    },
    continueButton: {
        borderRadius: 30,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden'
    },
});

export default CheckinConfirmation;
