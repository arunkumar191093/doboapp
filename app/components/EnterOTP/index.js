/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Alert,
	Platform
} from 'react-native';
import { PasscodeTextInput } from '../Common/PasscodeTextInput';
import { Button } from 'react-native-elements'
//import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth'
import Api, { PutiOSFirebaseRegToken, PutFirebaseRegToken } from '../../services/Api'
import { firebaseAuthService } from '../../services/FirebaseAuthService'
import * as Constants from '../../services/Constants'
import { API_ERROR } from '../../services/ApiConstants'
import { setUserToken } from '../../services/Helper';
import Loader from '../Common/Loader';
import { converApnsTokenToFcmToken } from '../../services/FCMServices';

export default class EnterOTP extends React.Component {

	_isMounted = false;
	timer = 0
	constructor(props) {
		super(props)
		this.state = {
			passcode1: "",
			passcode2: "",
			passcode3: "",
			passcode4: "",
			passcode5: "",
			passcode6: "",
			codedPhoneNumber: this.props.navigation.getParam('phoneNumber'),
			verificationId: this.props.navigation.getParam('verificationId'),
			showResendVerification: false,
			loading: false,
		}
		this.passcode1 = React.createRef()
		this.passcode2 = React.createRef()
		this.passcode3 = React.createRef()
		this.passcode4 = React.createRef()
		this.passcode5 = React.createRef()
		this.passcode6 = React.createRef()
		this.inputNumber = this.inputNumber.bind(this);
		this.resendVerificationCode = this.resendVerificationCode.bind(this)
		this.CheckVerificationCodeTimer = this.CheckVerificationCodeTimer.bind(this)
		this.startLoading = this.startLoading.bind(this)
		this.stopLoading = this.stopLoading.bind(this)


	}

	componentDidMount() {
		this._isMounted = true;
		this.CheckVerificationCodeTimer()
	}


	onVerify = () => {
		if (this.state.passcode1.trim() === '' ||
			this.state.passcode2.trim() === '' ||
			this.state.passcode3.trim() === '' ||
			this.state.passcode4.trim() === '' ||
			this.state.passcode5.trim() === '' ||
			this.state.passcode6.trim() === ''
		) {
			Alert.alert('Invalid OTP Entered')
			return
		}
		const otpCode = this.state.passcode1 +
			this.state.passcode2 +
			this.state.passcode3 +
			this.state.passcode4 +
			this.state.passcode5 +
			this.state.passcode6;
		console.log('OTP entered by User ' + otpCode)
		console.log(this.state.verificationId)
		const credential = firebaseAuthService.getFirebaseCredentials(this.state.verificationId, otpCode)
		//const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otpCode);
		console.log(credential)
		this.startLoading()
		firebaseAuthService.signInWithCredential(credential, (params) => {
			if (params.error === null) {
				const idToken = params.idToken;
				console.log(idToken)
				//Alert.alert('OTP Verified Successfully')
				this.authorizeUser(idToken);
			}
			else {
				Alert.alert("Verification Failed!");
				this.stopLoading()
			}
		})

	}

	navigateToRegisterOptions() {
		console.log('Taking User to Registrations')
		this.stopLoading()
		this.props.navigation.navigate('RegisterOptions')
	}

