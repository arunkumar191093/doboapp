import React, { Component } from 'react';

import { Platform, StyleSheet, View, Image, Text } from 'react-native';
import { facebookService } from '../../services/FacebookService'
import { Button } from 'react-native-elements'
import * as Constants from '../../services/Constants'

export default class FaceBookConfirmation extends Component {

    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props)
        this.state = {
            username: props.navigation.getParam('username') || '',
            avatar: props.navigation.getParam('avatar') || Constants.DEFAULT_PROFILE_IMAGE
        }
        this.onContinue = this.onContinue.bind(this)
        this.onDisconnect = this.onDisconnect.bind(this)
    }
    onContinue() {
        const { navigate } = this.props.navigation;
        console.log('FaceBookConfirmation::onContinue')
        navigate('FaceBookSignUp', {
            username: this.state.username,
            avatar: this.state.avatar
        })
    }
    onDisconnect() {
        console.log('Disconnect from FB')
        //facebookService.logout()
        facebookService.customFacebookLogout()
        this.props.navigation.goBack()
    }

    render() {
        return (

            <View style={styles.mainContainer}>

                <Image source={{ uri: this.state.avatar }}
                    style={styles.profileImage} />
                <View style={styles.middleTextContainer}>
                    <Text style={{ fontSize: 25, color: '#9A9A9A', fontFamily: Constants.LIST_FONT_FAMILY }}>Connected as</Text>
                    <Text style={styles.usernameText}>{this.state.username} </Text>
                </View>
                <View style={styles.bottomTextContainer}>
                    <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY }}>It's not you?</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: Constants.DOBO_RED_COLOR, padding: 5, fontFamily: Constants.LIST_FONT_FAMILY }}
                            onPress={() => this.onDisconnect()}>
                            Disconnect
                        </Text>
                        <Text style={{ paddingTop: 5, paddingRight: 5, paddingBottom: 5, fontFamily: Constants.LIST_FONT_FAMILY }}>
                            and try again.
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, width: Constants.SCREEN_WIDTH }}>
                    <Button
                        title='CONTINUE'
                        buttonStyle={styles.continueButton}
                        containerStyle={{
                            marginTop: '15%',
                            justifyContent: 'flex-end',
                            borderRadius: 30,
                            flex: 1
                        }}
                        titleStyle={{ fontSize: 16 }}
                        onPress={() => this.onContinue()}
                    />
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create(
    {
        mainContainer:
        {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            margin: '20%',
            marginTop: '30%',
            paddingTop: (Platform.OS === 'ios') ? '5%' : 0
        },
        profileImage:
        {
            width: 150,
            height: 150,
            borderRadius: 150 / 2,
            borderColor: Constants.DOBO_RED_COLOR,
            borderWidth: 1,
            overflow: 'hidden'
        },
        middleTextContainer:
        {
            alignItems: 'center',
            marginTop: '15%',
            width: Constants.SCREEN_WIDTH,
        },
        bottomTextContainer:
        {
            alignItems: 'center',
            marginTop: '20%'
        },
        continueButton: {
            borderRadius: 30,
            backgroundColor: Constants.DOBO_RED_COLOR,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#fff',
            overflow: 'hidden',
            marginHorizontal: '5%',
        },
        usernameText: {
            fontSize: 30,
            fontFamily: Constants.BOLD_FONT_FAMILY,
        }

    });