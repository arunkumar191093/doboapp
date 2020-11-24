import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Divider } from 'react-native-elements';
import * as Constants from '../../../services/Constants';
import { GetVoucherByRetailer } from '../../../services/VoucherApi'

class RetailerVouchers extends Component {

    static navigationOptions = {
        title: 'Gift Vouchers'
    }
    retailerDetails = {};
    couponCode = ''
    state = {
        vouchersListData: [],
        loading: false,
    };
    constructor(props) {
        super(props);
        this.couponCode = this.props.navigation.getParam('couponCode') || '';
        this.retailerDetails = this.props.navigation.getParam('listVal');
        this.onVoucherClickHandler = this.onVoucherClickHandler.bind(this);
    }

    onVoucherClickHandler = (item) => {
        this.props.navigation.navigate('VoucherDetails', { value: item, couponCode: this.couponCode })
    }


    componentDidMount = async () => {
        let id = this.retailerDetails.id;
        this.callGetRetailerVouchers(id);
    };


    callGetRetailerVouchers = async (id) => {
        this.startLoading();
        let response = await GetVoucherByRetailer(id);
        console.log('callGetRetailerVouchers', response)
        if (response.status === 200) {
            let vouchersData = response.responseJson;
            this.setState({ vouchersListData: JSON.parse(vouchersData) });
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


    renderComponent = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => this.onVoucherClickHandler(item)}>
                <View style={styles.giftVoucherImage}>
                    <View>
                        <Image style={{ height: 120 }}
                            source={{ uri: Constants.baseURL + item.retailer.iconURL }}
                            resizeMode='stretch'
                        />
                    </View>
                    <View style={styles.giftVoucher}>
                        <Text style={styles.amount}>
                            {'\u20B9'} {item.amount}
                        </Text>
                        <Divider style={styles.divider} />
                        <Text style={styles.discount}>
                            {item.discount}% OFF
                    </Text>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.listRow}>
                    <Image style={styles.listImage}
                        source={{ uri: Constants.baseURL + this.retailerDetails.iconURL || Constants.DEFAULT_STORE_ICON }} />
                    <View style={styles.rowText}>
                        <View>
                            <Text numberOfLines={3}
                                style={styles.listNameText}>
                                {this.retailerDetails.name}
                            </Text>
                        </View>
                        <View>
                            <Text numberOfLines={3}
                                style={styles.listAddressText}>
                                GIFT VOUCHERS
                        </Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CEDCCE",
                }}
                />
                <View style={{ marginTop: 10, flex: 1 }}>
                    <FlatList
                        numColumns={2}
                        columnWrapperStyle={{ margin: 2 }}
                        data={this.state.vouchersListData}
                        renderItem={this.renderComponent}
                        keyExtractor={(item) => item.id.toString()}
                    >
                    </FlatList>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    listRow: {
        flexDirection: "row",
        backgroundColor: "#F2F2F2",
        height: '15%'
    },
    listImage: {
        width: '20%',
        height: '75%',
        margin: '3%',
        borderRadius: 10
    },
    rowText: {
        flexDirection: "column",
        fontFamily: Constants.LIST_FONT_FAMILY,
        flex: 1,
    },
    listNameText: {
        marginTop: '5%',
        fontSize: 20,
        color: 'black',
        fontFamily: Constants.LIST_FONT_FAMILY
    },
    listAddressText: {
        fontSize: 16,
        color: '#80B1C1',
        marginTop: '2%',
        fontFamily: Constants.LIST_FONT_FAMILY
    },
    iconImage: {
        marginLeft: 20,

    },
    voucherImage: {
        height: 150,
        alignSelf: 'center',
        // marginTop: '10%'
    },
    discount: {
        fontSize: 16,
        fontWeight: "bold",
        alignSelf: 'center',
        fontFamily: Constants.LIST_FONT_FAMILY,
    },
    amount: {
        alignSelf: 'center',
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 16,
        fontWeight: "bold",
    },
    giftVoucher: {
        bottom: 0,
        flexDirection: 'row',
        position: 'absolute',
        backgroundColor: "#F4F4F4",
        width: '100%', height: '35%',
        justifyContent: 'center'
    },
    divider: {
        backgroundColor: '#CEDCCE',
        width: 1,
        height: '60%',
        alignSelf: "center",
        marginLeft: '5%',
        marginRight: '5%'
    },
    giftVoucherImage: {
        // borderColor: '#F2F2F2',
        height: 180,
        margin: 2,
        // borderWidth: 1,
        flex: 0.5,
        flexDirection: 'column',
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.65,
        elevation: 3,
        backgroundColor: 'white'
    },
});


export default RetailerVouchers