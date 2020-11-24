import React, { Component } from 'react'
import TrendListImageCard from './TrendListImageCard'
import TrendYoutubeWebView from './TrendYoutubeWebView'
import * as Constants from '../../../../services/Constants'

class TrendCampaignCard extends Component {
    render() {
        if (this.props.data.values.bannerType == 0) {
            return (
                <TrendListImageCard
                    data={this.props.data}
                    onImageClickHandler={(data) => this.props.onImageClickHandler(data)}
                    onWishlistClickHandler={(data) => this.props.onWishlistClickHandler(data)}
                    onShareClickHandler={(data) => this.props.onShareClickHandler(data)}
                    height={Constants.SCREEN_WIDTH * 0.6}
                />
            )
        }
        else {
            return (
                <TrendYoutubeWebView
                    data={this.props.data}
                    mediaUrl={this.props.data.values.media}
                    onWishlistClickHandler={(data) => this.props.onWishlistClickHandler(data)}
                    onShareClickHandler={(data) => this.props.onShareClickHandler(data)}
                    onImageClickHandler={(data) => this.props.onImageClickHandler(data)}
                />
            )
        }
    }
}
export default TrendCampaignCard