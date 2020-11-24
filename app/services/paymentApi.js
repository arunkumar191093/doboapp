import * as constants from './Constants.js';
import { getUserToken } from './Helper.js';

const baseURL = constants.baseURL;

export const getOrderId = async function (data) {
    let path = '/api/payment';
    let url = baseURL + path;
    console.log(url);
    console.log('BuyVoucher>>>', JSON.stringify(data));
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
        var responseJson = {};
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
};

export const capturePayment = async function (data) {
    let path = '/api/payment/Capture';
    let url = baseURL + path;
    console.log(url);
    console.log('Razorpay_payment_id">>>', JSON.stringify(data));
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
        var responseJson = {};
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
};


