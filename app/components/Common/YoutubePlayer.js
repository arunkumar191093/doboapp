import React, { Component } from 'react'
import { View, Dimensions, PixelRatio, StyleSheet, TouchableOpacity } from 'react-native'
import YouTube, { } from 'react-native-youtube';
import * as Constants from '../../services/Constants';
import IconComponent from './IconComponent';
import { ImageConst } from '../../services/ImageConstants';
import { youtubeVideoIdParser } from '../../services/Helper';

class YoutubePlayer extends Component {

    state = {
        isReady: false,
        status: null,
        quality: null,
        error: null,
        isPlaying: false,
        isLooping: false,
        duration: 0,
        currentTime: 0,
        fullscreen: false,
        playerWidth: Dimensions.get('window').width,
    };
    _youTubeRef = React.createRef();
    render() {
        let videoId = youtubeVideoIdParser(this.props.mediaUrl)
        return (
            <View style={{ flex: 1 }}>
                <YouTube
                    ref={this._youTubeRef}
                    // You must have an API Key for the player to load in Android
                    apiKey={Constants.YOUTUBE_API_KEY}
                    // Un-comment one of videoId / videoIds / playlist.
                    // You can also edit these props while Hot-Loading in development mode to see how
                    // it affects the loaded native module
                    videoId={videoId}
                    // videoIds={['uMK0prafzw0', 'qzYgSecGQww', 'XXlZfc1TrD0', 'czcjU1w-c6k']}
                    // playlistId="PLF797E961509B4EB5"
                    play={this.props.play}
                    loop={this.state.isLooping}
                    fullscreen={this.state.fullscreen}
                    controls={1}
                    style={[
                        { height: PixelRatio.roundToNearestPixel(this.state.playerWidth / (16 / 9)) },
                        styles.player,
                    ]}
                    onError={e => {
                        console.log('Youtube error', e)
                        this.setState({ error: e.error });
                    }}
                    onReady={() => {
                        this.setState({ isReady: true });
                    }}
                    onChangeState={e => {
                        this.setState({ status: e.state });
                    }}
                    onChangeQuality={e => {
                        this.setState({ quality: e.quality });
                    }}
                    onChangeFullscreen={e => {
                        this.setState({ fullscreen: e.isFullscreen });
                    }}
                    onProgress={e => {
                        this.setState({ currentTime: e.currentTime });
                    }}
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
    player: {
        alignSelf: 'stretch',
        //marginVertical: 10,
    },
    wishlist: {
        justifyContent: 'center',
        marginHorizontal: '2%'

    },
    share: {
        justifyContent: 'center',
        marginHorizontal: '2%'
    }
});

export default YoutubePlayer