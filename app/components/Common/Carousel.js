import React, { Component } from 'react';
import { View, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { PagerProvider, Pager, Slider } from '@crowdlinker/react-native-pager';
import * as Constants from '../../services/Constants'
import NoDataFound from './NoDataFound';

// -------------------Props---------------------
// showSlider
// dataLoaded
// children
// height

const { width } = Dimensions.get('window')
class Carousel extends Component {
    constructor(props) {
        super(props);
    }

    showSlider = () => {
        if (this.props.showSlider) {
            return (
                <View style={{ paddingTop: 0 }}>
                    <Slider
                        numberOfScreens={this.props.children.length}
                        style={{ height: 5, backgroundColor: Constants.DOBO_RED_COLOR }}
                    />
                </View>
            )
        }
    }

    _renderCarousel() {
        if (this.props.dataLoaded) {
            if (this.props.children.length == 0) {
                return (
                    <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                        <NoDataFound message='No Results Found' />
                    </View>
                )
            }
            return (
                <PagerProvider>
                    <Pager
                        style={{ ...styles.container, height: this.props.height || 200 }}
                    >
                        {this.props.children}
                    </Pager>

                    {this.showSlider()}

                </PagerProvider>
            )
        }
        else {
            return (
                <ActivityIndicator
                    size="large"
                    color={Constants.DOBO_RED_COLOR}
                    style={{ ...styles.container, height: this.props.height || 200 }} />
            )
        }
    }
    render() {
        return (
            <View>
                {this._renderCarousel()}
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        overflow: 'hidden',
        alignSelf: 'center',
    },
});

export default Carousel