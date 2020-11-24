import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { EntityType, EntityAction } from './ApiConstants';
import { PutUserActions, PostUserActions } from './UserActions';
import Share from 'react-native-share';
import images from '../assets/images/appImageBase64';
import RNFetchBlob from 'rn-fetch-blob'
import Global from './Global'
import { getLocation } from '../services/LocationServices';
import { Linking, Alert, Platform } from 'react-native';

const MIN_DISTANCE_FROM_STORE = 10; //in metres
const MAX_TIME_DIFFERENCE = 1800000; // in miliseconds //30 minutes

export async function requestLocationPermission() {
    try {
        const current = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        console.log('Location Permission is granted ' + current)
        if (!current) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Location Permission granted');
            } else {
                console.log('Location permission denied');
            }
            return granted
        }
        return current
    } catch (err) {
        console.warn(err);
    }
}

export async function requestCameraPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
        } else {
            console.log('Camera permission denied');
        }
        return granted;
    } catch (err) {
        console.warn(err);
    }
    return false;
}

export async function hasLocationPermission() {
    const current = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    //console.log('Location Permission is granted ', current)
    return current
}

export async function hasCameraPermission() {
    const current = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
    console.log('Camera permission is granted' + current)
    return current;
}

export async function setUserToken(token) {
    await AsyncStorage.setItem('userToken', token);
}

export async function getUserToken() {
    const userToken = await AsyncStorage.getItem('userToken');
    return userToken;
}

export async function getSavedAddress() {
    const savedAddress = await AsyncStorage.getItem('savedAddress');
    return savedAddress;
}

export async function setSavedAddress(savedAddress) {
    await AsyncStorage.setItem('savedAddress', JSON.stringify(savedAddress));
}

export async function saveFCMToken(token) {
    await AsyncStorage.setItem('fcmToken', token)
}

export async function getFCMToken() {
    const token = await AsyncStorage.getItem('fcmToken') || ''
    return token
}

export async function saveAddress(address) {
    var savedAddress = await AsyncStorage.getItem('savedAddress');
    savedAddress = JSON.parse(savedAddress);
    console.log('Type of address', typeof (savedAddress))
    savedAddress.push(address)
    await setSavedAddress(savedAddress)

}

export const setCheckinInfo = async (storeInfo) => {
    let checkedInStoresArr = await AsyncStorage.getItem('checkedinStores') || [];
    if (typeof (checkedInStoresArr) == 'string') {
        checkedInStoresArr = JSON.parse(checkedInStoresArr);
    }
    const index = checkedInStoresArr.findIndex((store) => {
        return store.storeId == storeInfo.storeId;
    })
    if (index > -1) {
        checkedInStoresArr[index] = storeInfo;
    }
    else {
        checkedInStoresArr.push(storeInfo);
    }
    console.log('set checkin', checkedInStoresArr);
    await AsyncStorage.setItem('checkedinStores', JSON.stringify(checkedInStoresArr));
}

export const getCheckinInfo = async () => {
    const storesData = await AsyncStorage.getItem('checkedinStores') || [];
    console.log('get checkin', storesData);
    if (typeof (storesData) == 'string') {
        return JSON.parse(storesData);
    }
    return storesData;
}

export const removeStoreFromStorage = async (storeId) => {
    // below code to be used in case of multiple checkins allowed
    // let checkedInStoresArr = await getCheckinInfo();
    // const index = checkedInStoresArr.findIndex((store) => {
    //     return store.storeId == storeId;
    // })
    // const newArr = [...checkedInStoresArr.slice(0, index), ...checkedInStoresArr.slice(index + 1)];
    // await AsyncStorage.setItem('checkedinStores', JSON.stringify(newArr));
    await AsyncStorage.setItem('checkedinStores', JSON.stringify([]));
}

export function tConvert(time) {
    // Check correct time format and split into components
    var H = +time.substr(0, 2);
    var h = (H % 12) || 12;
    var ampm = H < 12 ? "AM" : "PM";
    time = h + time.substr(2, 3) + ampm;
    return time
}

export async function logout() {
    let deleteKeys = ['userToken', 'savedAddress', 'checkedinStores']
    await AsyncStorage.multiRemove(deleteKeys)
    //AsyncStorage.clear()
}

export function youtubeVideoIdParser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

