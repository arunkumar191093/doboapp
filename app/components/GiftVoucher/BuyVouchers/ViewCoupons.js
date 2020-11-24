import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import Loader from '../../Common/Loader';
import NoDataFound from '../../Common/NoDataFound';
import * as Constants from '../../../services/Constants'
import ViewCouponList from './ViewCouponsList';
import { GetCouponsByRetailer } from '../../../services/ProfileListApi';
import { Icon } from 'react-native-elements';

class ViewCoupons extends Component {
    retilerId = ''
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.retilerId = this.props.navigation.getParam('retailerId') || ''
        this.onCouponClickHandler = this.onCouponClickHandler.bind(this);
    }

    state = {
        loading: false,
        couponDetails: [],
        isDataLoaded: false
    };

    componentDidMount = async () => {
        this.callCouponsDetails()
    }


    callCouponsDetails = async () => {
        if (this.retilerId !== '') {
            this.startLoading();
            let response = await GetCouponsByRetailer(this.retilerId);
            if (response.status == 200) {
                let couponData = response.responseJson;
                console.log('retailer callCouponsDetails>>>', couponData)
                this.setState({ couponDetails: JSON.parse(couponData) });
                this.stopLoading();
            } else {
                this.stopLoading();
            }
        }
        this.setState({ isDataLoaded: true })
    }



    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false });
    }

    onCouponClickHandler = () => {
        //this.props.navigation.navigate();
    }

    onUsePress = (item) => {
        const onUsePress = this.props.navigation.getParam('onUsePress')
        if (onUsePress) {
            onUsePress(item)
            this.props.navigation.goBack();
        }
    }

    onCloseClickHandler = () => {
        this.props.navigation.goBack();
    };

    render() {
        const { isDataLoaded, couponDetails, loading } = this.state
        return (
            <View style={styles.container}>
                <Loader loading={loading} />
                <View style={{ flexDirection: 'row', padding: '5%' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 20, color: "#5E7A90", fontFamily: Constants.LIST_FONT_FAMILY }}>
                            Coupons
                        </Text>
                    </View>
                    <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', height: 30 }} onPress={this.onCloseClickHandler} >
                        <Icon name="close-circle" type="material-community" color={Constants.DOBO_RED_COLOR} size={30}></Icon>
                    </TouchableOpacity>
                </View>
                {isDataLoaded && couponDetails.length == 0
                    ? <View style={styles.noDatacontainer}>
                        <NoDataFound message='No Coupons Found' />
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <ViewCouponList
                            data={couponDetails}
                            onCurrentItemClick={(item) => this.onCouponClickHandler(item)}
                            onUsePress={this.onUsePress}
                        />
                    </View>
                }

            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noDatacontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default ViewCoupons;