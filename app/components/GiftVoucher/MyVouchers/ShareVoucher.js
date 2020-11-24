import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { Icon, Button, CheckBox } from 'react-native-elements';
import * as Constants from '../../../services/Constants';
class ShareVoucher extends Component {

    state = {
        isModalVisible: false,
        checked: false
    }

    constructor(props) {
        super(props);
        this.onCloseClick = this.onCloseClick.bind(this);
    }

    onCloseClick = () => {
        this.props.onModalClose();
    }

    render() {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}>
                    <View style={{ backgroundColor: 'rgba(0, 0, 0 0.8)', flex: 0.6 }}>
                    </View>
                    <View style={styles.modal}>
                        <TouchableWithoutFeedback>
                            <TouchableOpacity style={{ right: 10, position: 'absolute', padding: 20 }}
                                onPress={
                                    this.onCloseClick
                                }>
                                <Icon name="close" type="material" color={Constants.DOBO_RED_COLOR}></Icon>
                            </TouchableOpacity>
                        </TouchableWithoutFeedback>
                        <View style={{ marginTop: '12%' }}>
                            <Text style={{
                                fontFamily: Constants.LIST_FONT_FAMILY,
                                fontSize: 16, color: Constants.DOBO_GREY_COLOR, paddingLeft: '5%'
                            }}>
                                Share voucher to someone
                            </Text>
                        </View>
                        <View style={{ marginTop: '2%' }}>
                            <Text style={{
                                fontFamily: Constants.LIST_FONT_FAMILY, paddingLeft: '3%',
                                fontSize: Constants.LIST_FONT_HEADER_SIZE, color: Constants.BODY_TEXT_COLOR, textAlign: 'center'
                            }}>
                                Provide mobile number or email address of the person you wanted to share the voucher.
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: '5%', marginTop: '3%' }}>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    style={{ borderBottomColor: Constants.LIGHT_GREY_COLOR, borderBottomWidth: 1 }}
                                    placeholder="Enter mobile number">
                                </TextInput>
                            </View>
                            <View style={{ flex: 0.5, alignSelf: 'center' }}>
                                <Icon name="contacts" type="material"
                                    color={Constants.LIGHT_GREY_COLOR} />
                            </View>
                        </View>
                        <View style={{ marginTop: '2%', marginLeft: '3%', marginRight: '10%' }}>
                            <CheckBox
                                title='Share via WhatsApp'
                                checked={this.state.checked}
                                onPress={() => this.setState({ checked: !this.state.checked })}
                            />
                        </View>
                        <View style={{ marginTop: '2%' }}>
                            <Text style={{
                                textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY,
                                fontSize: Constants.LIST_FONT_HEADER_SIZE
                            }}>
                                OR
                            </Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: '5%', marginRight: '10%' }}>
                            <TextInput
                                style={{ borderBottomColor: Constants.LIGHT_GREY_COLOR, borderBottomWidth: 1 }}
                                placeholder="Enter email address">
                            </TextInput>
                        </View>
                    </View>
                    <View style={styles.footerView}>
                        <View style={{ marginLeft: '30%', marginRight: '30%', alignItems: 'center' }}>
                            <Button
                                title="Share"
                                buttonStyle={styles.buyVoucherButton}
                                titleStyle={{ fontSize: 16, padding: 30 }}
                                onPress={this.onApplyFilterHandler}
                            />
                        </View>

                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    pager: {
        marginTop: Constants.TOP_HEADER_HEIGHT,
    },
    category: {
        flexDirection: "row",
        width: '100%',
        backgroundColor: '#F9EEED'
    },
    categoryImage: {
        marginLeft: 20,
        marginTop: 20,
        marginBottom: 5
    },
    categoryView: {
        marginTop: 20
    },
    filterIcon: {

        marginTop: 20,
        marginBottom: 5,
        width: 36,
        height: 36,
        alignItems: "center"
    },
    filterView: {
        marginTop: 20,
        position: "absolute",
        right: 10,
    },
    fabButton: {
        borderRadius: 35,
        marginRight: -20,
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 40,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: Constants.DOBO_RED_COLOR,
        overflow: 'hidden'
    },
    fabExpandButton: {
        flexDirection: "row",
        borderRadius: 35,
        marginRight: -20,
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 40,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: Constants.DOBO_RED_COLOR,
        overflow: 'hidden'
    },
    modal: {
        flex: 1,
        borderColor: '#fff',
        backgroundColor: "white",
    },
    footerView: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        borderTopColor: '#DAE7EC',
        borderWidth: 1,
        width: '100%',
        height: '8%',
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    buyVoucherButton: {
        alignSelf: 'center',
        borderRadius: 30,
        backgroundColor: 'red',
        justifyContent: 'center',
    },
});

export default ShareVoucher;
