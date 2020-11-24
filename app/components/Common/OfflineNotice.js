import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import * as Constants from '../../services/Constants';

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
    return (
        <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
    );
}

class OfflineNotice extends PureComponent {
    unsubscribe = null
    state = {
        isConnected: true
    };

    componentDidMount() {
        this.unsubscribe = NetInfo.addEventListener(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            this.setState({ isConnected: state.isConnected })
        });
    }

    componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
    }

    handleConnectivityChange = isConnected => {
        this.setState({ isConnected });
    };

    render() {
        if (!this.state.isConnected) {
            return <MiniOfflineSign />;
        }
        return null;
    }
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        position: 'absolute',
        top: 30
    },
    offlineText: { color: '#fff',fontFamily:Constants.LIST_FONT_FAMILY }
});

export default OfflineNotice;