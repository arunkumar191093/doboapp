import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { Dimensions, Image } from 'react-native';
import * as Constants from '../../services/Constants'
import NoNetwork from '../Common/NoNetwork';
import IconComponent from '../Common/IconComponent';
import { ImageConst } from '../../services/ImageConstants';

const { width, height } = Dimensions.get('window');
class StoreCheckinDetails extends Component {
    storeDetails = {}
    constructor(props) {
        super(props);
        this.storeDetails = this.props.navigation.getParam('listVal')
        this.onCloseClickHandler = this.onCloseClickHandler.bind(this);
        this.currentListItemClick = this.currentListItemClick.bind(this);
        this.onCheckinHandler = this.onCheckinHandler.bind(this);
        this.locationAddress = this.props.navigation.getParam('locationAddress');;
    }

    onCloseClickHandler = () => {
        this.props.navigation.goBack();
    };

    currentListItemClick(item) {
        console.log("item>>", item);
        this.props.navigation.navigate('StoreCheckinDetails');
    }

    onCheckinHandler = () => {
        this.props.navigation.navigate('StoreCheckinQR', { listVal: this.storeDetails });
    }

    render() {
        let mediaURL = this.storeDetails.store && this.storeDetails.store.retailer && this.storeDetails.store.retailer.iconURL && this.storeDetails.store.retailer.iconURL.indexOf('http') > -1 ? this.storeDetails.store.retailer.iconURL : Constants.imageResBaseUrl + this.storeDetails.store.retailer.iconURL
        return (
            <ScrollView style={{ flex: 1 }}>
                <NoNetwork />
                <TouchableWithoutFeedback>
                    <TouchableOpacity style={{ right: '5%', position: 'absolute', top: '2%' }} onPress={this.onCloseClickHandler} >
                        <Icon name="close-circle" type="material-community" color={Constants.DOBO_RED_COLOR} size={30}></Icon>
                    </TouchableOpacity>
                </TouchableWithoutFeedback>
                <View style={{ alignSelf: 'center', marginTop: '20%' }}>
                    <Text style={{ fontSize: 18, color: "#5E7A90", alignSelf: 'center', fontFamily: Constants.LIST_FONT_FAMILY }}>YOU ARE IN</Text>
                    <Image style={styles.listImage}
                        source={{ uri: mediaURL || Constants.DEFAULT_STORE_ICON }} />
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center', marginTop: '10%' }}>
                        <Text style={{ fontSize: 18, color: "#5E7A90", fontWeight: 'bold', fontFamily: Constants.LIST_FONT_FAMILY }}>{this.storeDetails.store.description.trim()}</Text>
                        <Text numberOfLines={3} style={{ fontSize: 12, color: "#5E7A90", textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY }}>
                            {(this.storeDetails.store.address.address1 || '') + '\n' + (this.storeDetails.store.address.address2 || '')}
                        </Text>
                    </View>
                </View>
                <View style={{ padding: '10%' }}>
                    <Text style={{ fontSize: 18, color: "#5E7A90", textAlign: 'center', fontStyle: 'italic', color: Constants.DOBO_RED_COLOR, fontFamily: Constants.LIST_FONT_FAMILY }}>Get exclusive offers!</Text>
                    <Text style={{ fontSize: 18, color: "#5E7A90", textAlign: 'center', fontStyle: 'italic', color: Constants.DOBO_RED_COLOR, fontFamily: Constants.LIST_FONT_FAMILY }}>Unlock 5% discount coupon on your check-in!</Text>
                </View>
                <View style={{ alignSelf: 'center' }}>
                    {/* <Icon
                        name="room"
                        type="material-icons"
                        color={Constants.DOBO_RED_COLOR}
                        size={50}
                        style={styles.iconImage} /> */}
                    <IconComponent
                        name={ImageConst["checkin-pin"]}
                        size={30}
                    />
                    {/* <Image
                        style={{ width: 30, height: 30 }}
                        resizeMode="contain"
                        source={require('../../assets/images/checkin-pin.png')}
                    /> */}
                </View>
                <View style={{ marginLeft: 50, marginRight: 50 }}>
                    <Button
                        title='CHECK-IN'
                        buttonStyle={styles.continueButton}
                        containerStyle={{
                            marginVertical: '5%',
                            borderRadius: 30
                        }}
                        titleStyle={{ fontSize: 16 }}
                        onPress={() => this.onCheckinHandler()}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    StoreView: {
        alignItems: "center"
    },
    category: {
        flexDirection: "row",
        width: '100%',
        backgroundColor: '#F9EEED'
    },
    listImage: {
        width: 80,
        height: 80,
        marginTop: '10%',
        alignSelf: 'center',
        borderRadius: 10
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

export default StoreCheckinDetails;
