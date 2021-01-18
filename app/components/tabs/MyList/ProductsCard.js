import React, { Component } from 'react'
import ListImageCard from './ListImageCard'
import YoutubeWebView from './YoutubeWebView'
import * as Constants from '../../../services/Constants'

class ProductsCard extends Component {
    render() {
        if (this.props.data && this.props.data.values) {
            if (this.props.data.values.product.mediaType == 0) {
                return (
                    <ListImageCard
                        data={this.props.data}
                        startDate={this.props.data.values.product.startTime}
                        endDate={this.props.data.values.product.endtime}
                        media={this.props.data.values.product.media}
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
                        startDate={this.props.data.values.product.startTime}
                        endDate={this.props.data.values.product.endtime}
                        mediaUrl={this.props.data.values.product.media}
                        onDeleteClickHandler={(data) => this.props.onDeleteClickHandler(data)}
                        onShareClickHandler={(data) => this.props.onShareClickHandler(data)}
                        onImageClickHandler={(data) => this.props.onImageClickHandler(data)}
                    />
                )
            }
        }
        else {
            return <></>
        }
    }
}
export default ProductsCard