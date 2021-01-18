import React, { Component } from 'react'
import { View, TouchableWithoutFeedback, StyleSheet, Text, TouchableOpacity } from 'react-native'
import GooglePlacesInput from './GooglePlacesInput'
import { Icon, Button } from 'react-native-elements'
import SearchMapView from './SearchMapView'
import * as Constants from '../../services/Constants'
import { getAddressCity } from '../../services/LocationServices'
import { connect } from 'react-redux';
import * as locationActions from '../../actions/location';
import { bindActionCreators } from 'redux';

class LocationSearchPage extends Component {

    static navigationOptions = {
        title: 'Change Location'
    }
    shortAddress = ''
    coordinates = {

    }
    state = {
        region: {},
        showGoogleInput: true,
        formattedAddress: ''
    };
    constructor(props) {
        super(props)
        this.onCloseClickHandler = this.onCloseClickHandler.bind(this)
    }
    onCloseClickHandler = () => {
        this.props.navigation.goBack();
    };
    onConfirmLocation = () => {
        //this.props.navigation.pop(2);
        let { actions } = this.props;
        var address = {
            shortAddress: this.shortAddress,
            longAddress: this.state.formattedAddress,
            coordinates: this.coordinates
        }
        actions.changeLocation(address)
        this.props.navigation.popToTop();
    };
    getCoordsFromName(details) {
        let loc = details.geometry.location
        let longAddress = details.formatted_address
        this.shortAddress = getAddressCity(details.address_components, 'short')
        console.log('Short Address from Search>>', this.shortAdrress)

        this.coordinates = {
            latitude: loc.lat,
            longitude: loc.lng,
        }
        this.setState({
            region: {
                latitude: loc.lat,
                longitude: loc.lng,
                latitudeDelta: 0.003,
                longitudeDelta: 0.003
            },
            showGoogleInput: false,
            formattedAddress: longAddress
        });
    }

    onMapRegionChange(region) {
        this.setState({ region });
    }

    onChangeLocation = () => {
        this.setState({
            showGoogleInput: true
        })
    }

    renderGooglePlacesInputView() {
        return (
            <View style={{ flex: 1 }}>
                <GooglePlacesInput notifyChange={(details) => this.getCoordsFromName(details)} />
            </View>
        )
    }

    renderConfirmationView() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flex: 2, marginTop: '5%', marginHorizontal: '5%' }}>
                    <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY }}>
                        Your Location
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: '5%' }}>
                        <Icon name="check-circle-outline" size={20} color='green' type='material-community' />
                        <Text style={{ marginLeft: '1%', width: '60%', fontFamily: Constants.LIST_FONT_FAMILY }}>
                            {this.state.formattedAddress}
                        </Text>
                        <TouchableOpacity
                            style={{ alignItems: 'center', alignItems: 'center', marginLeft: '10%', marginRight: '5%' }}
                            onPress={() => this.onChangeLocation()}>

                            <Text style={{ color: Constants.DOBO_RED_COLOR, fontFamily: Constants.LIST_FONT_FAMILY }}>
                                CHANGE
					        </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', width: Constants.SCREEN_WIDTH }}>
                    <Button
                        title='CONFIRM LOCATION'
                        buttonStyle={styles.continueButton}
                        containerStyle={{
                            marginVertical: '10%',
                            borderRadius: 30,
                            flex: 1,
                            flexDirection: 'column-reverse'
                        }}
                        titleStyle={{ fontSize: 16, fontFamily: Constants.LIST_FONT_FAMILY }}
                        onPress={() => this.onConfirmLocation()}
                    />
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {
                    this.state.showGoogleInput ? this.renderGooglePlacesInputView()
                        : this.renderConfirmationView()
                }

                {/* {
                    this.state.showMap ?
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 3, marginTop: 50 }}>
                                <SearchMapView
                                    region={this.state.region}
                                    onRegionChange={(reg) => this.onMapRegionChange(reg)} />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', width: Constants.SCREEN_WIDTH }}>
                                <Button
                                    title='CONFIRM LOCATION'
                                    buttonStyle={styles.continueButton}
                                    containerStyle={{
                                        marginTop: '10%',
                                        borderRadius: 30,
                                        flex: 1
                                    }}
                                    titleStyle={{ fontSize: 16 }}
                                    onPress={() => this.onConfirmLocation()}
                                />
                            </View>
                        </View> : null
                } */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    continueButton: {
        borderRadius: 30,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden',
        marginLeft: '5%',
        marginRight: '5%'
    },

});

const ActionCreators = Object.assign(
    {},
    locationActions,
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(LocationSearchPage)