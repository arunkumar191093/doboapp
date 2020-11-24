import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import StoreCheckinListComponent from './StoreCheckinListComponent';
import { GetStoresUsingGPS } from '../../services/StoreApi';
import Loader from '../Common/Loader';
import * as Constants from '../../services/Constants';
import NoNetwork from '../Common/NoNetwork';
import IconComponent from '../Common/IconComponent';
import { ImageConst } from '../../services/ImageConstants';

class StoreCheckin extends Component {
    state = {
        loading: false,
        longitude: 0,
        latitude: 0,
        storeList: [],
    }
    constructor(props) {
        super(props);
        this.state.longitude = this.props.navigation.getParam('longitude');
        this.state.latitude = this.props.navigation.getParam('latitude');
        this.onCloseClickHandler = this.onCloseClickHandler.bind(this);
        this.currentListItemClick = this.currentListItemClick.bind(this);
        this.locationAddress = this.props.navigation.getParam('locationAddress');
    }

    onCloseClickHandler = () => {
        this.props.navigation.goBack();
    };

    currentListItemClick(item) {
        console.log('StoreCheckinDetails>>', JSON.stringify(item))
        this.props.navigation.navigate('StoreCheckinDetails', { listVal: item });
    }

    async componentDidMount() {
        this.startLoading();
        await this.getStoresList()

    }

    async getStoresList() {
        let body = {
            "Latitude": this.state.latitude,
            "Longitude": this.state.longitude,
            "Distance": 35000
        }
        let response = await GetStoresUsingGPS(body)
        if (response.status == 200) {
            let storeListData = response.responseJson
            //Important step to convert to object or else it crashes
            let jsonStroreList = JSON.parse(storeListData)
            this.setState({ storeList: jsonStroreList })
        }
        this.stopLoading();

    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#E5F7FF' }}>
                <NoNetwork />
                <Loader
                    loading={this.state.loading}
                />
                <TouchableWithoutFeedback>
                    <TouchableOpacity style={{ right: '5%', position: 'absolute', top: '2%' }} onPress={this.onCloseClickHandler} >
                        <Icon name="close-circle" type="material-community" color={Constants.DOBO_RED_COLOR} size={30}></Icon>
                    </TouchableOpacity>
                </TouchableWithoutFeedback>
                <View style={{ alignSelf: 'center', marginTop: '10%' }}>
                    <Text style={{ fontSize: 18, color: "#5E7A90", alignSelf: 'center', fontFamily: Constants.LIST_FONT_FAMILY }}>YOU ARE IN</Text>
                    <IconComponent
                        name={ImageConst['mall-icon']}
                        size={80}
                        style={styles.listImage} />
                    {/* <Text style={{ fontSize: 18, color: "#5E7A90", alignSelf: 'center', marginTop: 10 }}>{this.state.name}</Text> */}
                    <Text numberOfLines={3} style={styles.currentLocationText}>{this.locationAddress}</Text>

                </View>
                <View style={{ backgroundColor: 'white', flex: 1 }}>
                    <View style={{ paddingVertical: '5%' }}>
                        <Text style={{ fontSize: 18, color: "#5E7A90", alignSelf: 'center', fontFamily: Constants.LIST_FONT_FAMILY }}>CHECK-IN TO YOUR FAVOURITE STORE</Text>
                    </View>
                    <View style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: "#CEDCCE",
                    }} />
                    <View style={{ flex: 1 }}>
                        <StoreCheckinListComponent data={this.state.storeList} onCurrentItemClick={(item) => this.currentListItemClick(item)} />
                    </View>
                </View>
            </View>
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
        marginTop: 10,
        alignSelf: 'center'
    },
    currentLocationText: {
        fontSize: 12,
        color: "#5E7A90",
        textAlign: 'center',
        padding: '5%',
        marginTop: '2%',
        fontFamily: Constants.LIST_FONT_FAMILY
    }
});

export default StoreCheckin;
