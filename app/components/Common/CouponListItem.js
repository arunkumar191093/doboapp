import React, { PureComponent } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet
} from 'react-native';
import { Divider, Button } from 'react-native-elements';
import * as Constants from '../../services/Constants';
import moment from 'moment';
import IconComponent from './IconComponent';
import { ImageConst } from '../../services/ImageConstants';


class CouponListItem extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {

        const { item, onUsePress } = this.props

        const ValidToDateToFormat = moment(item.endTime).format("DD MMM YYYY");
        let imageURL = item.retailer != null && item.retailer.iconURL !== undefined ? item.retailer.iconURL.indexOf('http') > -1 ? item.retailer.iconURL : (Constants.imageResBaseUrl + item.retailer.iconURL) : null

        return (
            <View style={styles.CouponDetails}>
                <View style={styles.CouponImg}>
                    <View style={{ alignItems: 'center' }}>
                        {
                            imageURL ?
                                <Image style={styles.listImage}
                                    source={{ uri: imageURL }}
                                    resizeMode='stretch' />
                                :
                                <IconComponent
                                    name={ImageConst['dobo-thumb']}
                                    size={styles.listImage.height}
                                    resizeMode='stretch'
                                />
                        }

                    </View>
                </View>
                <View style={styles.CouponDivider}>
                    <View style={styles.DividerDetails}>
                        <Divider style={styles.DividerStyle} />
                        <Divider style={styles.DividerStyle} />
                        <Divider style={styles.DividerStyle} />
                        <Divider style={styles.DividerStyle} />
                        <Divider style={styles.DividerStyle} />
                        <Divider style={styles.DividerStyle} />
                    </View>
                </View>
                <View style={{ ...styles.CouponDiscount, flexDirection: 'row' }}>
                    <View style={styles.CouponDiscountDet}>
                        <View>
                            <Text style={styles.DiscountText}>{item.discount}% OFF</Text>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={styles.giftVoucherText}>on Gift Vouchers</Text>
                        </View>
                        <View>
                            <Text style={styles.DiscountDateText}>Expires on {ValidToDateToFormat}</Text>
                        </View>
                    </View>
                    <View style={styles.DiscountButton}>
                        <Button
                            title='USE'
                            onPress={() => onUsePress(item)}
                            buttonStyle={styles.getButton}
                            // containerStyle={{
                            //     marginEnd: '5%'
                            // }}                                  
                            titleStyle={styles.titleButton}
                        ><Text style={styles.alertMessageButtonTextStyle}>{this.props.positiveButtonText}</Text></Button>
                    </View>
                </View>
            </View>
            // </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    CouponDetails: {
        flexDirection: 'row',
        margin: 5
    },
    CouponImg: {
        padding: 5,
        backgroundColor: '#D4EAF8',
        borderTopRightRadius: Constants.SCREEN_WIDTH * 0.05,
        borderTopLeftRadius: Constants.SCREEN_WIDTH * 0.02,
        borderBottomLeftRadius: Constants.SCREEN_WIDTH * 0.02,
        borderBottomRightRadius: Constants.SCREEN_WIDTH * 0.05,
        flex: 0.4,
        justifyContent: 'center'
    },
    listImage: {
        width: 60,
        height: 60,
        margin: 10,
        borderRadius: 10
    },
    CouponDivider: {
        backgroundColor: '#D4EAF8',
        marginTop: 15,
        marginBottom: 15
    },
    DividerDetails: {
        flex: 1,
        justifyContent: 'space-around'
    },
    DividerStyle: {
        borderWidth: 0.2,
        borderRadius: 1,
        backgroundColor: 'black',
        height: '7%',
        //marginVertical: '2%'
    },
    CouponDiscount: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#D4EAF8',
        borderTopLeftRadius: Constants.SCREEN_WIDTH * 0.05,
        borderBottomLeftRadius: Constants.SCREEN_WIDTH * 0.05,
        flex: 1,
        borderTopRightRadius: Constants.SCREEN_WIDTH * 0.02,
        borderBottomRightRadius: Constants.SCREEN_WIDTH * 0.02,
    },
    CouponDiscountDet: {
        flex: 2,
        justifyContent: 'center',
        marginHorizontal: '5%'
    },
    DiscountText: {
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 20,
        color: '#3D596C'
    },
    giftVoucherText: {
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 14,
        color: '#3D596C'
    },
    DiscountDateText: {
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 10
    },
    DiscountButton: {
        flex: 1,
        //backgroundColor: 'green'
    },
    getButton: {
        //justifyContent: 'space-evenly',
        backgroundColor: Constants.DOBO_RED_COLOR,
        borderRadius: 20,
        //width: '100%',
        overflow: 'hidden',
        //marginTop: '5%',
        height: Platform.OS === 'ios' ? 30 : 30
    },
    titleButton: {
        fontSize: 11,
        fontFamily: Constants.BOLD_FONT_FAMILY
    },

});

export default CouponListItem;