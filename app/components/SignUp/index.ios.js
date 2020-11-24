import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    ActionSheetIOS,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import * as Constants from '../../services/Constants'
import { setUserToken } from '../../services/Helper';
import Api from '../../services/Api'
import Loader from '../Common/Loader';
import { API_ERROR } from '../../services/ApiConstants'
import { Button } from 'react-native-elements'
import moment from 'moment';

class SignUp extends Component {

    static navigationOptions = {
        //title: 'Sign Up',
        headerTitle: <Text style={{ fontSize: 20, fontFamily: Constants.LIST_FONT_FAMILY }}>Sign Up</Text>
    };
    genderOpt = ['Male', 'Female', 'Prefer Not To Disclose', 'Cancel', 'Exit']
    state = {
        firstName: '',
        nameError: '',
        lastName: '',
        email: '',
        emailError: '',
        gender: 'Choose your Gender',
        date: '',
        dateError: '',
        maxdate: '',
        pincode: '',
        pincodeError: '',
        referralCode: '',
        phoneNo: '',
        loading: false,
        fNameBgColor: '#E6EEF1',
        lNameBgColor: '#E6EEF1',
        emailBgColor: '#E6EEF1',
        genderBgColor: '#31546E',
        dobBgColor: '#E6EEF1',
        pinBgColor: '#E6EEF1',
    }

    constructor() {
        super();

        this.handleFirstName = this.handleFirstName.bind(this);
        this.handleLastName = this.handleLastName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePinCode = this.handlePinCode.bind(this);
    }

