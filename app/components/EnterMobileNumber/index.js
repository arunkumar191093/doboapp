/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Picker,
    Alert,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements'
//import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth'
import { firebaseAuthService } from '../../services/FirebaseAuthService'
import Api, { PutiOSFirebaseRegToken, PutFirebaseRegToken } from '../../services/Api'
import * as Constants from '../../services/Constants'
import Loader from '../Common/Loader';
import { setUserToken, isValidPhonenumber } from '../../services/Helper';
import { API_ERROR } from '../../services/ApiConstants'
import { Platform } from 'react-native';
import { converApnsTokenToFcmToken } from '../../services/FCMServices';


class EnterMobileNumber extends Component {

    constructor(props) {
        super(props)
        this.state = {
            phoneNumber: "",
            countryCode: "+91",
            codes: ['+91'],
            loading: false
        }
        this.handleChangeText = this.handleChangeText.bind(this)
        this.handlePickerSelected = this.handlePickerSelected.bind(this)
        this.authorizeUser = this.authorizeUser.bind(this)
    }
    handleChangeText(newText) {
        this.setState({
            phoneNumber: newText
        })
    }
    handlePickerSelected(value) {
        console.log(value);
        this.setState({
            countryCode: value
        })
    }
    showErrorAlert() {
        Alert.alert('Error in Sending the SMS')
        //  uncomment this if want to see sign up screen
        // const {navigate} = this.props.navigation;
        // navigate('RegisterOptions')

    }

    async authorizeUser(idToken, codedPhoneNumber) {
        let data = {
            "PhoneNumber": codedPhoneNumber,
            "idToken": idToken
        }
        let response = await Api.loginWithOTP(data)
        console.log(response);
        if (response.status == 200) {
            console.log('Aceess token verified, and user exist.')

            const userToken = JSON.parse(response.responseJson)
            console.log(userToken.token)
            if (userToken.token != undefined) {
                await setUserToken(userToken.token)
                if (Platform.OS == 'ios') {
                    let convert = await converApnsTokenToFcmToken()
                    let fcmToken = convert.token
                    if (fcmToken) {
                        await PutiOSFirebaseRegToken(fcmToken)
                    }
                }
                else {
                    await PutFirebaseRegToken()
                }
                this.props.navigateTo('Home')
            }
        }
        else {
            let jsonResponse = JSON.parse(response.responseJson)
            if (jsonResponse.message == API_ERROR.PHONE_NOT_FOUND) {
                console.log('Aceess token verified, but user does not exist.')
                this.props.navigateTo('RegisterOptions')
            }
        }

    }

    startLoading() {
        this.setState({ loading: true })
    }

    stopLoading() {
        this.setState({ loading: false })
    }

    onContinue = async () => {

        const codedPhoneNumber = this.state.countryCode + this.state.phoneNumber
        console.log("Sending SMS to " + codedPhoneNumber);

        if (this.state.phoneNumber.trim() !== '' && isValidPhonenumber(this.state.phoneNumber)) {
            this.startLoading()
            try {
                await AsyncStorage.setItem('phoneNo', codedPhoneNumber);
            } catch (error) {
                // Error retrieving data
                console.log(error.message);
            }
            firebaseAuthService.verifyPhoneNumber(codedPhoneNumber, (params) => {
                //console.log(params.error);
                if (params.error === null) {
                    let idToken = params.idToken
                    console.log('idToken ' + idToken)
                    if (idToken != undefined) {
                        console.log('Phone Number Auto Verified')
                        //alert('Phone Number Auto Verified')
                        this.authorizeUser(idToken, codedPhoneNumber)
                    }
                    else {
                        console.log('Moving To Enter OTP Screen')
                        let verificationId = params.verificationId
                        this.props.navigateTo('EnterOTP', {
                            verificationId: verificationId,
                            phoneNumber: codedPhoneNumber
                        })
                    }
                }
                else {
                    console.log('error exist')
                    this.showErrorAlert();
                }
                this.stopLoading()
            })
        } else {
            // const {navigate} = this.props.navigation;
            // navigate('SignUp');
            Alert.alert("Please enter a valid phone number")
        }
        // optionally also supports .then & .catch instead of optionalErrorCb &
        // optionalCompleteCb (with the same resulting args)
    }

    render() {
        let codeItems = this.state.codes.map((s, i) => {
            return <Picker.Item key={i} value={s} label={s} />
        });
        return (
            <ScrollView style={styles.content}>
                <Loader
                    loading={this.state.loading} />
                <Text style={styles.firstText}>Enter your Mobile Number</Text>
                <Text style={styles.secondText}>Dobo will send a one time SMS message to verify your mobile number.</Text>
                <View style={styles.phoneInputView}>
                    <Picker
                        selectedValue={this.state.countryCode}
                        style={styles.dropDown}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ countryCode: itemValue })
                        }>
                        {codeItems}
                    </Picker>
                    <TextInput
                        placeholder="8888888888"
                        autoFocus={true}
                        onChangeText={this.handleChangeText}
                        style={styles.inputMobileNo}
                        keyboardType={'phone-pad'}
                        clearButtonMode='while-editing'
                        maxLength={10}
                        textContentType='telephoneNumber'
                    >
                    </TextInput>
                </View>
                <Button
                    title='CONTINUE'
                    buttonStyle={styles.continueButton}
                    containerStyle={{
                        marginTop: Platform.OS === 'ios' ? '0%' : '15%',
                        borderRadius: 30,
                        height: '20%'
                    }}
                    titleStyle={{ fontSize: 16 }}
                    onPress={() => this.onContinue()}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: '5%',
    },
    firstText: {
        color: "#758D9E",
        marginTop: '15%',
        fontSize: 18,
        fontFamily: Constants.BOLD_FONT_FAMILY,
    },
    secondText: {
        color: "#758D9E",
        marginTop: '7%',
        fontSize: 14,
        fontFamily: Constants.LIST_FONT_FAMILY,
    },
    phoneInputView: {
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignContent: "center",
        //backgroundColor: 'grey'
    },
    dropDown: {
        flex: 0.35,
        color: "#424242",
        marginRight: '5%'
    },
    inputMobileNo: {
        flex: 0.7,
        //backgroundColor: "green",
        color: Constants.LABEL_FONT_COLOR,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 3,
        borderColor: "grey",
        paddingBottom: 5,
        height: Platform.OS === 'ios' ? '20%' : '100%',
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
    continueText: {
        color: 'white',
        alignItems: 'center'
    }
});

export default EnterMobileNumber;