import { getFCMToken } from "./Helper";

const application = 'app.dobo.dobo'
let sandbox = false
if (__DEV__) {
    console.log('Development');
    sandbox = true
}
const serverKey = 'AAAA8y5ZqpM:APA91bE_8AufT5bO07KGxhHxc9YCVdMe4crLKjL7Lg2stOJjMPSz8LAjgKMibBUzCJMzFEv2jNsZQpJsYib31uuh36a-DgG6Ya5rR7xVhNszXzxQGpniQpMPGXriMJoL2L8nAAODVS3x'

export const converApnsTokenToFcmToken = async function () {
    let token = await getFCMToken()
    const url = 'https://iid.googleapis.com/iid/v1:batchImport'
    console.log(url)
    const data = {
        'application': application,
        'sandbox': sandbox,
        'apns_tokens': [
            token
        ]
    }
    console.log('Body for batchImport', data)
    try {
        let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Authorization': 'key=' + serverKey,
                'Content-Type': 'application/json'
            }
        });
        let responseStatus = response.status
        console.log('Status Code for ' + url + ":" + responseStatus)
        let fcmToken = ''
        try {
            let responseJson = await response.json();
            console.log('Success:', JSON.stringify(responseJson));
            let results = responseJson.results
            for (const result of results) {
                if (result.apns_token == token) {
                    fcmToken = result.registration_token
                    break
                }
            }
        } catch (error) {
            console.log('Error while parsning response json', error);
        }

        let returnObj = {
            status: responseStatus,
            token: fcmToken,
        };
        return returnObj;
    } catch (error) {
        console.log(error);
    }
}