export function mergeCampaignsAndStoreAds(campaigns, storeAds, products) {
    let result = [], productLen = products.length;
    while (storeAds.length != 0 || campaigns.length != 0 || products.length != 0) {

        if (storeAds.length < 2) {
            result = result.concat(campaigns.map(campaign => { return { type: 'CN_ITEM', values: campaign } }))
            campaigns = []
            if (storeAds.length != 0)
                result.push({ type: 'STORE_ITEM', values: storeAds.shift() })

        }
        else {
            for (let i = 0;i < 2;++i) {
                result.push({ type: 'STORE_ITEM', values: storeAds.shift() })
            }
            if (campaigns.length != 0)
                result.push({ type: 'CN_ITEM', values: campaigns.shift() })

        }
        for (let i = 0;i < productLen;i++) {
            result.push({ type: 'PRODUCT_ITEM', values: products.shift() })
        }
    }
    return result
}

export function getDateDiffInDays(firstDate, secondDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round((secondDate - firstDate) / oneDay);
    return diffDays
}

export function roundToTwoDecimalPlaces(number) {
    return number.toFixed(2)
}

export const getGiftVoucherShareMessage = (details) => {

    const { userName, amount, code, brand, expiryDate } = details

    let message =
        `Hurray! ${userName} has gifted you an e-voucher worth Rs ${amount}. You can redeem the gift voucher ${code} at any ${brand} store. The voucher is valid till ${expiryDate}. 
For More information download DOBO app. 
Android: www.dobo.app,
iOS: www.dobo.app
    `
    return message
}

export const getProductShareMessage = (code) => {
    let message =
        `Join me on dobo to get this offer! Try now! Install the app and get 10% off on your first purchase!! Get rewarded on every store visit!
        
Apply referral code: ${code}
        
For Play Store install: www.dobo.app
For iOS install: www.dobo.app
    `
    return message
}

export const getShareMessage = (code) => {
    let message =
        `Join me on dobo to make your offline fashion shopping hassle free! Explore deals, new arrivals, catch up with latest fashion near you. Try now! Install the app and get 10% off on your first purchase!! Get rewarded on every store visit!
        
Apply referral code: ${code}
        
For Play Store install: www.dobo.app
For iOS install: www.dobo.app
    `
    return message
}

export const shareRefferal = async (code) => {
    const shareOptions = {
        title: 'Refer Now!',
        url: images.appImage,
        failOnCancel: false,
        message: getShareMessage(code)
    };

    try {
        const ShareResponse = await Share.open(shareOptions);
        console.log('Share response', ShareResponse)
    } catch (error) {
        console.log('Error =>', error);
    }
};


const _downloadImageAndShare = async (title, message, url) => {

    try {
        let response = await RNFetchBlob.config({ fileCache: false }).fetch('GET', url);

        if (response.info().status) {
            let base64Str = await response.base64()
            let headers = response.respInfo.headers;
            let type = headers['Content-Type'];
            var dataUrl = 'data:' + type + ';base64,' + base64Str;
        }
        let options = { title, message, url: dataUrl, failOnCancel: false };
        let result = await Share.open(options);
        return result

    } catch (error) {
        return error

    }
}

export const shareYoutubeLink = async (url) => {
    const code = Global.referral_Code || ''
    const shareOptions = {
        title: 'Explore Now!',
        url: url,
        failOnCancel: false,
        message: getProductShareMessage(code)
    };

    try {
        const ShareResponse = await Share.open(shareOptions);
        console.log('Share response', ShareResponse)
        return ShareResponse
    } catch (error) {
        console.log('Error =>', error);
    }
}

export const shareGiftVoucher = async (productURL, details) => {
    //let code = Global.referral_Code || ''
    let title = 'Explore Now!'
    let message = getGiftVoucherShareMessage(details)
    let url = productURL
    try {
        return await _downloadImageAndShare(title, message, url);
    } catch (error) {
        console.log('Error =>', error);
        return error
    }
}

export const shareProduct = async (productURL, isVideo = false) => {
    let code = Global.referral_Code || ''
    let title = 'Explore Now!'
    let message = getProductShareMessage(code)
    let url = productURL
    try {
        if (!isVideo)
            return await _downloadImageAndShare(title, message, url);
        else
            return await shareYoutubeLink(url)
    } catch (error) {
        console.log('Error =>', error);
        return error
    }
}

