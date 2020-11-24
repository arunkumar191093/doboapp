import React, { Component } from 'react';
import {
    FlatList,
    Text,
    View,
    StyleSheet,
    TouchableWithoutFeedback
}
    from 'react-native';
import { Icon } from 'react-native-elements'
import * as Constants from '../../services/Constants';
import IconComponent from '../Common/IconComponent';
import { ImageConst } from '../../services/ImageConstants';

class SavedAddressList extends Component {
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

    renderIcon(tag) {

        switch (tag) {
            case 'Home':
                return (
                    <IconComponent
                        name={ImageConst['icon-home-address']}
                        size={20}
                        style={styles.iconImage} />
                )
            case 'Work':
                return (
                    <IconComponent
                        name={ImageConst['icon-office-address']}
                        size={20}
                        style={styles.iconImage} />
                )
            default:
                return (
                    <Icon
                        name="location-on"
                        type="material-icons"
                        containerStyle={styles.iconImage}
                        color={Constants.LABEL_FONT_COLOR} />
                )

        }
        // if(item.tag.localeCompare('Home')){

        // }else if(item.tag.localeCompare('Home')){}
    }

    renderComponent = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => this.onItemClickHandler(item)}>
                <View style={styles.listRow}>
                    {this.renderIcon(item.tag)}
                    <View style={styles.rowText}>
                        <Text
                            style={styles.listNameText}>
                            {item.name}
                        </Text>
                        <Text numberOfLines={3}
                            style={styles.listAddressText}>
                            {item.longAddress}
                        </Text>
                    </View>
                    <Icon
                        name="dots-vertical"
                        type="material-community"
                        containerStyle={styles.iconImage}
                        resizeMode='contain' />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    renderHeaderComponent() {
        return (
            <Text style={{ fontSize: 18, marginLeft: '5%', fontFamily: Constants.BOLD_FONT_FAMILY }}>
                Saved Addresses
            </Text>
        )
    }

    render() {
        //console.log('List Data inside List Component>>>', this.props.data)
        return (
            <FlatList
                ItemSeparatorComponent={this.renderSeparatorView}
                data={this.props.data}
                renderItem={this.renderComponent}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={this.renderHeaderComponent}

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
        borderBottomColor: "black"
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
        marginHorizontal: '10%',
    },
    listNameText: {
        marginTop: '5%',
        fontSize: 18,
        color: '#295C73',
        fontFamily: Constants.LIST_FONT_FAMILY
    },
    listAddressText: {
        marginTop: '1%',
        fontSize: 12,
        color: '#295C73',
        fontFamily: Constants.LIST_FONT_FAMILY
    },
    iconImage: {
        marginLeft: '5%',
        justifyContent: 'center'

    },
    iconImage1: {
        marginLeft: 20,
        marginBottom: 15
    },

});

export default SavedAddressList;