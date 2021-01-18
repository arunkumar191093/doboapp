import * as constants from './Constants.js';
import { getUserToken } from './Helper.js';
const baseURL = constants.baseURL;

export const GetRetailerWithVoucher = async function () {
    let path = `/api/Vouchers/GetRetailerWithVoucher`;
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

export const GetVoucherByRetailer = async function (id) {
    let path = `/api/Vouchers/GetVoucherByRetailer/${id}`;
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

export const GetVoucherByUser = async function () {
    let path = `/api/vouchers/GetVoucherByUser`;
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

export const vouchersDetails = async function (data) {
    let id = data.id;
    let path = `/api/voucherdetails/${id}`;
    let url = baseURL + path;
    console.log(url);
    console.log('PUTvouchersDetails>>>', JSON.stringify(data));
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
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

export const getcouponbycode = async function (couponCode) {
    console.log('couponCode',couponCode)
    let path = `/api/coupons/getcouponbycode/${couponCode}`;
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