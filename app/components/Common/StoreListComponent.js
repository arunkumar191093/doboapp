import React, { PureComponent } from 'react';
import {
    FlatList,
    Text,
    Image,
    View,
    StyleSheet,
    TouchableWithoutFeedback
}
    from 'react-native';
import { Divider } from 'react-native-elements';
import * as Constants from '../../services/Constants';
import IconComponent from '../Common/IconComponent';
import { ImageConst } from '../../services/ImageConstants';

class StoreListComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.onItemClickHandler = this.onItemClickHandler.bind(this);
    }

    onItemClickHandler = (item) => {
        this.props.onCurrentItemClick(item);
    }
    renderSeparatorView = () => {
        return (
            <View style={{
                height: 1,
                width: "100%",
                backgroundColor: "#CEDCCE",
            }}
            />
        );
    };

    calculateAggRating(data) {
        const { storeReviewAnalytics } = data;
        if (storeReviewAnalytics) {
            let total = storeReviewAnalytics.productQualityAverage + storeReviewAnalytics.purchaseExpAverage + storeReviewAnalytics.storeStaffSupportAverage;
            let aggStoreRating = (total / 3).toFixed(1);
            return aggStoreRating.toString();
        }
        else {
            return ''
        }

    }

    renderComponent = ({ item }) => {
        let address = (item.store.address.address1 || '') + (item.store.address.address2 || '')
        let distanceInKM = Math.round(item.distance / 1000) + 'km'
        let storeRating = this.calculateAggRating(item.store);
        let mediaURL = item.store && item.store.retailer && item.store.retailer.iconURL && item.store.retailer.iconURL.indexOf('http') > -1 ? item.store.retailer.iconURL : Constants.imageResBaseUrl + item.store.retailer.iconURL
        return (
            <TouchableWithoutFeedback onPress={() => this.onItemClickHandler(item)}>
                <View style={styles.listRow}>
                    <Image style={styles.listImage}
                        source={{ uri: mediaURL || Constants.DEFAULT_STORE_ICON }} />
                    <View style={styles.rowText}>
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={3}
                                style={styles.listNameText}>
                                {item.store.description.trim()}
                            </Text>
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text numberOfLines={3}
                                style={styles.listAddressText}>
                                {address}
                            </Text>
                        </View>
                    </View>
                    {/*Commented on DOBO team request*/}
                    <View style={{ flex: 0.3, flexDirection: 'row', marginTop: '3%', alignSelf: 'flex-start' }}>
                        {
                            !!storeRating &&
                            <>
                                <Text style={{
                                    fontSize: Constants.LIST_FONT_SIZE_ADDRESS,
                                    fontFamily: Constants.LIST_FONT_FAMILY,
                                    color: Constants.DOBO_GREY_COLOR,
                                }}>
                                    {storeRating}
                                </Text>
                                <IconComponent
                                    style={{ marginHorizontal: '5%', }}
                                    name={ImageConst["star-rating"]}
                                    size={12} />
                            </>
                        }
                    </View>
                    <Divider style={{ backgroundColor: '#CEDCCE', width: 1, height: '70%', alignSelf: "center", marginRight: 5 }} />
                    <View style={{ flexDirection: "column", marginStart: '2%', justifyContent: 'center', flex: 0.6 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: '10%' }}>
                            {/* <Image style={{ width: 12, height: 12 }} resizeMode="contain" source={require('../../assets/images/deals.png')} /> */}
                            <IconComponent
                                name={ImageConst["deals"]}
                                size={12} />
                            <Text style={{
                                marginLeft: 5,
                                marginRight: 10,
                                fontSize: Constants.LIST_FONT_SIZE_ADDRESS,
                                fontFamily: Constants.LIST_FONT_FAMILY,
                                color: Constants.DOBO_GREY_COLOR,
                            }}>{item.deals + ' DEALS'}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <IconComponent
                                name={ImageConst["distance"]}
                                size={12} />
                            <Text style={{
                                marginLeft: 5,
                                marginRight: 10,
                                fontSize: Constants.LIST_FONT_SIZE_ADDRESS,
                                fontFamily: Constants.LIST_FONT_FAMILY,
                                color: Constants.DOBO_GREY_COLOR
                            }}>{distanceInKM}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    render() {
        return (
            <FlatList
                ItemSeparatorComponent={this.renderSeparatorView}
                showsVerticalScrollIndicator={false}
                data={this.props.data}
                renderItem={this.renderComponent}
                keyExtractor={(item) => item.store ? item.store.id.toString() : item.id.toString()}
            >
            </FlatList>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    listRow: {
        flexDirection: "row",
        flex: 1,
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
        marginTop: 10,
        fontSize: Constants.LIST_FONT_HEADER_SIZE,
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: Constants.DOBO_GREY_COLOR
    },
    listAddressText: {
        fontSize: Constants.LIST_FONT_SIZE_ADDRESS,
        color: Constants.BODY_TEXT_COLOR,
        marginTop: '5%',
        fontFamily: Constants.LIST_FONT_FAMILY,
    },
    iconImage: {
        marginLeft: 20,
        width: 100,
        height: 50,

    },
    iconImage1: {
        marginLeft: 20,
        marginBottom: 15
    },

});

export default StoreListComponent;