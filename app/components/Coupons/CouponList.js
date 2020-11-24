import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';
import { Divider, Button } from 'react-native-elements';
import * as Constants from '../../services/Constants';
import moment from 'moment';


class CouponList extends Component {

    constructor(props) {
        super(props);
        this.onCouponClickHandler = this.onCouponClickHandler.bind(this);
    }

    onCouponClickHandler = (item) => {
        this.props.onCurrentItemClick(item)
    }

    // onGetHandler = (item) => {
    //     Alert.alert(item.code)
    //     //this.props.onGetPress(item)
    // }


    renderComponent = ({ item }) => {
        //  const afterToFormat = moment(item.endTime).add(this.details.validity, 'days').calendar();
        const ValidToDateToFormat = moment(item.endTime).format("DD MMM YYYY");
        let imageURL = item.retailer != null && item.retailer.iconURL !== undefined ? (Constants.imageResBaseUrl + item.retailer.iconURL) : Constants.DEFAULT_DOBO_ICON

        return (
            // <TouchableWithoutFeedback onPress={() => this.onCouponClickHandler(item)}>
            <View style={styles.CouponDetails}>
                <View style={styles.CouponImg}>
                    <View style={{ alignItems: 'center' }}>
                        <Image style={styles.listImage}
                            source={{ uri: imageURL }}
                            resizeMode='stretch' />
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
                        <Divider style={styles.DividerStyle} />
                        <Divider style={styles.DividerStyle} />
                        <Divider style={styles.DividerStyle} />
                    </View>
                </View>
                <View style={styles.CouponDiscount}>
                    <View style={styles.CouponDiscountDet}>
                        <View>
                            <Text style={styles.DiscountText}>{item.discount}%</Text>
                        </View>
                        <View>
                            <Text style={styles.DiscountDateText}>Expiry Date: {ValidToDateToFormat}</Text>
                        </View>
                        <View style={styles.DiscountButton}>
                            <Button
                                title='GET'
                                onPress={() => this.props.onGetPress(item)}
                                buttonStyle={styles.getButton}
                                // containerStyle={{
                                //     marginEnd: '5%'
                                // }}                                  
                                titleStyle={styles.titleButton}
                            ><Text style={styles.alertMessageButtonTextStyle}>{this.props.positiveButtonText}</Text></Button>
                        </View>
                    </View>
                </View>
            </View>
            // </TouchableWithoutFeedback>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    data={this.props.data}
                    renderItem={this.renderComponent}
                    keyExtractor={(item) => item.id.toString()}
                >
                </FlatList>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '2%'
    },
    CouponDetails: {
        flexDirection: 'row',
        margin: 5
    },
    CouponImg: {
        padding: 10,
        backgroundColor: '#D4EAF8',
        borderTopRightRadius: Constants.SCREEN_WIDTH * 0.05,
        borderTopLeftRadius: Constants.SCREEN_WIDTH * 0.02,
        borderBottomLeftRadius: Constants.SCREEN_WIDTH * 0.02,
        borderBottomRightRadius: Constants.SCREEN_WIDTH * 0.05,
        flex: 0.6,
        justifyContent: 'center'
    },
    listImage: {
        width: 70,
        height: 70,
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
        borderWidth: 0.1,
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
        flex: 1,
        justifyContent: 'center',
    },
    DiscountText: {
        fontFamily: Constants.BOLD_FONT_FAMILY,
        fontSize: 30,
        color: '#3D596C'
    },
    DiscountDateText: {
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 10
    },
    DiscountButton: {
        flex: 0.12,
        justifyContent: 'center'
    },
    getButton: {
        //justifyContent: 'space-evenly',
        backgroundColor: Constants.DOBO_RED_COLOR,
        borderRadius: 40,
        width: '45%',
        overflow: 'hidden',
        //marginTop: '5%',
        height: Platform.OS === 'ios' ? 30 : '80%'
    },
    titleButton: {
        fontSize: 11,
        fontFamily: Constants.BOLD_FONT_FAMILY
    },

});

export default CouponList;