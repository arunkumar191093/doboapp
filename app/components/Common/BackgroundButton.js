import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import * as Constants from '../../services/Constants'
export default class BackgroundButton extends React.Component {


    render() {
        const styles = this.makeStyles()
        return (
            <TouchableOpacity style={styles.touchable} onPress={this.props.onPress}>
                <View style={styles.view}>
                    <Text style={styles.text}>{this.props.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    makeStyles() {
        return StyleSheet.create({
            view: {
                flexDirection: 'row',
                borderRadius: 20,
                //borderColor: this.props.borderColor,
                borderWidth: 1,
                backgroundColor: this.props.backgroundColor,
                height: 35,
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 16,
                paddingRight: 16
            },
            touchable: {
                marginLeft: '2%',
                marginRight: '2%',
                marginBottom: 0
            },
            text: {
                textAlign: 'center',
                color: this.props.textColor,
                fontSize: 16,
                fontFamily:Constants.LIST_FONT_FAMILY
            }
        })
    }
}
