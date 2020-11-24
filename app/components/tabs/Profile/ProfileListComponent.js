import React, { Component } from 'react';
import {
    FlatList,
    Text,
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback
}
    from 'react-native';
import { Icon } from 'react-native-elements'
import * as Constants from '../../../services/Constants';

class ProfileListComponent extends Component {
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
        const renderLenthDataColor = () => {
            if (item.title == 'My Checkins') {
                return (
                    <View style={styles.CheckinLenth}>
                        <Text style={{ color: 'white', fontSize: 10 }}>{item.itemValue}</Text>
                    </View>
                )
            } else if (item.title == 'My Coupons') {
                return (
                    <View style={styles.CouponLenth}>
                        <Text style={{ color: 'white', fontSize: 10 }}>{item.itemValue}</Text>
                    </View>
                )
            }
        }

        const renderLenthData = () => {
            if (item.itemValue > 0) {
                return (renderLenthDataColor())
            } else {
                return <View style={{ backgroundColor: 'white' }} />
            }
        }
        console.log('renderComponent', item)
        return (
            <TouchableWithoutFeedback onPress={() => this.onItemClickHandler(item)}>
                <View style={styles.listRow}>
                    {/* <Icon
                        name={item.icon}
                        type={item.iconType}
                        containerStyle={styles.iconImage}
                        resizeMode='contain' /> */}
                    <Image
                        style={{ width: 25, height: 25, marginLeft: '5%' }}
                        resizeMode="contain"
                        source={item.icon}
                    />
                    <Text style={styles.listNameText}>
                        {item.title}
                    </Text>
                    {renderLenthData()}
                    {/* {
                        item.itemValue > 0 ?
                            <View style={styles.peopleInvCoup}>
                                <View style={styles.CheckinLenth}>
                                    <Text style={{ color: 'white', fontSize: 10 }}>{item.itemValue}</Text>
                                </View>
                            </View>

                            :
                            <View style={{ backgroundColor: 'white' }} />
                    } */}

                </View>
            </TouchableWithoutFeedback>
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
            >
            </FlatList>
        )
    }
}

const styles = StyleSheet.create({

    listRow: {
        flexDirection: "row",
        borderBottomColor: "black",
        flex: 1,
        height: 60,
        alignItems: "center",
    },
    listNameText: {
        fontSize: 18,
        color: Constants.LABEL_FONT_COLOR,
        marginLeft: '5%',
        fontFamily: Constants.LIST_FONT_FAMILY
    },
    iconImage: {
        marginLeft: '5%',
        marginTop: '5%'
    },
    CheckinLenth: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Constants.DOBO_GREY_COLOR,
        borderRadius: 20,
        height: 21,
        width: 21,
        marginLeft: '2%'
    },
    CouponLenth: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Constants.DOBO_RED_COLOR,
        borderRadius: 20,
        height: 21,
        width: 21,
        marginLeft: '2%'
    },

});

export default ProfileListComponent;