import * as constants from './Constants.js';
import { getUserToken } from './Helper.js';
import AsyncStorage from '@react-native-community/async-storage';

const baseURL = constants.baseURL;

export const updateCartItemInStorage = async (storeId, data) => {
  let cartData = await AsyncStorage.getItem('cartData') || {};
  if (typeof (cartData) == 'string') {
    cartData = JSON.parse(cartData);
  }
  //fetching particular store's data
  let cartByStore = cartData[storeId] || {},
    cartItems = cartByStore.cartItems ? cartByStore.cartItems : [];
  const index = cartItems.findIndex((item) => {
    return item.id == data.id;
  })
  // checking if item is already there in cart
  if (index > -1) {
    cartItems[index] = data;
  }
  else {
    cartItems.push(data);
  }
  cartByStore['cartItems'] = cartItems;
  cartByStore['count'] = cartItems.length;
  cartData[storeId] = cartByStore;
  await AsyncStorage.setItem('cartData', JSON.stringify(cartData));
  return cartByStore['count'];
}

export const getCartItemsFromStorage = async (storedId) => {
  let cartData = await AsyncStorage.getItem('cartData') || {};
  if (typeof (cartData) == 'string') {
    cartData = JSON.parse(cartData);
  }
  if (storedId) {
    return cartData[storedId] || {};
  }
  return cartData;
}


export const getAllAsyncKeys = async () => {
  return await AsyncStorage.getAllKeys();
}

export const getAllProductByStoreId = async (storeId) => {
  let path = `/api/BaggedProducts/Stores/${storeId}`;
  let url = baseURL + path;
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    let responseJson = {};
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


export const getAllProductByBagId = async (bagId) => {
  let path = `/api/BaggedProducts/Bags/${bagId}`;
  let url = baseURL + path;
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    let responseJson = {};
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

export const getBagDetails = async (bagId) => {
  let path = bagId ? `/api/Bags/${bagId}` : `/api/Bags`;
  let url = baseURL + path;
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    let responseJson = {};
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

export const addUpdateProductToBag = async (storeId, data, isUpdate, bagId) => {
  // let path = `/api/BaggedProducts/Stores/${storeId}`;
  let path = isUpdate ? `/api/BaggedProducts/Stores/${storeId}/Bags/${bagId}/products/${data.ProductId}` : `/api/BaggedProducts/Stores/${storeId}`;
  let url = baseURL + path;
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    // let responseJson = {};
    // try {
    //   responseJson = await response.json();
    // } catch (error) {
    //   console.log('Error while parsning response json', error);
    // }
    let returnObj = {
      status: responseStatus,
      // responseJson: responseJson,
    };
    return returnObj;
  } catch (error) {
    console.error(error);
  }
}

export const removeProductFromBag = async (storeId, bagId, productId) => {
  let path = `/api/BaggedProducts/Stores/${storeId}/Bags/${bagId}/products/${productId}`;
  let url = baseURL + path;
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      method: 'DELETE',
      // body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    // let responseJson = {};
    // try {
    //   responseJson = await response.json();
    // } catch (error) {
    //   console.log('Error while parsning response json', error);
    // }
    let returnObj = {
      status: responseStatus,
      // responseJson: responseJson,
    };
    return returnObj;
  } catch (error) {
    console.error(error);
  }
}

export const removeBagFromStore = async (bagId) => {
  let path = `/api/Bags/${bagId}`;
  let url = baseURL + path;
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      method: 'DELETE',
      // body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    // let responseJson = {};
    // try {
    //   responseJson = await response.json();
    // } catch (error) {
    //   console.log('Error while parsning response json', error);
    // }
    let returnObj = {
      status: responseStatus,
      // responseJson: responseJson,
    };
    return returnObj;
  } catch (error) {
    console.error(error);
  }
}

export const submitBag = async (bagId, addressId) => {
  let path = `/api/Bags/${bagId}/Submit?userAddressId=${addressId}`;
  let url = baseURL + path;
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    let responseJson = {};
    try {
      responseJson = await response.json();
    } catch (error) {
      console.log('Error while parsning response json', error);
    }
    let returnObj = {
      status: responseStatus,
      // responseJson: responseJson,
    };
    return returnObj;
  } catch (error) {
    console.error(error);
  }
}