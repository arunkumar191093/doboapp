import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';
import * as Constants from '../../services/Constants';
import { Button } from 'react-native-elements';
import { GetReferralDetails } from '../../services/ProfileListApi';
import Loader from '../Common/Loader';
import { shareRefferal } from '../../services/Helper';

class Referal extends Component {

    state = {
        loading: false,
        referalDetails: {},
    };

    constructor(props) {
        super(props);
    }


    componentDidMount = async () => {
        this.callGetReferralDetails();
    }

    callGetReferralDetails = async () => {
        this.startLoading();
        let response = await GetReferralDetails();
        if (response.status == 200) {
            let referalData = response.responseJson;
            console.log('callGetReferralDetails>>>', referalData)
            this.setState({ referalDetails: JSON.parse(referalData) });
            this.stopLoading();
        } else {
            this.stopLoading();
        }
    }


    onInviteHandler = async (item) => {
        console.log('onInviteShareClickHandler>>', item)
        let sharedData = ''
        if (item != undefined) {
            sharedData = item.referral_Code
        }
        if (sharedData != '')
            await shareRefferal(sharedData);
    }


    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false });
    }

    render() {
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <View style={{ alignItems: 'center' }}>
                    <Image
                        style={styles.imageHead}
                        source={require('../../assets/images/refer-earn-banner.png')}
                        resizeMode='contain'
                    />
                    <View style={styles.middleTextDet}>
                        <Text style={styles.TextDetails}>
                            Invite your friends to join dobo and earn discount coupons whenever firend visits a store!
                        </Text>
                    </View>
                </View>
                <View style={styles.buttonDetails}>
                    <Button
                        title='INVITE FRIENDS'
                        buttonStyle={styles.continueButton}
                        containerStyle={{
                            marginVertical: '5%',
                            borderRadius: 30,
                            justifyContent: 'flex-end'
                        }}
                        titleStyle={{ fontSize: 16 }}
                        onPress={() => this.onInviteHandler(this.state.referalDetails)}
                    />
                </View>
            </View >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: 'green'
    },
    imageHead: {
        height: '65%',
        width: '100%',
        marginTop: '10%'
    },
    middleTextDet: {
        flex: 1,
        justifyContent: 'space-evenly',
        paddingHorizontal: '10%',
        marginTop: '5%'
    },
    TextDetails: {
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 18,
        textAlign: 'center'
    },
    buttonDetails: {
        flex: 1,
        marginLeft: 50,
        marginRight: 50,
        justifyContent: 'flex-end',
        marginVertical: '5%'
    },
    continueButton: {
        borderRadius: 30,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden'
    },
});


export default Referal;
