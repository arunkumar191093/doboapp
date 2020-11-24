import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, ScrollView, Platform } from 'react-native'
import { Icon, Button, SearchBar } from 'react-native-elements'
import * as Constants from '../../services/Constants'
import SavedAddressList from './SavedAddressList'
import { getSavedAddress, setSavedAddress, saveAddress } from '../../services/Helper'
import { connect } from 'react-redux';
import * as locationActions from '../../actions/location';
import { bindActionCreators } from 'redux';
import { getLocation, geocodeLocationByCoords } from '../../services/LocationServices'
import NoNetwork from '../Common/NoNetwork'
import IconComponent from '../Common/IconComponent'
import { ImageConst } from '../../services/ImageConstants'


class LocationEditView extends Component {

    static navigationOptions = {
        title: 'Change Location'
    }

    state = {
        savedLocations: [],
    }
    constructor(props) {
        super(props)
    }
    addLocation = () => {
        console.log('LocationEditView::addLocation()')
        this.props.navigation.navigate('AddLocationView')
    }
    onUseCurrentLocation = async () => {
        console.log('Use Current Location')
        await this.getUserLocation()
        this.props.navigation.popToTop();
    }

    async getUserLocation() {
        console.log('Home::getUserLocation()')
        let coords = await getLocation()
        var lat = parseFloat(coords.latitude)
        var long = parseFloat(coords.longitude)
        console.log('coords>>>>', coords)
        console.log('Your current position is:');
        console.log(`Latitude : ${lat}`);
        console.log(`Longitude: ${long}`);
        console.log(`More or less ${coords.accuracy} meters.`);
        var initialRegion = {
            latitude: lat,
            longitude: long
        }
        this.getUserLocationName(initialRegion)
    }

    getUserLocationName(crd) {
        let { actions } = this.props;
        let lat = parseFloat(crd.latitude)
        let long = parseFloat(crd.longitude)
        let address = {
            shortAddress: '',
            longAddress: '',
            coordinates: crd
        }
        let currentAddress = {
            currentUserAddress: '',
            currentUserCoordinates: crd
        }
        geocodeLocationByCoords(lat, long).then(
            (data) => {
                if (data.shortAddress !== undefined) {
                    address.shortAddress = data.shortAddress
                }
                if (data.longAddress !== undefined) {
                    address.longAddress = data.longAddress
                    currentAddress.currentUserAddress = data.longAddress
                }
                actions.changeLocation(address);
                actions.changeCurrentLocation(currentAddress)
            }).catch(error => console.warn(error))
    }

    renderSeparatorView = () => {
        return (
            <View style={{
                height: 1,
                width: "100%",
                backgroundColor: "#CEDCCE",
                marginVertical: '5%'
            }}
            />
        );
    };

    fetchSavedLocation = async () => {
        let savedAddress = await getSavedAddress();
        console.log('savedAddress before >>>', savedAddress)
        if (savedAddress === null) {
            savedAddress = []
            console.log('savedAddress after>>>', savedAddress)
            await setSavedAddress(savedAddress)
        }
        else {

            this.setState({ savedLocations: JSON.parse(savedAddress) })
        }
    }

    async componentDidMount() {
        await this.fetchSavedLocation()
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            async () => {
                await this.fetchSavedLocation()
            }
        );

    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    currentListItemClick = (item) => {
        let { actions } = this.props;
        var address = {
            shortAddress: item.shortAddress,
            longAddress: item.longAddress,
            coordinates: item.coordinates
        }
        actions.changeLocation(address)
        this.props.navigation.popToTop();
    }

    renderSavedAddressListView = () => {
        if (this.state.savedLocations.length != 0) {
            console.log('Length of list', this.state.savedLocations.length)
            return (
                <SavedAddressList
                    data={this.state.savedLocations}
                    onCurrentItemClick={(item) => this.currentListItemClick(item)} />
            )
        }
        else {
            return null
        }
    }
    render() {
        const { currentUserAddress } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <NoNetwork />
                {/* <TextInput
                    placeholder='Search for your Locality/city'
                    autoFocus={false}
                    style={styles.placeTextInput}
                    onFocus={() => this.props.navigation.navigate('LocationSearchPage')}
                /> */}
                <SearchBar
                    placeholder='Search for your Locality/city'
                    autoFocus={false}
                    containerStyle={{ backgroundColor: 'white', marginHorizontal: '5%' }}
                    inputContainerStyle={{ backgroundColor: 'white' }}
                    lightTheme={true}
                    onFocus={() => this.props.navigation.navigate('LocationSearchPage')}
                />
                <TouchableOpacity style={{ marginTop: '5%', alignItems: 'flex-start' }}
                    onPress={this.onUseCurrentLocation}>
                    <View style={{ flexDirection: 'row', width: '100%', paddingStart: '5%' }}>
                        <IconComponent
                            name={ImageConst['icon-current-location']}
                            size={20} />
                        <Text style={{ marginStart: '5%', color: Constants.DOBO_RED_COLOR, fontFamily: Constants.LIST_FONT_FAMILY }}>
                            Use Current Location
                        </Text>
                    </View>
                    <View style={{ paddingHorizontal: '10%', marginTop: '5%' }}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY }}
                            numberOfLines={3}
                        >
                            {currentUserAddress}
                        </Text>
                    </View>
                </TouchableOpacity>
                {this.renderSeparatorView()}
                <View style={{ flex: 1 }}>
                    {this.renderSavedAddressListView()}
                </View>
                <View>
                    <Button
                        title='ADD LOCATION'
                        buttonStyle={styles.addButton}
                        containerStyle={{
                            margin: '5%',
                            borderRadius: 30
                        }}
                        titleStyle={{ fontSize: 16, fontFamily: Constants.LIST_FONT_FAMILY }}
                        onPress={() => this.addLocation()}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    // placeTextInput: {
    //     backgroundColor: "white",
    //     borderTopWidth: 0,
    //     borderRightWidth: 0,
    //     borderBottomWidth: 1,
    //     //borderColor: "grey",
    //     padding: '2%',
    //     marginHorizontal: '5%',
    //     height: Platform.OS === 'ios' ? '10%' : '10%',
    // },
    addButton: {
        borderRadius: 30,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff'
    }

});

const mapStateToProps = state => ({
    currentUserAddress: state.location.currentUserAddress
});

const ActionCreators = Object.assign(
    {},
    locationActions,
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LocationEditView)
