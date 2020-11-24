import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    RefreshControl
} from 'react-native';
import { Divider } from 'react-native-elements';
import * as Constants from '../../../services/Constants';

class VoucherList extends Component {

    constructor(props) {
        super(props);
        this.onVoucherClickHandler = this.onVoucherClickHandler.bind(this);
    }

    onVoucherClickHandler = (item) => {
        this.props.onCurrentItemClick(item)
    }

    renderComponent = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => this.onVoucherClickHandler(item)}>
                <View style={styles.giftVoucherImage}>
                    <View>
                        <Image style={{ height: 100 }}
                            source={{ uri: Constants.baseURL + item.iconURL }}
                            resizeMode='stretch'
                        />
                        <Text style={{ fontSize: 12, alignSelf: 'center' }}>
                            {item.code}
                        </Text>
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
        // console.log('callGetVoucherByUser', this.props.data)
        return (
            <View style={{ marginTop: 10, flex: 1 }}>
                <FlatList
                    numColumns={2}
                    columnWrapperStyle={{ margin: 3 }}
                    data={this.props.data}
                    renderItem={this.renderComponent}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl = {
                        <RefreshControl
                            refreshing={this.props.isRefreshing}
                            onRefresh={this.props.onRefresh}
                        />
                    }
                >
                </FlatList>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        paddingTop: 10,
        marginBottom: 10
    },
    listRow: {
        flexDirection: "row",
        backgroundColor: "#F2F2F2"
    },
    listImage: {
        width: 70,
        height: 70,
        margin: 10,
        borderRadius: 10
    },
    rowText: {
        flexDirection: "column",
        flex: 1,
    },
    listNameText: {
        marginTop: '5%',
        fontSize: 20,
        color: 'black'
    },
    listAddressText: {
        fontSize: 16,
        color: '#80B1C1',
        marginTop: '2%'
    },
    iconImage: {
        marginLeft: 20,

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
        margin: 3,
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

export default VoucherList;