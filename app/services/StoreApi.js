import * as constants from './Constants.js';
import { getUserToken } from './Helper.js';

const baseURL = constants.baseURL;

export const GetStoresByFilter = async function (data, page = 1) {
  let path = `/api/stores/GetStoresbyfilter?page=${page}`;
  let url = baseURL + path;
  console.log(url);
  console.log('GetStoresbyfilter>>>', JSON.stringify(data));
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    var responseJson = [];
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

export const GetStoresProductsByFilter = async function (data, storeId, isStoreCheckin) {
  let path = `/api/StorePageDetails/${storeId}?checkin=${isStoreCheckin}`;
  let url = baseURL + path;
  console.log(url);
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    var responseJson = [];
    try {
      responseJson = await response.json();
    } catch (error) {
      console.log('Error while parsning response json', error);
    }
    console.log('Success:', JSON.stringify(responseJson));
    let returnObj = {
      status: responseStatus,
      responseJson: responseJson,
    };
    return returnObj;
  } catch (error) {
    console.log(error);
  }
};

export const GetStoresUsingGPS = async function (data) {
  let path = '/api/stores/GetStoresUsingGPS';
  let url = baseURL + path;
  console.log(url);
  console.log('GetStoresUsingGPS>>>', JSON.stringify(data));
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    var responseJson = [];
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

export const GetStoreAds = async function (storeID) {
  let path = `/api/stores/${storeID}/GetStoreAds`;
  let url = baseURL + path;
  console.log(url);
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    var responseJson = [];
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

export const GetStoresByCategory = async function (categoryID, data) {
  let path = `/api/stores/GetStoreByCategory/${categoryID}`;
  let url = baseURL + path;
  console.log(url);
  console.log('GetStoresByCategory>>>', JSON.stringify(data));
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    var responseJson = [];
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

export const Storecheckins = async function (data, checkinId) {
  let path = checkinId ? `/api/storecheckins/${checkinId}` : '/api/storecheckins';
  let url = baseURL + path;
  console.log(url);
  console.log('Storecheckins>>>', JSON.stringify(data));
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      method: checkinId ? 'PUT' : 'POST',
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
    console.log(error);
  }
};

export const GetStoreBanners = async function (storeId) {
  let path = `/api/StoreBanners/ByStore/${storeId}`;
  let url = baseURL + path;
  console.log(url);
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
    var responseJson = [];
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
export const GetStoresByCampaign = async function (data) {
  let CampaignId = data.id;
  console.log('Single-Campaign-Id', CampaignId);
  let Longitude = data.Longitude;
  let Latitude = data.Latitude;
  let path = `/api/stores/GetStoresByCampaign?campaignId=${CampaignId}&Longitude=${Longitude}&Latitude=${Latitude}`;

  let url = baseURL + path;
  console.log('campaignUrl', url);
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
    let responseStatus = response.status;
    console.log('Status Code for Retailer' + path + ':' + responseStatus);
    var responseJson = [];
    try {
      responseJson = await response.json();
    } catch (error) {
      console.log('Error while parsning response json', error);
    }
    console.log('Success Retailer:', JSON.stringify(responseJson));
    let returnObj = {
      status: responseStatus,
      responseJson: JSON.stringify(responseJson),
    };
    return returnObj;
  } catch (error) {
    console.log(error);
  }
};

export const GetStoreByStoreAds = async function (id) {
  let path = `/api/stores/GetStoreByStoreAd/${id}`;
  let url = baseURL + path;
  console.log(url);
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token,
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
export const GetStoreByProductId = async function (id) {
  let path = `/api/Stores/GetStoreByProduct/${id}`;
  let url = baseURL + path;
  console.log(url);
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token,
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
      responseJson: responseJson,
    };
    return returnObj;
  } catch (error) {
    console.log(error);
  }
};

export const GetStoreById = async function (id) {
  let path = `/api/stores/${id}`;
  let url = baseURL + path;
  console.log(url);
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token,
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

export const GetStorePageDetails = async function (id, checkin = false) {
  let path = `/api/storepagedetails/${id}?checkin=${checkin}`;
  let url = baseURL + path;
  console.log(url);
  try {
    let token = await getUserToken();
    let response = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    });
    let responseStatus = response.status;
    console.log('Status Code for ' + path + ':' + responseStatus);
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
    console.log(error);
  }
};

export const GetProductsDetails = async function (id) {
  let path = `/api/products/${id}`;
  let url = baseURL + path;
  console.log(url);
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
    console.log('Success GetProductsDetails :', JSON.stringify(responseJson));
    let returnObj = {
      status: responseStatus,
      responseJson: JSON.stringify(responseJson),
    };
    return returnObj;
  } catch (error) {
    console.log(error);
  }
};

export const GetStoreAdDetails = async function (id) {
  let path = `/api/StoreAds/${id}`;
  let url = baseURL + path;
  console.log(url);
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
    console.log('GetStoreAdDetails :', responseJson);
    let returnObj = {
      status: responseStatus,
      responseJson: JSON.stringify(responseJson),
    };
    return returnObj;
  } catch (error) {
    console.log(error);
  }
};
