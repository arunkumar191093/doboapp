import * as constants from './Constants.js'
import { getUserToken } from './Helper.js';

const baseURL = constants.baseURL;

export const getCategories = async function () {
    let path = "/api/categories"
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken();
        let response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + path + ":" + responseStatus)
        let responseJson = [];
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
}

export const getBrands = async function () {
    let path = "/api/brands"
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken();
        let response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + path + ":" + responseStatus)
        let responseJson = [];
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
}

export const getCategoriesForFilter = async function () {
    let path = "/api/categories?categoryDisplay=1"
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken();
        let response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + path + ":" + responseStatus)
        let responseJson = [];
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
}
