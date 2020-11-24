import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Text
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Constants from '../../services/Constants';

class LoginMiniView extends Component {
    render() {
        return (
            <View style={[styles.parentContainer]}>
                <View style={[styles.iconViewContainer]}>
                    <Icon name="keyboard-arrow-up"
                        size={30}
                        color='red'
                    />
                </View>
                <View style={[styles.textViewContainer,]}>
                    <Text style={styles.firstText}>
                        LOGIN
                    </Text>
                    <Text style={styles.secondText}>
                        OR
                    </Text>
                    <Text style={{fontFamily:Constants.LIST_FONT_FAMILY}}>
                        REGISTER
                    </Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    parentContainer: {
        justifyContent: 'flex-start',
        //alignItems: 'center',
        //backgroundColor: 'blue'
    },
    iconViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'orange'
    },
    textViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        //backgroundColor: 'grey'
    },
    firstText: {
        marginLeft: '2%',
        fontFamily:Constants.LIST_FONT_FAMILY
    },
    secondText: {
        color: 'red',
        padding: '2%',
        fontFamily:Constants.LIST_FONT_FAMILY
    }
});

export default LoginMiniView