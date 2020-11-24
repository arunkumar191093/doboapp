import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity, Modal } from 'react-native'
import * as Constants from '../../services/Constants'
import { connect } from 'react-redux';
import * as networkActions from '../../actions/network';
import { bindActionCreators } from 'redux';
import NetInfo from "@react-native-community/netinfo";

class NoNetwork extends Component {

    constructor() {
        super()
    }

    componentDidMount() {
        this.unsubscribe = NetInfo.addEventListener(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            this.props.actions.changeNetworkState(state.isConnected)
        });
    }

    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
    }

    onTryAgainPress = () => {
        console.log('OnTryAgainPress()')
        let { actions, isConnected } = this.props;
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            actions.changeNetworkState(state.isConnected)
            console.log('Redux connected state>>', isConnected)
        });

    }
    render() {
        let { isConnected } = this.props;
        return (
            <Modal style={styles.container}
                animationType="slide"
                visible={!isConnected}
            >
                <Image
                    style={styles.doboImage}
                    source={require('../../assets/images/app_icon.png')}
                    resizeMode='contain'
                />

                <Text style={styles.messageText}>
                    Could not connect to the Internet. Please check your network.
                </Text>
                <TouchableOpacity
                    style={{ alignItems: 'center', alignSelf: 'center' }}
                    onPress={() => this.onTryAgainPress()}>

                    <Text style={{ color: Constants.DOBO_RED_COLOR,fontFamily:Constants.LIST_FONT_FAMILY }}>
                        Try again
					</Text>
                </TouchableOpacity>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1
    },
    doboImage: {
        height: '40%',
        width: '40%',
        alignSelf: 'center',
        marginTop: 50,

    },
    messageText: {
        textAlign: 'center',
        marginHorizontal: '5%',
        marginVertical: '5%',
        fontFamily:Constants.LIST_FONT_FAMILY
    }
})

const mapStateToProps = state => ({
    isConnected: state.network.isConnected,
});

const ActionCreators = Object.assign(
    {},
    networkActions,
);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NoNetwork)