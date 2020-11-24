import React, { PureComponent } from 'react';
import {
    FlatList,
    Text,
    Image,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Linking
}
    from 'react-native';
import { Divider, Button } from 'react-native-elements';
import * as Constants from '../../../services/Constants';
import moment from 'moment';

class NearMeListComponent extends PureComponent {
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

    onOpenMapHandler = (item) => {
        let latitude = item.store.location.coordinates[1];
        let longitude = item.store.location.coordinates[0];
        console.log("lat-long>>>", latitude + ">>>>>" + longitude);
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${latitude},${longitude}`;
        const label = item.store.description.trim();
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }

    renderComponent = ({ item }) => {
        let address = (item.store.address.address1 || '') + (item.store.address.address2 || '')
        let distanceInKM = Math.round(item.distance / 1000) + 'km'
        let StartTime = moment(item.store.openingTime, "LTS").format('h:mma');
        let EndTime = moment(item.store.closingTime, "LTS").format('h:mma');

        let beginningTime = moment(StartTime, 'h:mma');
        let endingTime = moment(EndTime, 'h:mma');
        console.log('beginningTime', StartTime)
        console.log('endingTime', EndTime)
        console.log('openTimeFormat', beginningTime.isBefore(endingTime))
        console.log('closeTimeFormat', endingTime.isBefore(beginningTime))
        let openTimeFormat
        let closeTimeFormat
        if (beginningTime.isBefore(endingTime)) {

            openTimeFormat = 'Open'

        } else {
            // openTimeFormat = moment(this.storeDetails.openingTime,"LTS").format("HH:mm");
            openTimeFormat = 'Opens' + ' ' + moment(item.store.openingTime, "LTS").utcOffset('+05:30').format('LT');
        }

        if (endingTime.isBefore(beginningTime)) {

            closeTimeFormat = 'Closed'

        } else {

            //closeTimeFormat = moment(this.storeDetails.closingTime,"LTS").format("HH:mm");
            closeTimeFormat = 'Closes' + ' ' + moment(item.store.closingTime, "LTS").utcOffset('+05:30').format('LT');
        }
        return (
            <TouchableWithoutFeedback onPress={() => this.onItemClickHandler(item)}>
                <View style={styles.listRow}>
                    <Image style={styles.listImage}
                        source={{ uri: Constants.imageResBaseUrl + item.store.retailer.iconURL || Constants.DEFAULT_STORE_ICON }} />
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
                    {/* <View style={{ flex: 0.3, flexDirection: 'row', marginTop: '3%', alignSelf: 'flex-start' }}>
                        <Text style={{
                            fontSize: Constants.LIST_FONT_SIZE_ADDRESS,
                            fontFamily: Constants.LIST_FONT_FAMILY,
                            color: Constants.DOBO_GREY_COLOR,
                        }}>
                            {'5.0'}
                        </Text>
                        <IconComponent
                            style={{ marginHorizontal: '5%', }}
                            name={ImageConst["star-rating"]}
                            size={12} />
                    </View> */}
                    <Divider style={{ backgroundColor: '#CEDCCE', width: 1, height: '70%', alignSelf: "center", marginRight: 5 }} />
                    <View style={{ flex: 1, marginStart: '3%', marginTop: 15 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.storeInfoText}>
                                {openTimeFormat}
                            </Text>
                            <Text style={styles.storeInfoText}>
                                {closeTimeFormat}
                            </Text>
                        </View>

                        <View style={{ flex: 1, marginTop: '5%' }}>
                            <Button
                                title={distanceInKM}
                                onPress={() => { this.onOpenMapHandler(item) }}
                                buttonStyle={styles.locButton}
                                containerStyle={{
                                    marginEnd: '15%'
                                }}
                                icon={{
                                    name: 'map-marker',
                                    type: 'font-awesome',
                                    size: 10,
                                    color: 'white',
                                }}
                                titleStyle={{ fontSize: 10 }}
                            />
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
                data={this.props.data}
                renderItem={this.renderComponent}
                keyExtractor={(item) => item.store.id.toString()}
            >
            </FlatList>
        )
    }
}

const styles = StyleSheet.create({

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
        flex: 1.5,
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
    storeInfoText: {
        fontSize: 11,
        padding: 3,
        // marginTop: '5%',
        //fontWeight:'700',
        fontFamily: Constants.LIST_FONT_FAMILY,
    },
    locButton: {
        //justifyContent: 'space-evenly',
        backgroundColor: Constants.DOBO_RED_COLOR,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden',
        //marginTop: '5%',
        height: Platform.OS === 'ios' ? 30 : '80%'
    }

});

export default NearMeListComponent;