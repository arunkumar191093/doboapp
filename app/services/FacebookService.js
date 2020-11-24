import React from 'react'
import FBSDK from 'react-native-fbsdk'

const {
    LoginManager,
    AccessToken,
    GraphRequest,
    GraphRequestManager,
    LoginButton,
} = FBSDK;
class FacebookService {
    constructor() {
        this.requestManager = new GraphRequestManager()
    }

    makeLoginButton(callback) {
        return (
            <LoginButton
                readPermissions={["public_profile"]}
                onLoginFinished={(error, result) => {
                    if (error) {

                    } else if (result.isCancelled) {

                    } else {
                        AccessToken.getCurrentAccessToken()
                            .then((data) => {
                                callback(data.accessToken)
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }
                }} />
        )
    }

    makeLogoutButton(callback) {
        return (
            <LoginButton onLogoutFinished={() => {
                callback()
            }} />
        )
    }

    customFacebookLogout = () => {
        var current_access_token = '';
        AccessToken.getCurrentAccessToken().then((data) => {
            current_access_token = data.accessToken.toString();
        }).then(() => {
            let logout =
                new GraphRequest(
                    "me/permissions/",
                    {
                        accessToken: current_access_token,
                        httpMethod: 'DELETE'
                    },
                    (error, result) => {
                        if (error) {
                            console.log('Error fetching data: ' + error.toString());
                        } else {
                            LoginManager.logOut();
                        }
                    });
            new GraphRequestManager().addRequest(logout).start();
        })
            .catch(error => {
                console.log(error)
            });
    }


    loginToFacebook(callback) {
        LoginManager.logInWithPermissions(['email', 'public_profile',/*'user_friends'*/]).then(
            function (result) {
                if (result.isCancelled) {
                    alert('Login was cancelled');
                } else {
                    console.log('FB Login Result', result)
                    // alert('Login was successful with permissions: '
                    // + result.grantedPermissions.toString());
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            //console.log(data);
                            callback(data.accessToken)
                            //alert(data.accessToken.toString())
                        }
                    )
                }
            },
            function (error) {
                //callback(error)
                alert('Login failed with error: ' + error);
            }
        );
    }

    logout() {
        LoginManager.logOut()
    }
    async fetchProfile() {
        return new Promise((resolve, reject) => {
            const request = new GraphRequest(
                '/me',
                null,
                (error, result) => {
                    if (result) {
                        const profile = result
                        profile.avatar = `https://graph.facebook.com/${result.id}/picture?type=large`
                        resolve(profile)
                    } else {
                        reject(error)
                    }
                }
            )

            new GraphRequestManager().addRequest(request).start()
        })
    }
}

export const facebookService = new FacebookService()