import React, { Component } from 'react'
import {
    View,
    ImageBackground
} from 'react-native'
// -------------------Props---------------------
// mediaUrl;

class StoreBannerImageCard extends Component {
    render() {
        return (
            <View>
                <ImageBackground
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: this.props.mediaUrl }}
                    resizeMode='contain'
                >
                </ImageBackground>
            </View>
        )
    }
}

export default StoreBannerImageCard