export async function createClickUserAction(entityType, entityId) {
    let body = { "entityAction": EntityAction.Click }
    if (entityId == undefined) {
        return
    }
    switch (entityType) {
        case EntityType.Offer:
        case EntityType.Campaign:
        case EntityType.DoboTv:
        case EntityType.FeatureProduct:
            body['entityType'] = entityType
            body['EntityId'] = entityId
            break;
    }
    console.log('Body for Useractions Post', body)
    let userAction = await PostUserActions(body)
    console.log('Click Post Result>>', userAction)
    return userAction
}

export async function createViewUserAction(entityType, entityId) {
    let body = { "entityAction": EntityAction.View }
    if (entityId == undefined) {
        return
    }
    switch (entityType) {
        case EntityType.Offer:
        case EntityType.Campaign:
        case EntityType.DoboTv:
        case EntityType.FeatureProduct:
            body['entityType'] = entityType
            body['EntityId'] = entityId
            break;
    }
    console.log('Body for Useractions Post', body)
    let userAction = await PostUserActions(body)
    console.log('Click Post Result>>', userAction)
    return userAction
}

export async function createShareUserAction(entityType, entityId) {
    let body = { "entityAction": EntityAction.Share }
    if (entityId == undefined) {
        return
    }
    switch (entityType) {
        case EntityType.Offer:
        case EntityType.Campaign:
        case EntityType.DoboTv:
        case EntityType.FeatureProduct:
            body['entityType'] = entityType
            body['EntityId'] = entityId
            break;
    }
    console.log('Body for Useractions Post', body)
    let userAction = await PostUserActions(body)
    console.log('Share Post Result>>', userAction)
    return userAction
}

export async function likeContent(entityType, data) {
    let body = { "entityAction": EntityAction.Like }
    if (data == undefined) {
        return
    }
    switch (entityType) {
        case EntityType.Offer:
        case EntityType.Campaign:
        case EntityType.DoboTv:
        case EntityType.FeatureProduct:
            body['entityType'] = entityType
            body['EntityId'] = data.id
            break;
    }
    console.log('Body for Useractions Put', body)
    let userAction = await PutUserActions(-1, body)
    console.log('Like Put Result>>', userAction)
}

export function isValidPhonenumber(inputtxt) {
    let phoneno = /^[0][1-9]\d{9}$|^[1-9]\d{9}$/;
    if (inputtxt.match(phoneno)) {
        return true;
    }
    else {
        return false;
    }
}

export function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

export function GetDistance(lat1, lon1, lat2, lon2) {
    console.log('get distance called')
    var R = 6371; // km (change this constant to get miles)
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    // if (d > 1) return Math.round(d) + " km";
    // else if (d <= 1) return Math.round(d * 1000) + " m";
    return d;
}

export const validateLocationFromStore = async (storeCoords) => {
    const { latitude, longitude } = await getLocation();
    //TODO: remove hardcoded values
    // const distance = GetDistance(latitude, longitude, storeCoords.lat || 12.9599062, storeCoords.lng || 77.64154429999999);
    const distance = GetDistance(latitude, longitude, storeCoords.lat, storeCoords.lng);
    const distanceInMetres = distance * 1000;
    console.log('validateLocationFromStore distance', distanceInMetres)
    if (distanceInMetres <= MIN_DISTANCE_FROM_STORE) return true;
    return false
}

export const validateTimeDifference = (storeTime) => { //in miliseconds
    let currentTime = (new Date()).getTime(); //in miliseconds
    if (currentTime - storeTime <= MAX_TIME_DIFFERENCE) return true;
    return false;
}

export const checkForCheckinValidity = async () => {
    let checkedInStores = await getCheckinInfo(),
        validityExpiredStores = [],
        validStores = [];
    if (checkedInStores.length) {
        checkedInStores.map((store) => {
            let isValidTime = validateTimeDifference(store.checkinAt);
            let isValidDistance = validateLocationFromStore(store.location);
            if (!isValidTime || !isValidDistance) {
                validityExpiredStores.push(store);
            } else {
                validStores.push(store);
            }
        })
        // set checkedin store with the ones that have not expired
        // await AsyncStorage.setItem('checkedinStores', JSON.stringify(validStores));
    }

    return {
        'valid': validStores,
        'expired': validityExpiredStores,
        'checkedIn': checkedInStores
    };
}

export const callNumber = phone => {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phone}`;
    }
    else {
        phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                Alert.alert('Phone number is not available');
            } else {
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(err => console.log(err));
};