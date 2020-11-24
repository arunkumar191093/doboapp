import React from 'react'
import firebase from '@react-native-firebase/app';
import AsyncStorage from '@react-native-community/async-storage';

class FirebaseAuthService {
    constructor() {
        
    }
    verifyPhoneNumber(codedPhoneNumber, callback)
    {
        firebase.auth()
        .verifyPhoneNumber(codedPhoneNumber, 60)
        .on('state_changed', (phoneAuthSnapshot) => {
        // How you handle these state events is entirely up to your ui flow and whether
        // you need to support both ios and android. In short: not all of them need to
        // be handled - it's entirely up to you, your ui and supported platforms.

        // E.g you could handle android specific events only here, and let the rest fall back
        // to the optionalErrorCb or optionalCompleteCb functions
        switch (phoneAuthSnapshot.state) {
            // ------------------------
            //  IOS AND ANDROID EVENTS
            // ------------------------
            case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
            console.log('code sent');
            // on ios this is the final phone auth state event you'd receive
            // so you'd then ask for user input of the code and build a credential from it
            // as demonstrated in the `signInWithPhoneNumber` example above
            const { verificationId } = phoneAuthSnapshot;
            console.log(verificationId)
            callback({'verificationId':verificationId, 'error':null})
            //const {navigate} = this.props.navigation;
            // navigate('EnterOTP',{
            //     verificationId:verificationId,
            //     phoneNumber: codedPhoneNumber
            // })
            break;
            case firebase.auth.PhoneAuthState.ERROR: // or 'error'
            console.log('verification error');
            console.log(phoneAuthSnapshot.error);
            callback({'verificationId':null, 'error':phoneAuthSnapshot.error})
            //this.showErrorAlert();
            break;

            // ---------------------
            // ANDROID ONLY EVENTS
            // ---------------------
            case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
            console.log('auto verify on android timed out');
            // proceed with your manual code input flow, same as you would do in
            // CODE_SENT if you were on IOS
            break;
            case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
            // auto verified means the code has also been automatically confirmed as correct/received
            // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
            console.log('auto verified on android');
            console.log(phoneAuthSnapshot);
            // Example usage if handling here and not in optionalCompleteCb:
            const { _verificationId, code } = phoneAuthSnapshot;
            const credential = firebase.auth.PhoneAuthProvider.credential(_verificationId, code);

            // Do something with your new credential, e.g.:
            this.signInWithCredential(credential,callback);
            // firebase.auth().signInWithCredential(credential);
            // callback({'verificationId':verificationId, 'error':null,'autoVerified':true})
            // firebase.auth().currentUser.linkWithCredential(credential);
            // etc ...
            break;
        } 
        }, (error) => {
        // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
        // the ERROR case in the above observer then there's no need to handle it here
        console.log(error);
        // verificationId is attached to error if required
        console.log(error.verificationId);
        callback({'verificationId':null, 'error':error})
        //this.showErrorAlert();
        }, (phoneAuthSnapshot) => {
        // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
        // depending on the platform. If you've already handled those cases in the observer then
        // there's absolutely no need to handle it here.

        // Platform specific logic:
        // - if this is on IOS then phoneAuthSnapshot.code will always be null
        // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
        //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
        // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
        //   continue with user input logic.
        console.log(phoneAuthSnapshot);
        });
    }

    signInWithCredential(credential, callback)
    {
        console.log('FirebaseAuthService::signInWithCredential()')
        firebase.auth().signInWithCredential(credential).then((userCredential) => {
			console.log(userCredential);
			firebase.auth().currentUser.getIdToken().then(async (idToken) => {
                console.log(idToken);
                await AsyncStorage.setItem('firebaseToken', idToken);
                callback({'idToken':idToken, 'error':null})
      	    });
    	}, (error) => {
			console.log("Error OTP",error);
			//alert('Invalid OTP Entered');
            callback({'idToken':null, 'error':error})
    	});
    }

    getFirebaseCredentials(verificationId, otpCode)
    {
        return firebase.auth.PhoneAuthProvider.credential(verificationId, otpCode);
    }

}

export const firebaseAuthService = new FirebaseAuthService()