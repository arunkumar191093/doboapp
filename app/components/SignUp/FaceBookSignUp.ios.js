import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Image,
    ActionSheetIOS,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import { Button } from 'react-native-elements'
import * as Constants from '../../services/Constants'
import { setUserToken } from '../../services/Helper';
import Loader from '../Common/Loader';
import Api from '../../services/Api'
import { API_ERROR } from '../../services/ApiConstants'
import moment from 'moment';

class FaceBookSignUp extends Component {

    static navigationOptions = {
        header: null
    }
    genderOpt = ['Male', 'Female', 'Prefer Not To Disclose', 'Cancel', 'Exit']
    constructor(props) {
        super(props)
        this.state = {
            username: props.navigation.getParam('username') || '',
            avatar: props.navigation.getParam('avatar') || Constants.DEFAULT_PROFILE_IMAGE,
            email: '',
            emailError: '',
            gender: 'Choose your Gender',
            date: '',
            dateError: '',
            maxDate: '',
            pincode: '',
            pincodeError: '',
            referralCode: '',
            phoneNo: '',
            loading: false
        }
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePinCode = this.handlePinCode.bind(this);
    }

    componentDidMount() {
        this.getCurrentDate()
    }

    getCurrentDate = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        this.setState({
            date: year + '-' + month + '-' + date,
            maxdate: year.toString() + '-' + month.toString() + '-' + date.toString()
        })
    }


    handleEmail(value) {
        this.setState({
            email: value
        })
        let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!emailReg.test(value)) {
            console.log('Email Not Valid')
            this.setState({ emailError: 'Please provide valid email.' })
        }
        else {
            this.setState({ emailError: '' })
        }
    }

    handlePinCode(value) {
        this.setState({
            pincode: value
        })
        let pinReg = /^[1-9][0-9]{5}$/;
        if (!pinReg.test(value)) {
            this.setState({ pincodeError: 'Invalid Pin Code' })
        }
        else {
            this.setState({ pincodeError: '' })
        }
    }

    handleDateChange = (date) => {
        let validDate = moment().subtract(16, "years")
        this.setState({ date: date })
        if (!validDate.isAfter(date)) {
            this.setState({ dateError: 'Eligibility 16 years ONLY' })
            console.log("To successfully open an account you have to be at least 18 years old.")

        }
        else {
            this.setState({ dateError: '' })
        }
    }

    splitUserName(username) {
        var string = username;
        string = string.split(" ");
        var stringArray = new Array();
        for (var i = 0; i < string.length; i++) {
            stringArray.push(string[i]);
            if (i != string.length - 1) {
                stringArray.push();
            }
        }
        return stringArray;
    }

    onContinue = async () => {
        //setUserToken('abc')
        //await AsyncStorage.setItem('userToken', 'abc');
        //this.props.navigation.navigate('App'); 
        let validDate = moment().subtract(16, "years")

        try {
            let phoneno = await AsyncStorage.getItem('phoneNo') || 'none';
            this.setState({ phoneNo: phoneno });
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
        let userNameArr = this.splitUserName(this.state.username);
        let firstName = userNameArr[0]
        let lastName = userNameArr[1]
        if (this.state.email == "") {
            this.setState({
                emailError: 'Please provide valid email.'
            })
        }
        if (!validDate.isAfter(this.state.date)) {
            this.setState({ dateError: 'Eligibility 16 years ONLY' })
            console.log("To successfully open an account you have to be at least 18 years old.")

        }
        if (this.state.pincode == "") {
            this.setState({ pincodeError: 'Please Enter Pin Code' })
        }
        if (this.state.emailError
            || this.state.dateError
            || this.state.pincodeError
            || this.state.gender == 'Choose your Gender') {
            Alert.alert('Please Fill the Mandatory Data')
        }
        else {
            const data = {
                Email: this.state.email,
                Password: Constants.APP_CONST_PASSWORD,
                ConfirmPassword: Constants.APP_CONST_PASSWORD,
                FirstName: firstName,
                LastName: lastName,
                PhoneNumber: this.state.phoneNo,
                Gender: this.state.gender,
                ZipCode: this.state.pincode,
                DOB: this.state.date + 'T00:00:00',
                Referral_By_Code: this.state.referralCode
            };
            this.registerUser(data)
        }
    }


    async registerUser(data) {
        this.startLoading()
        console.log("RegisterBody>>>", data);
        let response = await Api.registerUser(data)
        console.log(response);
        if (response.status == 200) {
            console.log('User Registered Successfully')
            this.authorizeUser()
        }
        else {
            console.log('Failed to register')
            this.stopLoading()
        }
    }

    async authorizeUser() {
        console.log('Authorizing the User')
        const firebaseToken = await AsyncStorage.getItem('firebaseToken')
        console.log('firebaseToken ', firebaseToken)
        let data = {
            "PhoneNumber": this.state.phoneNo,
            "idToken": firebaseToken
        }
        let response = await Api.loginWithOTP(data)
        console.log(response);
        if (response.status == 200) {
            console.log('Aceess token verified, and user exist.')
            console.log(response.responseJson);

            const userToken = JSON.parse(response.responseJson)
            console.log(userToken.token)
            if (userToken.token != undefined) {
                setUserToken(userToken.token)
                this.props.navigation.navigate('App');
            }
        }
        else {
            let jsonResponse = JSON.parse(response.responseJson)
            if (jsonResponse.message == API_ERROR.PHONE_NOT_FOUND) {
                console.log('Aceess token verified, but user does not exist.')
                //this.props.navigation.navigate('App');
            }
        }
        this.stopLoading()

    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false })
    }

    onChooseGenderPress = () => {
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.genderOpt, cancelButtonIndex: 4, destructiveButtonIndex: 5, title: 'Choose your gender'
        }, (buttonIndex) => this.onGenderSelectPress(buttonIndex))
    }

    onGenderSelectPress = (buttonIndex) => {
        console.log('Selected Args>>>', this.genderOpt[buttonIndex])
        if (buttonIndex >= 0 && buttonIndex < 3) {
            this.setState({ gender: this.genderOpt[buttonIndex] })
        }
    }

    handleReferralCode = (value) => {
        this.setState({ referralCode: value })
    }

    render() {
        return (
            <ScrollView style={{ ...styles.container, flex: 1 }}>
                <Loader
                    loading={this.state.loading}
                />
                <View style={{ flex: 2 }}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Image source={{ uri: this.state.avatar }}
                            style={styles.profileImage} />
                    </View>
                    <View style={styles.middleTextContainer}>
                        <Text style={styles.usernameText}>{this.state.username} </Text>
                    </View>
                </View>
                <View style={{ flex: 5 }}>
                    <View style={{ ...styles.view }}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY, ...styles.labelText }}>Email Address</Text>
                        <TextInput
                            style={[styles.textInput]}
                            onChangeText={this.handleEmail}
                            placeholder="Enter email address"
                            keyboardType="email-address"></TextInput>
                        {!!this.state.emailError && (
                            <Text style={{ color: "red" }}>{this.state.emailError}</Text>
                        )}
                    </View>
                    <View style={[styles.view]}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY, ...styles.labelText }}>Gender</Text>
                        <Button
                            onPress={() => { this.onChooseGenderPress() }}
                            title={this.state.gender}
                            type="clear"
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            titleStyle={{ color: Constants.DOBO_RED_COLOR }}
                            containerStyle={{ flex: 1 }}
                        />
                    </View>
                    <View style={[styles.view]}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY, ...styles.labelText }}>Date of Birth</Text>
                        <DatePicker
                            style={{ width: "100%" }}
                            date={this.state.date}
                            mode="date"
                            placeholder="Select date"
                            format="YYYY-MM-DD"
                            minDate="1900-01-01"
                            maxDate={this.state.maxdate}
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateInput: {
                                    borderColor: "white",
                                    borderBottomColor: "black",
                                    width: "80%",
                                    alignItems: "flex-start",
                                    paddingLeft: 0,
                                },
                                dateText: {
                                    fontFamily: Constants.LIST_FONT_FAMILY,
                                    color: Constants.LABEL_FONT_COLOR
                                }
                            }}
                            onDateChange={this.handleDateChange}
                        />
                        {!!this.state.dateError && (
                            <Text style={{ color: "red", fontFamily: Constants.LIST_FONT_FAMILY }}>{this.state.dateError}</Text>
                        )}
                    </View>
                    <View style={[styles.view]}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY, ...styles.labelText }}>PIN code</Text>
                        <TextInput
                            style={[styles.textInput]}
                            onChangeText={this.handlePinCode}
                            keyboardType='numeric'
                            placeholder="Enter pin code"></TextInput>
                        {!!this.state.pincodeError && (
                            <Text style={{ color: "red", fontFamily: Constants.LIST_FONT_FAMILY }}>{this.state.pincodeError}</Text>
                        )}
                    </View>
                    <View style={[styles.view]}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY, ...styles.labelText }}>Referral code</Text>
                        <TextInput
                            style={[styles.textInput]}
                            onChangeText={this.handleReferralCode}
                            placeholder="Enter referral code"
                        //maxLength={6}
                        />
                    </View>
                </View>
                <View style={styles.view}>
                    <Button
                        title='CONTINUE'
                        buttonStyle={styles.continueButton}
                        containerStyle={{
                            marginVertical: '10%',
                            borderRadius: 30,
                            flex: 1,
                            height: 100
                        }}
                        titleStyle={{ fontSize: 16 }}
                        onPress={() => this.onContinue()}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: '5%'
    },
    textInput: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        padding: '1%',
        marginTop: '2%',
        height: 25,
        color: Constants.LABEL_FONT_COLOR
    },
    view: {
        marginTop: '10%',
        flex: 1,
    },
    continueButton: {
        borderRadius: 30,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        borderColor: Constants.DOBO_RED_COLOR,
        borderWidth: 1,
        overflow: 'hidden'
    },
    usernameText: {
        fontSize: 30,
        fontFamily: Constants.BOLD_FONT_FAMILY,
    },
    middleTextContainer: {
        alignItems: 'center',
        marginTop: '2%',
        width: Constants.SCREEN_WIDTH,
        flex: 1,
    },
    labelText: {
        color: Constants.LABEL_FONT_COLOR,
        paddingBottom: '2%',
    }

});

export default FaceBookSignUp;