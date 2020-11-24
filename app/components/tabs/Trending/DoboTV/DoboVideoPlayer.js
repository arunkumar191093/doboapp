import React, { Component } from 'react'
import { View, Modal } from 'react-native'
import YoutubePlayer from '../../../Common/YoutubePlayer'
import { YouTubeStandaloneAndroid } from 'react-native-youtube';


class DoboVideoPlayer extends Component {
    render() {
        return (

            <View style={{ flex: 1 }}>
                <YoutubePlayer />
            </View>
        )
    }
}

export default DoboVideoPlayer