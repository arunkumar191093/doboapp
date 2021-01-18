import * as constants from './Constants.js';
import { getUserToken } from './Helper.js';
const baseURL = constants.baseURL;

export const GetReferralDetails = async function () {
    let path = `/api/referral/GetReferralDetails`;
    let url = baseURL + path;
    console.log(url);
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        let responseStatus = response.status;
        console.log('Status Code for ' + path + ':' + responseStatus);
        var responseJson = undefined;
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
        console.log(error);
    }
};

export const coupons = async function () {
    let path = `/api/coupons`;
    let url = baseURL + path;
    console.log(url);
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        let responseStatus = response.status;
        console.log('Status Code for ' + path + ':' + responseStatus);
        var responseJson = undefined;
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
        console.log(error);
    }
};

export const GetCouponsByRetailer = async function (id) {
    let path = `/api/coupons/GetCouponByRetailer/${id}`;
    let url = baseURL + path;
    console.log(url);
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        let responseStatus = response.status;
        console.log('Status Code for ' + path + ':' + responseStatus);
        var responseJson = undefined;
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
        console.log(error);
    }
};

export const storecheckins = async function () {
    let path = `/api/storecheckins`;
    let url = baseURL + path;
    console.log(url);
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        let responseStatus = response.status;
        console.log('Status Code for ' + path + ':' + responseStatus);
        var responseJson = undefined;
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
        console.log(error);
    }
};


export const UpdateUserProfile = async function (data) {
    console.log('UpdateUserProfile', data)
    let path = `/api/userprofile`
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            method: 'POST',
            body: data, // data can be `string` or {object}!
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token,
            }
        });
        console.log('response', response)
        let responseStatus = response.status;
        console.log('responseStatus', responseStatus);
        return response;
    } catch (error) {
        // console.log(error);
    }
}

export const getCheckinsByStoreId = async (storeId) => {
    let path = `/api/StoreCheckIns/Stores/${storeId}`;
    let url = baseURL + path;
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        let responseStatus = response.status;
        console.log('Status Code for ' + path + ':' + responseStatus);
        var responseJson = undefined;
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
        console.log(error);
    }
}