	navigateToHome() {
		console.log('Taking User to App home')
		this.stopLoading()
		this.props.navigation.navigate('App');
	}
	async authorizeUser(idToken) {
		let data = {
			"PhoneNumber": this.state.codedPhoneNumber,
			"idToken": idToken
		}
		let response = await Api.loginWithOTP(data)
		console.log(response);
		if (response.status == 200) {
			console.log('Aceess token verified, and user exist.')
			console.log(response.responseJson);

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
				this.navigateToHome()
			}
		}
		else {

			let jsonResponse = JSON.parse(response.responseJson)
			if (jsonResponse.message !== undefined && jsonResponse.message == API_ERROR.PHONE_NOT_FOUND) {
				console.log('Aceess token verified, but user does not exist.')
				this.navigateToRegisterOptions()
			}
			else if (jsonResponse.message !== undefined && jsonResponse.message == API_ERROR.INVALID_OR_EXPIRED_TOKEN) {
				console.log('Invalid or Expired Token.')
				this.stopLoading()
				Alert.alert('Invalid or Expired Tokem')

			} else {
				this.stopLoading()
				Alert.alert('Unable to connect to server, Please try again after sometime.');
			}
		}

	}

	inputNumber(value, flag) {
		console.log('Value and Flag', value, flag)
		const completeFlag = `passcode${flag}`
		this.setState({ [completeFlag]: value })
		flag = flag + 1
		if (flag < 7 && value) {
			const nextFlag = `passcode${flag}`
			//console.log(nextFlag);
			const textInputToFocus = this[nextFlag]
			//console.log(textInputToFocus)
			textInputToFocus.current.focus()
		}
	}

	onKeyPress = (event, flag) => {
		console.log('onKeyPress', event.nativeEvent.key)
		if (event.nativeEvent.key === 'Backspace') {
			flag = flag - 1
			const lastFlag = `passcode${flag}`
			const textInputToFocus = this[lastFlag]
			textInputToFocus.current.focus()
		}
		// const completeFlag = `passcode${flag}`
		// flag = flag + 1
		// if (flag < 7 && value) {
		// 	const nextFlag = `passcode${flag}`
		// 	//console.log(nextFlag);
		// 	const textInputToFocus = this[nextFlag]
		// 	//console.log(textInputToFocus)
		// 	textInputToFocus.current.focus()
		// }
	}


	resendVerificationCode() {
		console.log('resendVerificationCode()')
		firebaseAuthService.verifyPhoneNumber(this.state.codedPhoneNumber, (params) => {
			if (params.error === null) {
				this.passcode1.current.clear();
				this.passcode2.current.clear();
				this.passcode3.current.clear();
				this.passcode4.current.clear();
				this.passcode5.current.clear();
				this.passcode6.current.clear();
				this.passcode1.current.focus();
				this.state.verificationId = params.verificationId;
				this.setState({ showResendVerification: false })
			}
			else {
				Alert.alert('Error in Sending the Message');
			}
		})
	}

	CheckVerificationCodeTimer() {

		this.timer = setTimeout(() => {
			// if (this._isMounted) {

			// }
			console.log('Verification Code Entry Timed Out')
			this.setState({ showResendVerification: true })
		}, Constants.VERIFICATION_CODE_TIMEOUT);
	}

	stopVerificationCodeTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = 0;
		}
	}

	componentWillUnmount() {
		this.stopVerificationCodeTimer()
		//this._isMounted = false;
	}

	// renderResendView() {
	// 	if (this.state.showResendVerification) {
	// 		return (
	// 			<TouchableOpacity
	// 				style={{ alignItems: 'center', alignSelf: 'center' }}
	// 				onPress={() => this.resendVerificationCode()}
	// 				disabled={!this.state.showResendVerification}>

	// 				<Text style={{ color: Constants.DOBO_RED_COLOR, fontFamily: Constants.LIST_FONT_FAMILY }}>
	// 					Resend Verification Code
	// 				</Text>
	// 			</TouchableOpacity>
	// 		);
	// 	} else {
	// 		return null;
	// 	}
	// }

	startLoading() {
		this.setState({ loading: true });
	}

	stopLoading() {
		this.setState({ loading: false })
	}


	render() {
		//codedPhoneNumber = this.props.navigation.getParam('phoneNumber')
		//this.setState({codedPhoneNumber:this.props.navigation.getParam('phoneNumber')})
		let resendButtonColor = this.state.showResendVerification ? Constants.DOBO_RED_COLOR : Constants.DOBO_RED_DISABLED_COLOR
		return (
			<View style={styles.container}>
				<Loader
					loading={this.state.loading}
				/>
				<View style={styles.leftContainer}>
					<Text style={styles.firstText}>SMS Verification</Text>
					<Text style={styles.secondText}>We have sent an SMS with a verification code to {this.state.codedPhoneNumber}. Please enter it below.</Text>
				</View>
				<View style={[styles.passcodeContainer]}>
					<PasscodeTextInput
						autoFocus={true}
						ref={this.passcode1}
						onChangeText={number => this.inputNumber(number, 1)} />
					<PasscodeTextInput
						ref={this.passcode2}
						onChangeText={number => this.inputNumber(number, 2)}
						onKeyPress={(event) => this.onKeyPress(event, 2)} />
					<PasscodeTextInput
						ref={this.passcode3}
						onChangeText={number => this.inputNumber(number, 3)}
						onKeyPress={(event) => this.onKeyPress(event, 3)} />
					<PasscodeTextInput
						ref={this.passcode4}
						onChangeText={number => this.inputNumber(number, 4)}
						onKeyPress={(event) => this.onKeyPress(event, 4)} />
					<PasscodeTextInput
						ref={this.passcode5}
						onChangeText={number => this.inputNumber(number, 5)}
						onKeyPress={(event) => this.onKeyPress(event, 5)} />
					<PasscodeTextInput
						ref={this.passcode6}
						onChangeText={number => this.inputNumber(number, 6)}
						onKeyPress={(event) => this.onKeyPress(event, 6)} />
				</View>
				<View>
					<Button
						title='VERIFY'
						buttonStyle={styles.verifyButton}
						containerStyle={{
							margin: '5%',
							marginTop: '10%',
							borderRadius: 30
						}}
						titleStyle={{ fontSize: 16 }}
						onPress={() => this.onVerify()}
					/>
				</View>
				<TouchableOpacity
					style={{ alignItems: 'center', alignSelf: 'center' }}
					onPress={() => this.resendVerificationCode()}
					disabled={!this.state.showResendVerification}>

					<Text style={{ color: resendButtonColor, fontFamily: Constants.LIST_FONT_FAMILY }}>
						Resend Verification Code
					</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	centerEverything: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row'
		//backgroundColor: 'red'
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	leftContainer: {
		justifyContent: 'flex-start',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 50
	},
	passcodeContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	firstText: {
		color: "#758D9E",
		marginTop: 12,
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'left',
		alignItems: 'flex-start',
		marginLeft: 5,
		marginRight: 5,
		fontFamily: Constants.LIST_FONT_FAMILY
	},
	secondText: {
		color: "#758D9E",
		marginTop: 18,
		fontSize: 14,
		marginLeft: 10,
		marginRight: 10,
		fontFamily: Constants.LIST_FONT_FAMILY
	},
	verifyButton: {
		borderRadius: 30,
		backgroundColor: Constants.DOBO_RED_COLOR,
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#fff'
	},

});
