import React, { Component } from 'react';
import {
    FlatList,
    Text,
    Image,
    View,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import { Icon } from 'react-native-elements'
import { Divider } from 'react-native-elements';
import * as Constants from '../../services/Constants'
import IconComponent from '../Common/IconComponent';
import { ImageConst } from '../../services/ImageConstants';

class StoreCheckinListComponent extends Component {
    constructor(props) {
        super(props);
        this.onItemClickHandler = this.onItemClickHandler.bind(this);
    }
    state = {
        value: '5.0'
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
        let address = (item.store.address.address1 || '') + (item.store.address.address2 || '');
        return (
            <TouchableWithoutFeedback onPress={() => this.onItemClickHandler(item)}>
                <View style={styles.listRow}>
                    <Image style={styles.listImage}
                        source={{ uri: Constants.imageResBaseUrl + item.store.retailer.iconURL || Constants.DEFAULT_STORE_ICON }} />
                    <View style={styles.rowText}>
                        <Text
                            style={styles.listNameText}>
                            {item.store.description.trim() || ''}
                        </Text>
                        <Text numberOfLines={2}
                            style={styles.listAddressText}>
                            {address}
                        </Text>
                    </View>
                    {/* <View style={{ flex: 0.2, flexDirection: 'row', marginTop: '3%',alignSelf:'flex-start' }}>
                        <Text style={{ fontSize: Constants.LIST_FONT_SIZE_ADDRESS, fontFamily: Constants.LIST_FONT_FAMILY }}>
                            {this.state.value}
                        </Text>
                        <IconComponent
                            style={{ marginHorizontal: '5%' }}
                            name={ImageConst["star-rating"]}
                            size={12}
                        />
                    </View> */}
                    <Divider style={{ backgroundColor: '#CEDCCE', width: 1, height: 70, alignSelf: "center", marginLeft: 5, marginRight: 5 }} />
                    <View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {/* <Icon
                                name="room"
                                type="material-icons"
                                color={Constants.DOBO_RED_COLOR}
                                style={styles.iconImage}
                            /> */}
                            <IconComponent
                                name={ImageConst["checkin-pin"]}
                                size={22}
                            />

                            <Text style={{
                                marginLeft: 5,
                                marginRight: 10,
                                color: Constants.DOBO_RED_COLOR,
                                fontFamily: Constants.BOLD_FONT_FAMILY
                            }}>CHECK-IN</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        return (
            <FlatList
                ItemSeparatorComponent={this.renderSeparatorView}
                data={this.props.data}
                renderItem={this.renderComponent}
                keyExtractor={item => item.store.id.toString()}>
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
        borderBottomColor: "black"
    },
    listImage: {
        width: 70,
        height: 70,
        marginVertical: '2%',
        marginHorizontal: '4%',
        borderRadius: 10
    },
    rowText: {
        flex: 1
    },
    listNameText: {
        marginTop: '5%',
        fontSize: Constants.LIST_FONT_HEADER_SIZE,
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: Constants.DOBO_GREY_COLOR
    },
    listAddressText: {
        fontSize: Constants.LIST_FONT_SIZE_ADDRESS,
        color: Constants.BODY_TEXT_COLOR,
        marginTop: '5%'
        //textAlignVertical: 'top'
    },
    iconImage: {
        marginLeft: 20,

    },
    iconImage1: {
        marginLeft: 20,
        marginBottom: 15
    },

});

export default StoreCheckinListComponent;