import React, { Component } from 'react'
import {
    View,
    ImageBackground
} from 'react-native'

export default class ByVoucherImageCard extends Component {
    render() {
        return (
            <View>
                <ImageBackground
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: this.props.mediaUrl }}
                    resizeMode='stretch'
                >
                </ImageBackground>
            </View>
        )
    }
}
