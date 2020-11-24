import React, { Component } from 'react'
import TrendListImageCard from './TrendListImageCard'
import TrendYoutubeWebView from './TrendYoutubeWebView'
import * as Constants from '../../../../services/Constants'

class TrendStoreAdsCard extends Component {
    render() {
        if (this.props.data.values.mediaType == 0) {
            return (
                <TrendListImageCard
                    data={this.props.data}
                    onImageClickHandler={(data) => this.props.onImageClickHandler(data)}
                    onWishlistClickHandler={(data) => this.props.onWishlistClickHandler(data)}
                    onShareClickHandler={(data) => this.props.onShareClickHandler(data)}
                    height={Constants.SCREEN_WIDTH / 2}
                />
            )
        }
        else {
            return (
                <TrendYoutubeWebView
                    mediaUrl={this.props.data.values.media}
                    data={this.props.data}
                    onWishlistClickHandler={(data) => this.props.onWishlistClickHandler(data)}
                    onShareClickHandler={(data) => this.props.onShareClickHandler(data)}
                    onImageClickHandler={(data) => this.props.onImageClickHandler(data)}
                />
            )
        }
    }
}
export default TrendStoreAdsCard