    componentDidMount = () => {
        this.getCurrentDate();
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

    handleFirstName(value) {
        this.setState({
            firstName: value,
            backgroundColor: Constants.DOBO_GREY_COLOR
        });
        if (value.trim() === "") {
            this.setState(() => ({ nameError: "First name required." }));
        }
        else {
            this.setState({ nameError: '' })
        }
    }

    handleLastName(value) {
        this.setState({
            lastName: value
        });
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

    async registerUser() {
        this.startLoading()
        const data = {
            Email: this.state.email,
            Password: Constants.APP_CONST_PASSWORD,
            ConfirmPassword: Constants.APP_CONST_PASSWORD,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            PhoneNumber: this.state.phoneNo,
            Gender: this.state.gender,
            ZipCode: this.state.pincode,
            DOB: this.state.date + 'T00:00:00',
            Referral_By_Code: this.state.referralCode
        };
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


    onContinue = async () => {

        let validDate = moment().subtract(16, "years")

        try {
            let phoneno = await AsyncStorage.getItem('phoneNo') || 'none';
            this.setState({ phoneNo: phoneno });
        } catch (error) {
            // Error retrieving data
            console.log(error.message);
        }
        if (this.state.firstName.trim() === "") {
            this.setState(() => ({ nameError: "First name required." }));
        }
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
        if (this.state.nameError
            || this.state.emailError
            || this.state.dateError
            || this.state.pincodeError
            || this.state.gender == 'Choose your Gender') {
            Alert.alert('Please Fill the Mandatory Data')
        }
        else {

            this.registerUser()
        }

    }

    onFnameFocus() {
        this.setState({
            fNameBgColor: Constants.DOBO_GREY_COLOR
        })
    }

    onFnameBlur() {
        if (this.state.firstName == "") {
            this.setState({
                fNameBgColor: '#E6EEF1'
            })
        }
    }

    onLnameFocus() {
        this.setState({
            lNameBgColor: Constants.DOBO_GREY_COLOR
        })
    }

    onLnameBlur() {
        if (this.state.lastName == "") {
            this.setState({
                lNameBgColor: '#E6EEF1'
            })
        }
    }

    onEmailFocus() {
        this.setState({
            emailBgColor: Constants.DOBO_GREY_COLOR
        })
    }

    onEmailBlur() {
        if (this.state.email == "") {
            this.setState({
                emailBgColor: '#E6EEF1'
            })
        }
    }

    onPinFocus() {
        this.setState({
            pinBgColor: Constants.DOBO_GREY_COLOR
        })
    }

    onPinBlur() {
        if (this.state.pincode == "") {
            this.setState({
                pinBgColor: '#E6EEF1'
            })
        }
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
            <ScrollView>
                <View style={[styles.container]}>
                    <Loader
                        loading={this.state.loading}
                    />
                    <View style={[styles.view]}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY }}>First Name</Text>
                        <TextInput
                            onBlur={() => this.onFnameBlur()}
                            onFocus={() => this.onFnameFocus()}
                            style={{ ...styles.textInput, borderBottomColor: this.state.fNameBgColor }}
                            onChangeText={this.handleFirstName}
                            placeholder="Enter first name"
                            value={this.state.firstName}
                            clearButtonMode='while-editing' />
                        {!!this.state.nameError && (
                            <Text style={{ color: "red" }}>{this.state.nameError}</Text>
                        )}
                    </View>
                    <View style={[styles.view]}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY }}>Last Name</Text>
                        <TextInput
                            onBlur={() => this.onLnameBlur()}
                            onFocus={() => this.onLnameFocus()}
                            style={{ ...styles.textInput, borderBottomColor: this.state.lNameBgColor }}
                            onChangeText={this.handleLastName}
                            placeholder="Enter last name"
                            value={this.state.lastName}
                            clearButtonMode='while-editing'></TextInput>
                    </View>
                    <View style={[styles.view]}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY }}>Email Address</Text>
                        <TextInput
                            onBlur={() => this.onEmailBlur()}
                            onFocus={() => this.onEmailFocus()}
                            style={{ ...styles.textInput, borderBottomColor: this.state.emailBgColor }}
                            onChangeText={this.handleEmail}
                            placeholder="Enter email address"
                            keyboardType="email-address"
                            clearButtonMode='while-editing'></TextInput>
                        {!!this.state.emailError && (
                            <Text style={{ color: "red" }}>{this.state.emailError}</Text>
                        )}
                    </View>
                    <View style={{
                        marginTop: '5%', borderBottomColor: Constants.DOBO_GREY_COLOR,
                        borderBottomWidth: 1,
                    }}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY }}>Gender</Text>

                        <Button
                            onPress={() => { this.onChooseGenderPress() }}
                            title={this.state.gender}
                            type="clear"
                            buttonStyle={{ justifyContent: 'flex-start' }}
                            titleStyle={{ color: Constants.DOBO_RED_COLOR }}
                        />
                    </View>
                    <View style={{ borderBottomWidth: 1, borderBottomColor: this.state.dobBgColor }} />
                    <View style={[styles.view]}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY }}>Date of Birth</Text>
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
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY }}>PIN code</Text>
                        <TextInput
                            onBlur={() => this.onPinBlur()}
                            onFocus={() => this.onPinFocus()}
                            style={{ ...styles.textInput, borderBottomColor: this.state.pinBgColor }}
                            onChangeText={this.handlePinCode}
                            keyboardType='numeric'
                            placeholder="Enter pin code"
                            clearButtonMode='while-editing'></TextInput>
                        {!!this.state.pincodeError && (
                            <Text style={{ color: "red", fontFamily: Constants.LIST_FONT_FAMILY }}>{this.state.pincodeError}</Text>
                        )}
                    </View>
                    <View style={[styles.view]}>
                        <Text style={{ fontFamily: Constants.LIST_FONT_FAMILY }}>Referral code</Text>
                        <TextInput
                            onBlur={() => this.onPinBlur()}
                            onFocus={() => this.onPinFocus()}
                            style={{ ...styles.textInput, borderBottomColor: this.state.emailBgColor }}
                            onChangeText={(e) => { this.handleReferralCode(e) }}
                            placeholder="Enter referral code"
                        //maxLength={6}
                        ></TextInput>
                    </View>
                    <View style={{ ...styles.view, alignItems: 'flex-end' }}>
                        <Button
                            title='CONTINUE'
                            buttonStyle={styles.continueButton}
                            containerStyle={{
                                marginTop: '10%',
                                borderRadius: 30,
                                width: '100%'
                            }}
                            titleStyle={{ fontSize: 16 }}
                            onPress={() => this.onContinue()}
                        />
                    </View>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: '5%',
    },
    textInput: {
        borderBottomWidth: 1,
        padding: '1%',
        marginTop: '2%',
        color: Constants.LABEL_FONT_COLOR,
        height: 25
    },
    view: {
        marginTop: '10%',
        flex: 1
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

export default SignUp;