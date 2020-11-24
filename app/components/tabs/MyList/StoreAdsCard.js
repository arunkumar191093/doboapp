import React, { Component } from 'react'
import ListImageCard from './ListImageCard'
import YoutubeWebView from './YoutubeWebView'
import * as Constants from '../../../services/Constants'

class StoreAdsCard extends Component {
    render() {
        if (this.props.data.values.storeAd.mediaType == 0) {
            return (
                <ListImageCard
                    data={this.props.data}
                    startDate={this.props.data.values.storeAd.startTime}
                    endDate={this.props.data.values.storeAd.endtime}
                    media={this.props.data.values.storeAd.media}
                    onImageClickHandler={(data) => this.props.onImageClickHandler(data)}
                    onDeleteClickHandler={(data) => this.props.onDeleteClickHandler(data)}
                    onShareClickHandler={(data) => this.props.onShareClickHandler(data)}
                    height={Constants.SCREEN_WIDTH / 2}
                />
            )
        }
        else {
            return (
                <YoutubeWebView
                    data={this.props.data}
                    startDate={this.props.data.values.storeAd.startTime}
                    endDate={this.props.data.values.storeAd.endtime}
                    mediaUrl={this.props.data.values.storeAd.media}
                    onDeleteClickHandler={(data) => this.props.onDeleteClickHandler(data)}
                    onShareClickHandler={(data) => this.props.onShareClickHandler(data)}
                    onImageClickHandler={(data) => this.props.onImageClickHandler(data)}
                />
            )
        }
    }
}
export default StoreAdsCard