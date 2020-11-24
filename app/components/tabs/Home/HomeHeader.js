import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native'
// import Icon from 'react-native-vector-icons/MaterialIcons'
import { Badge, Icon } from 'react-native-elements'
import * as Constants from '../../../services/Constants'
import HeaderLocationBox from '../../Common/HeaderLocationBox';
import IconComponent from '../../Common/IconComponent';
import { ImageConst } from '../../../services/ImageConstants';
import GiftVoucherBadge from '../../Common/GiftVoucherBadge';


// -------------------Props---------------------
// giftVoucherClicked
// onLocationEdit;
// locationName

class HomeHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderLocationBox
                    onLocationEdit={this.props.onLocationEdit}
                    locationName={this.props.locationName}
                />
                <View style={styles.rightContainer}>
                    {
                        Constants.SHOW_FEATURE &&
                        <GiftVoucherBadge
                            onGiftVoucherClick={this.props.giftVoucherClicked}
                        />
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        //position: 'absolute',
        //top: 0,

    },
    rightContainer: {
        flex: 1,
        //backgroundColor: 'green',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        marginEnd: '5%'
    },

})

export default HomeHeader;

