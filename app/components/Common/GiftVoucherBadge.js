import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, } from 'react-native'
import IconComponent from './IconComponent';
import { ImageConst } from '../../services/ImageConstants';
import { Badge, Icon } from 'react-native-elements'
import { connect } from 'react-redux';
import * as countActions from '../../actions/countGift';
import { bindActionCreators } from 'redux';
import { GetVoucherByUser } from '../../services/VoucherApi';
import Loader from './Loader';
import * as loadingActions from '../../actions/isLoading'

class GiftVoucherBadge extends Component {

    state = {
        loading: false
    }
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        this.callGetVoucherByUser();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('componentDidUpdateGiftBadge>>>', this.props.isLoadingState)
        if (this.props.isLoadingState == true) {
            console.log('IsLoading Action Has Changed')
            this.props.actions.changeLoadingState(false)
            await this.callGetVoucherByUser();
        }
    }

    async callGetVoucherByUser() {
        let { actions } = this.props;
        this.startLoading();
        let response = await GetVoucherByUser();
        console.log('callGetVoucherByUser', response)
        let voucherImageCard = [];
        let countLenth = 0;
        if (response.status === 200) {
            let voucherByUser = response.responseJson;
            this.setState({ voucherData: JSON.parse(voucherByUser) });
            let jsonVoucherData = JSON.parse(voucherByUser);
            jsonVoucherData.forEach((voucher) => {
                let voucherDetails = voucher.voucherDetails;
                if (voucherDetails !== null) {
                    countLenth = countLenth + Object.keys(voucherDetails).length;
                }
            });
            actions.changeVoucherCountState(countLenth)
            console.log('voucherImageCard', countLenth)
            this.stopLoading();
        } else {
            this.stopLoading();
        }
        //console.log(voucherImageCard)
        this.setState({ byVoucherData: voucherImageCard, isByVoucherLoaded: true })
    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false })
    }


    render() {
        return (
            <View style={styles.container}>
                <Loader loading={this.state.loading} />
                <TouchableOpacity style={styles.rightContainer}
                    onPress={this.props.onGiftVoucherClick}>
                    <View>
                        {/* <Icon name="card-giftcard" size={25} color="black" /> */}
                        {/* <IconComponent imageName={'gift-card.png'} /> */}
                        {/* <Image style={{ width: 24, height: 24 }} source={require('../../../assets/images/gift-card.png')} /> */}
                        <IconComponent
                            name={ImageConst["gift-voucher"]}
                            size={24} />
                        <Badge
                            status="error"
                            value={this.props.giftCount}
                            containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor:'red',
        flex: 0.4
    },
    rightContainer: {
        flex: 1,
        //backgroundColor: 'green',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
    },

})

const mapStateToProps = state => ({
    giftCount: state.countGift.giftCount,
    isLoadingState: state.isLoading.isLoadingState

});

const ActionCreators = Object.assign(
    {},
    countActions,
    loadingActions
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(GiftVoucherBadge)