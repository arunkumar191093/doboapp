import * as constants from './Constants.js'
import { getUserToken } from './Helper.js';

const baseURL = constants.baseURL;
export const GetUserList = async function () {
    let path = `/api/UserActions/GetUserList`
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + path + ":" + responseStatus)
        var responseJson = undefined
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

export const GetTrend = async function () {
    let path = `/api/trends/GetTrend`
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
        var responseJson = undefined
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

export const PostUserActions = async function (data) {
    let path = `/api/UserActions`
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + path + ":" + responseStatus)
        var responseJson = undefined
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

export const PutUserActions = async function (id, data) {
    let path = `/api/UserActions/${id}`
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + path + ":" + responseStatus)
        var responseJson = undefined
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

export const DeleteUserActions = async function (id) {
    let path = `/api/UserActions/${id}`
    let url = baseURL + path
    console.log(url)
    try {
        let token = await getUserToken()
        let response = await fetch(url, {
            method: 'DELETE',
            body: "", // data can be `string` or {object}!
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + path + ":" + responseStatus)
        var responseJson = undefined
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

export const getUserAddresses = async () => {
    let path = `/api/UserAddress/GetAllAddressesForUser`;
    let url = baseURL + path;
    try {
        let token = await getUserToken();
        let response = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });
        let responseStatus = response.status;
        var responseJson = undefined;
        try {
            responseJson = await response.json();
        } catch (error) {
            console.log('Error while parsning response json', error);
        }
        let returnObj = {
            status: responseStatus,
            responseJson: responseJson,
        };
        return returnObj;
    } catch (error) {
        console.error(error);
    }
}

export const addNewUserAddresses = async (data) => {
    let path = `/api/UserAddress/AddNew`;
    let url = baseURL + path;
    try {
        let token = await getUserToken();
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        let responseStatus = response.status;
        var responseJson = undefined;
        try {
            responseJson = await response.json();
        } catch (error) {
            console.log('Error while parsning response json', error);
        }
        let returnObj = {
            status: responseStatus,
            responseJson: responseJson,
        };
        return returnObj;
    } catch (error) {
        console.error(error);
    }
}

export const updateDefaultUserAddresses = async (data) => {
    let path = `/api/UserAddress/UpdateAsDefault?id=${data.id}`;
    let url = baseURL + path;
    try {
        let token = await getUserToken();
        let response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify({}), // data can be `string` or {object}!
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });
        let returnObj = {
            status: response.status
        };
        return returnObj;
    } catch (error) {
        console.error(error);
    }
}