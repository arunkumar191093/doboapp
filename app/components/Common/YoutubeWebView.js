import React, { PureComponent } from 'react'
import WebView from 'react-native-webview';
import { Platform, View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Constants from '../../services/Constants'
import IconComponent from './IconComponent';
import { ImageConst } from '../../services/ImageConstants';

class YoutubeWebView extends PureComponent {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: this.props.mediaUrl }}
                    mediaPlaybackRequiresUserAction={((Platform.OS !== 'android') || (Platform.Version >= 17)) ? false : undefined}
                    cacheEnabled={true}
                    allowsInlineMediaPlayback={true}
                />
                <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 40 }}>
                    <TouchableOpacity style={{ height: '100%', flexDirection: 'row-reverse', backgroundColor: Constants.LIGHT_GRADIENT_COLOR }}
                        onPress={() => this.props.onImageClickHandler(this.props.data)}
                    >
                        <TouchableOpacity style={styles.share}
                            onPress={() => this.props.onShareClickHandler(this.props.data)}>
                            <IconComponent
                                name={ImageConst["share-default"]}
                                size={30}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.wishlist}
                            onPress={() => this.props.onWishlistClickHandler(this.props.data)}>
                            <IconComponent
                                name={this.props.data.wishList ? ImageConst['like-active'] : ImageConst['like-default']}
                                size={30}
                            />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    wishlist: {
        justifyContent: 'center',
        marginHorizontal: '2%'

    },
    share: {
        justifyContent: 'center',
        marginHorizontal: '2%'
    }
});

export default YoutubeWebView