import React, { PureComponent } from 'react';
import {
    FlatList,
    Text,
    Image,
    View,
    StyleSheet,
    TouchableOpacity
}
    from 'react-native';
import * as Constants from '../../services/Constants';
import IconComponent from '../Common/IconComponent';
import { ImageConst } from '../../services/ImageConstants';
import moment from 'moment';

class MyCheckinList extends PureComponent {
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

    renderComponent = ({ item }) => {
        let address = (item.storeAddress.address1 || '') + (item.storeAddress.address2 || '')
        let imageURL = item.iconURL !== null ? item.iconURL.indexOf('http') > -1 ? item.iconURL : (Constants.imageResBaseUrl + item.iconURL) : Constants.DEFAULT_STORE_ICON
        let lastCheckin = item.lastCheckIn
        let formattedLastCheckin = ''
        let aggRating = item.aggStoreRating || '';
        if (lastCheckin !== undefined) {
            formattedLastCheckin = moment(lastCheckin).format('D MMM YYYY')
        }
        return (
            <TouchableOpacity onPress={() => this.onItemClickHandler(item)} style={styles.checklistItemContainer}>
                <View style={styles.listRow}>
                    <Image style={styles.listImage}
                        source={{ uri: imageURL }} />
                    <View style={styles.rowText}>
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={2}
                                style={styles.listNameText}>
                                {item.storeDescription.trim()}
                            </Text>
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text numberOfLines={3}
                                style={styles.listAddressText}>
                                {address}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flex: 0.3, flexDirection: 'row', marginTop: '3%', alignSelf: 'flex-start' }}>
                        {
                            !!aggRating &&
                            <>
                                <Text style={{
                                    fontSize: Constants.LIST_FONT_SIZE_ADDRESS,
                                    fontFamily: Constants.LIST_FONT_FAMILY,
                                    color: Constants.DOBO_GREY_COLOR,
                                }}>
                                    {aggRating}
                                </Text>
                                <IconComponent
                                    style={{ marginHorizontal: '5%', }}
                                    name={ImageConst["star-rating"]}
                                    size={12} />
                            </>
                        }
                    </View>
                </View>
                <View style={styles.checkinDetailRow}>
                    <View style={{ ...styles.roundCornerView }}>
                        <Text style={styles.checkinDetailText}>
                            <Text style={styles.boldCheckinDetailsText}>
                                {item.checkInCount + " "}
                            </Text>
                            <Text>
                                Check-ins
                            </Text>
                        </Text>
                    </View>
                    <View style={{ ...styles.roundCornerView, marginStart: '2%' }}>
                        <Text style={styles.checkinDetailText}>
                            <Text>
                                Last Check-in on
                            </Text>
                            <Text style={styles.boldCheckinDetailsText}>
                                {" " + formattedLastCheckin}
                            </Text>
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <FlatList
                // ItemSeparatorComponent={this.renderSeparatorView}
                data={this.props.data}
                renderItem={this.renderComponent}
                keyExtractor={(item) => item.storeId.toString()}
            >
            </FlatList>
        )
    }
}

const styles = StyleSheet.create({
    checklistItemContainer: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#dadada',
        paddingBottom: 4
    },
    listRow: {
        flexDirection: "row",
        flex: 3,
    },
    checkinDetailRow: {
        flexDirection: "row",
        flex: 1,
        paddingVertical: '2%',
        paddingHorizontal: 12,
        marginStart: 10,
        justifyContent: 'flex-end'
    },
    listImage: {
        width: 60,
        height: 60,
        margin: 10,
        // borderRadius: 10
    },
    rowText: {
        flexDirection: "column",
        flex: 1,
        marginTop: 10
    },
    listNameText: {
        fontSize: Constants.LIST_FONT_HEADER_SIZE,
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: Constants.DOBO_GREY_COLOR
    },
    listAddressText: {
        fontSize: 10,
        color: Constants.BODY_TEXT_COLOR,
        fontFamily: Constants.LIST_FONT_FAMILY,
    },
    roundCornerView: {
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F7EEED',
        justifyContent: 'center',
        paddingHorizontal: '5%'
    },
    checkinDetailText: {
        fontSize: 10,
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: Constants.BODY_TEXT_COLOR,
    },
    boldCheckinDetailsText: {
        fontSize: 10,
        color: Constants.BODY_TEXT_COLOR,
        fontFamily: Constants.BOLD_FONT_FAMILY
    }

});

export default MyCheckinList;