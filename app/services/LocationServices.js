import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid, ToastAndroid } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';


export const hasLocationPermission = async () => {
    if (Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)) {
        return true;
    }

    const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

    if (status === PermissionsAndroid.RESULTS.DENIED) {
        ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
}

export const getLocation = async () => {
    console.log('getLocation()')
    let hasLocationPermissions = await hasLocationPermission();
    console.log('Has Permission>>>', hasLocationPermissions)
    return new Promise(
        (resolve, reject) => {
            if (!hasLocationPermissions) reject({ message: 'Permission Denied' });
            if (Platform.OS === 'ios') {
                console.log(Geolocation.requestAuthorization('whenInUse'))
                Geolocation.requestAuthorization('whenInUse')
                Geolocation.getCurrentPosition(
                    (data) => {
                        console.log('getLocation() data>>>', data)
                        resolve(data.coords)
                    },
                    (err) => {
                        console.log('getLocation() error:', err)
                        reject(err)
                    }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 3600000 }
                );
            }
            Geolocation.getCurrentPosition(
                (data) => {
                    console.log('getLocation() data>>>', data)
                    resolve(data.coords)
                },
                (err) => {
                    console.log('getLocation() error:', err)
                    reject(err)
                }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 3600000 }
            );
        }
    );
}

export const geocodeLocationByName = (locationName) => {
    return new Promise(
        (resolve, reject) => {
            Geocoder.from(locationName)
                .then(json => {
                    const addressComponent = json.results[0].address_components[0];
                    resolve(addressComponent);
                })
                .catch(error => reject(error));
        }
    );
}

export const geocodeLocationByCoords = (lat, long) => {
    console.log('geocodeLocationByCoords()')
    return new Promise(
        (resolve, reject) => {
            Geocoder.from(lat, long)
                .then(json => {
                    const formattedAddress = json.results[0].formatted_address
                    const addressComponent = getAddressCity(json.results[0].address_components, 'short')
                    let result = {
                        longAddress: formattedAddress,
                        shortAddress: addressComponent
                    }
                    resolve(result);
                })
                .catch(error => reject(error));
        }
    );
}

export const getAddressCity = (address, length) => {
    console.log(address)
    const findType = type => (type.types[0] === "political" || type.types.includes("sublocality") || type.types.includes("political"))
    const location = address.map(obj => obj)
    const rr = location.filter(findType)[0]
    return (
        length === 'short'
            ? rr.short_name
            : rr.long_name
    )
}

export const getShortName = (address) => {
    console.log(address)
    const shortName = address[0].short_name
    return shortName
}