import React, { Component } from 'react'
import {
    View,
    Alert,
    Text
} from 'react-native'
import ProfileHeader from './ProfileHeader'
import ProfileListComponent from './ProfileListComponent'
import { logout } from '../../../services/Helper'
import NoNetwork from '../../Common/NoNetwork'
import { coupons, storecheckins } from '../../../services/ProfileListApi'
import { getVersion } from 'react-native-device-info';
import * as Constants from '../../../services/Constants';

class Profile extends Component {
    constructor(props) {
        super(props);
        // this.contentComponent = this.contentComponent.bind(this);
    }
    storeCheckinDetails = {}
    state = {
        list: [
            {
                title: 'Refer and Earn',
                icon: require('../../../assets/images/refer-earn.png')
            },
            {
                title: 'My Happy Bags',
                icon: require('../../../assets/images/personalized-shopping.png')
            },
            {
                title: 'My Checkins',
                icon: require('../../../assets/images/my-checkins.png'),
                itemValue: 0
            },
            // {
            //     title: 'My Coupons',
            //     icon: require('../../../assets/images/my-coupons.png'),
            //     itemValue: 0
            // },
            // {
            //     title: 'Manage Personalized Shopping',
            //     icon: require('../../../assets/images/personalized-shopping.png')
            // },
            {
                title: 'Reviews',
                icon: require('../../../assets/images/rating.png')
            },
            {
                title: 'Sign Out',
                icon: require('../../../assets/images/signout.png')
            },
        ],
        loading: false,
        currentVersion: ''
    }
    static navigationOptions = {
        header: null,
    }

    onItemClickHandler = (item) => {
        console.log('Profile::onItemClickHandler>>', item.title)
        if (item.title === 'Sign Out') {
            console.log('Sign Out Clicked')
            this.onLogout()
        } else if (item.title === 'My Coupons') {
            console.log('My Coupons Clicked')
            this.onCoupon()
        } else if (item.title === 'Refer and Earn') {
            console.log('My Referal Clicked')
            this.onRefer()
        }
        else if (item.title === 'My Happy Bags') {
            console.log('My Happy Bags Clicked')
            this.props.navigation.navigate('AllBags')
        }
        else if (item.title == 'My Checkins') {
            console.log('My Checkins clicked')
            this.onMyCheckin()
        }
    }

    onMyCheckin = () => {
        this.props.navigation.navigate('MyCheckins')
    }

    onRefer = async () => {
        this.props.navigation.navigate('Referal')
    }

    onCoupon = async () => {
        this.props.navigation.navigate('Coupons')
    }

    Logout = async () => {
        await logout()
        this.props.navigation.navigate('Auth')
    }

    onLogout = async () => {
        Alert.alert(
            'Sign out',
            'Do you want to signout?',
            [
                { text: 'Cancel', onPress: () => { return null } },
                { text: 'Confirm', onPress: () => { this.Logout() } },
            ],
            { cancelable: false }
        )
    }

    keyExtractor = (item, index) => index.toString()

    getHeader = () => {
        return <ProfileHeader />;
    };

    onNotificationPressed = () => {
        //this.props.navigation.navigate('GiftVoucherTab')
    }


    componentDidMount = async () => {
        this.callCouponsDetails()
        this.callStorecheckinsDetails()
        console.log('version is', getVersion())
        const version = getVersion();
        this.setState({
            currentVersion: version
        })
    }


    callCouponsDetails = async () => {
        this.startLoading();
        let response = await coupons();
        if (response.status == 200) {
            let couponData = response.responseJson;
            let couponDetails = JSON.parse(couponData);
            let lenthCoupon = Object.keys(couponDetails).length;
            const newArray = [...this.state.list];
            newArray[2].itemValue = lenthCoupon;
            this.setState({ list: newArray });

            console.log('callCouponsDetails>>>', lenthCoupon)

            this.stopLoading();
        } else {
            this.stopLoading();
        }
    }

    callStorecheckinsDetails = async () => {
        this.startLoading();
        let response = await storecheckins();
        if (response.status == 200) {
            let storeCheckinData = response.responseJson;
            let storeCheckinDetails = JSON.parse(storeCheckinData);
            this.storeCheckinDetails = storeCheckinDetails
            let lenthCheckin = storeCheckinDetails.totalCount
            const newArray = [...this.state.list];
            newArray[1].itemValue = lenthCheckin;
            this.setState({ list: newArray });
            console.log('callCouponsDetails>>>', lenthCheckin)

            this.stopLoading();
        } else {
            this.stopLoading();
        }
    }


    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <NoNetwork />
                <View style={{ paddingVertical: '2%' }}>
                    <ProfileHeader
                        onNotificationPressed={this.onNotificationPressed}
                    />
                </View>
                <View style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CEDCCE",
                }} />
                <View style={{ flex: 1 }}>
                    <ProfileListComponent
                        data={this.state.list}
                        onCurrentItemClick={this.onItemClickHandler}
                    />
                </View>
                {
                    !!this.state.currentVersion &&
                    <Text style={{
                        textAlign: 'center',
                        fontFamily: Constants.LIST_FONT_FAMILY,
                        fontSize: 14,
                        color: Constants.LIGHT_GREY_COLOR,
                        paddingBottom: 8
                    }}>
                        version - {this.state.currentVersion}
                    </Text>
                }
            </View>
        )
    }
}

export default Profile;