import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Constants from '../../../services/Constants'
import { Badge } from 'react-native-elements'
import IconComponent from '../../Common/IconComponent';
import { ImageConst } from '../../../services/ImageConstants';
import GiftVoucherBadge from "../../Common/GiftVoucherBadge";

class MyListHeader extends PureComponent {
    render() {
        return (
            <View style={styles.container}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, fontFamily: Constants.LIST_FONT_FAMILY }}>
                        My List
                    </Text>
                </View>

                <View style={styles.rightContainer}>
                    <GiftVoucherBadge
                        onGiftVoucherClick={this.props.giftVoucherClicked}
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        height: Constants.TOP_HEADER_HEIGHT,
        width: Constants.SCREEN_WIDTH,
        justifyContent: 'center',
        paddingHorizontal: '5%',
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    rightContainer: {
        flex: 1,
        alignItems: 'center',
        marginEnd: '5%',
        flexDirection: 'row-reverse',
    }
})
export default MyListHeader