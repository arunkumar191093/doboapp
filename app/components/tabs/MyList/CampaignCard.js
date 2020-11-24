import React, { Component } from 'react'
import ListImageCard from './ListImageCard'
import YoutubeWebView from './YoutubeWebView'
import * as Constants from '../../../services/Constants'

class CampaignCard extends Component {
    render() {
        if (this.props.data.values.campaign.bannerType == 0) {
            return (
                <ListImageCard
                    data={this.props.data}
                    startDate={this.props.data.values.campaign.startDate}
                    endDate={this.props.data.values.campaign.endDate}
                    media={this.props.data.values.campaign.media}
                    onImageClickHandler={(data) => this.props.onImageClickHandler(data)}
                    onDeleteClickHandler={(data) => this.props.onDeleteClickHandler(data)}
                    onShareClickHandler={(data) => this.props.onShareClickHandler(data)}
                    height={Constants.SCREEN_WIDTH * 0.6}
                />
            )
        }
        else {
            return (
                <YoutubeWebView
                    data={this.props.data}
                    startDate={this.props.data.values.campaign.startDate}
                    endDate={this.props.data.values.campaign.endDate}
                    mediaUrl={this.props.data.values.campaign.media}
                    onDeleteClickHandler={(data) => this.props.onDeleteClickHandler(data)}
                    onShareClickHandler={(data) => this.props.onShareClickHandler(data)}
                    onImageClickHandler={(data) => this.props.onImageClickHandler(data)}
                />
            )
        }
    }
}
export default CampaignCard