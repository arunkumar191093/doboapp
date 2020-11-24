import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView } from 'react-native'
import GooglePlacesInput from './GooglePlacesInput'
import { Button, Icon } from 'react-native-elements'
import * as Constants from '../../services/Constants'
import TagsView from '../Common/TagsView'
import { saveAddress } from '../../services/Helper'
import { getAddressCity } from '../../services/LocationServices'

class AddLocationView extends Component {


    tags = ['Home', 'Work', 'Others']
    static navigationOptions = {
        title: 'Add Location',
    }
    coordinates = {}
    shortAddress = ''
    state = {
        selected: [],
        showGoogleInput: true,
        isSaveDisabled: true,
        selectedTag: '',
        formattedAddress: '',
        addressName: ''
    };
    constructor(props) {
        super(props)
    }

    onSaveLocation = async () => {
        let addressName
        if (this.state.addressName.trim() == '') {
            addressName = this.state.selectedTag
        }
        else {
            addressName = this.state.addressName
        }
        var address = {
            tag: this.state.selectedTag,
            name: addressName,
            longAddress: this.state.formattedAddress,
            shortAddress: this.shortAddress,
            coordinates: this.coordinates
        }
        console.log('Address to be saved>>>', address)
        await saveAddress(address)
        this.props.navigation.goBack();
    };

    getCoordsFromName(details) {
        let loc = details.geometry.location
        let longAddress = details.formatted_address
        this.shortAddress = getAddressCity(details.address_components, 'short')
        console.log('Short Address from Search>>', this.shortAddress)

        this.coordinates = {
            latitude: loc.lat,
            longitude: loc.lng,
        }
        this.setState({
            showGoogleInput: false,
            formattedAddress: longAddress
        });
    }

    renderGooglePlacesInputView() {
        return (
            <View style={{ flex: 1 }}>
                <GooglePlacesInput notifyChange={(details) => this.getCoordsFromName(details)} />
            </View>
        )
    }

    onChangeLocation = () => {
        this.setState({
            showGoogleInput: true
        })
    }

    renderSeparatorView = () => {
        return (
            <View style={{
                height: 1,
                width: "100%",
                backgroundColor: "#CEDCCE",
                marginVertical: '5%',
            }}
            />
        );
    };

    renderSaveAsTextInput = () => {
        if (this.state.isSaveDisabled) {
            return null
        }
        else {
            return (
                <TextInput
                    placeholder='Save as'
                    autoFocus={false}
                    style={styles.saveTextInput}
                    onChangeText={(text) => this.setState({ addressName: text })}
                />
            )
        }
    }

    onTagSelected = (tag) => {
        console.log('Selected TAG>>>', tag)
        this.setState({
            isSaveDisabled: false,
            selectedTag: tag
        })
    }


    renderConfirmationView() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1 }}>
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
                        {this.renderSeparatorView()}
                        <View>
                            <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY }}>
                                Tag this location for later
                            </Text>
                            <TagsView
                                all={this.tags}
                                selected={this.state.selected}
                                isExclusive={true}
                                onTagSelected={this.onTagSelected}
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: '5%' }}>
                        {this.renderSeparatorView()}
                    </View>
                    <View style={{ marginHorizontal: '5%' }} >
                        {this.renderSaveAsTextInput()}
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center', width: Constants.SCREEN_WIDTH }}>
                        <Button
                            title='SAVE LOCATION'
                            buttonStyle={styles.enabledButton}
                            containerStyle={{
                                marginTop: '10%',
                                borderRadius: 30,
                                flex: 1
                            }}
                            disabled={this.state.isSaveDisabled}
                            disabledStyle={styles.disabledButton}
                            titleStyle={{ fontSize: 16, fontFamily: Constants.LIST_FONT_FAMILY }}
                            onPress={() => this.onSaveLocation()}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {
                    this.state.showGoogleInput ?
                        this.renderGooglePlacesInputView()
                        : this.renderConfirmationView()
                }
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        enabledButton: {
            borderRadius: 30,
            backgroundColor: Constants.DOBO_RED_COLOR,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#fff',
            overflow: 'hidden',
            marginLeft: '5%',
            marginRight: '5%'
        },
        disabledButton: {
            borderRadius: 30,
            backgroundColor: '#f7f5f5',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#fff',
            overflow: 'hidden',
            marginLeft: '5%',
            marginRight: '5%'
        },
        saveTextInput: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            borderRightWidth: 0,
            borderBottomWidth: 1,
            borderColor: "grey",
            padding: '2%',
        }

    });

export default AddLocationView