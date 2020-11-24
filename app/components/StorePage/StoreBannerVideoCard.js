import React, { Component } from 'react'
import WebView from 'react-native-webview';
import { Platform, View } from 'react-native';

class StoreBannerVideoCard extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: this.props.mediaUrl }}
                    mediaPlaybackRequiresUserAction={((Platform.OS !== 'android') || (Platform.Version >= 17)) ? false : undefined}
                    cacheEnabled={true}
                    allowsInlineMediaPlayback={true}
                />
            </View>

        )
    }
}

export default StoreBannerVideoCard