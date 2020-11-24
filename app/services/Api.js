import * as constants from './Constants.js'
import { getUserToken, getFCMToken } from './Helper.js';

const baseURL = constants.baseURL;
export const Api = {
    loginWithOTP: async function (data) {
        let path = "/api/account/LoginWithOTP"
        let url = baseURL + path
        console.log(url)
        console.log(JSON.stringify(data))
        try {
            let response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            let responseStatus = response.status
            console.log('Status Code for ' + path + ":" + responseStatus)
            var responseJson = {}
            try {
                responseJson = await response.json();
            }
            catch (error) {
                console.log('Error while parsning response json', error)
            }
            console.log('Success:', JSON.stringify(responseJson));
            let returnObj = { 'status': responseStatus, 'responseJson': JSON.stringify(responseJson) }
            return returnObj;
        } catch (error) {
            console.error(error);
        }
    },
    registerUser: async function (data) {
        let path = "/api/account/register"
        let url = baseURL + path
        console.log(url)
        let fcmToken = await getFCMToken()
        console.log('FCM Token ', fcmToken)
        let body = { ...data, "FirebaseRegToken": fcmToken }
        console.log(JSON.stringify(body))
        try {
            let response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            let responseStatus = response.status
            console.log('Status Code for ' + path + ":" + responseStatus)
            let responseJson = {};
            try {
                responseJson = await response.json();
            } catch (error) {
                console.log('Error while parsning response json', error);
            }
            console.log('Success:', JSON.stringify(responseJson));
            let returnObj = {
                status: responseStatus,
                responseJson: JSON.stringify(responseJson),
            };
            return returnObj;
        } catch (error) {
            console.error(error);
        }
    },
}

export const GetUserProfile = async function () {
    let path = `/api/userprofile`
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + path + ":" + responseStatus)
        var responseJson = {}
        try {
            responseJson = await response.json();
        }
        catch (error) {
            console.log('Error while parsning response json', error)
        }
        console.log('Success:', JSON.stringify(responseJson));
        let returnObj = { 'status': responseStatus, 'responseJson': JSON.stringify(responseJson) }
        return returnObj;
    } catch (error) {
        console.error(error);
    }
}

export const PostUserLocation = async function (data) {
    let { latitude, longitude } = data;
    let path = `/api/userlocations?Longitude=${longitude}&Latitude=${latitude}`
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + path + ":" + responseStatus)
        var responseJson = {}
        try {
            responseJson = await response.json();
        }
        catch (error) {
            console.log('Error while parsning response json', error)
        }
        console.log('Success:', JSON.stringify(responseJson));
        let returnObj = { 'status': responseStatus, 'responseJson': JSON.stringify(responseJson) }
        return returnObj;
    } catch (error) {
        console.error(error);
    }
}

export const PutiOSFirebaseRegToken = async function (fcmToken) {
    let path = `/api/account/putfirebaseregtoken?RegToken=${fcmToken}`
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + path + ":" + responseStatus)
        var responseJson = {}
        try {
            responseJson = await response.json();
        }
        catch (error) {
            console.log('Error while parsning response json', error)
        }
        console.log('Success:', JSON.stringify(responseJson));
        let returnObj = { 'status': responseStatus, 'responseJson': JSON.stringify(responseJson) }
        return returnObj;
    } catch (error) {
        console.error(error);
    }
}

export const PutFirebaseRegToken = async function () {
    let fcmToken = await getFCMToken()
    let path = `/api/account/putfirebaseregtoken?RegToken=${fcmToken}`
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + path + ":" + responseStatus)
        var responseJson = {}
        try {
            responseJson = await response.json();
        }
        catch (error) {
            console.log('Error while parsning response json', error)
        }
        console.log('Success:', JSON.stringify(responseJson));
        let returnObj = { 'status': responseStatus, 'responseJson': JSON.stringify(responseJson) }
        return returnObj;
    } catch (error) {
        console.error(error);
    }
}

export const PostReviewRatings = async function (data) {
    let path = '/api/Reviews';
    let url = baseURL + path;
    console.log(url);
    console.log('Reveiw Rating>>>', JSON.stringify(data));
    try {
        let token = await getUserToken();
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });
        let responseStatus = response.status;
        console.log('Status Code for ' + path + ':' + responseStatus);
        // var responseJson = {};
        // try {
        //     responseJson = await response.json();
        // } catch (error) {
        //     console.log('Error while parsning response json', error);
        // }
        // console.log('Success:', JSON.stringify(responseJson));
        let returnObj = {
            status: responseStatus,
            // responseJson: JSON.stringify(responseJson),
        };
        return returnObj;
    } catch (error) {
        console.error(error);
    }
}

export const PostReplyForReview = async function (data) {
    let path = '/api/Replies';
    let url = baseURL + path;
    try {
        let token = await getUserToken();
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });
        let responseStatus = response.status;
        console.log('Status Code for ' + path + ':' + responseStatus);

        let returnObj = {
            status: responseStatus,
        };
        return returnObj;
    } catch (error) {
        console.error(error);
    }
}

export const getReviewsByReviewId = async function (id) {
    let path = `/api/Reviews/${id}`;
    let url = baseURL + path;
    try {
        let token = await getUserToken();
        let response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });
        let responseStatus = response.status;
        console.log('Status Code for ' + path + ':' + responseStatus);
        var responseJson = {};
        try {
            responseJson = await response.json();
        } catch (error) {
            console.log('Error while parsning response json', error);
        }
        let returnObj = {
            status: responseStatus,
            responseJson: JSON.stringify(responseJson),
        };
        return returnObj;
    } catch (error) {
        console.error(error);
    }
}

export { Api as default }