import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import * as Constants from '../../services/Constants'
import NoDataFound from './NoDataFound';

class AutoPlayCarousel extends React.Component {
    constructor() {
        super()
        this.state = {
            activeSlide: 0
        }
    }

    get pagination() {
        const { activeSlide } = this.state;
        return (
            <Pagination
                dotsLength={this.props.children.length}
                activeDotIndex={activeSlide}
                containerStyle={{
                    position: 'absolute',
                    bottom: 0,
                    padding: 0,
                    // marginHorizontal: 16,
                    paddingVertical: 0,
                    //justifyContent: 'space-evenly',
                    paddingHorizontal: 0
                }}
                dotContainerStyle={{
                    marginHorizontal: 2
                }}
                dotStyle={{
                    width: Constants.SCREEN_WIDTH / this.props.children.length,
                    height: 2,
                    //borderRadius: 5,
                    marginHorizontal: 0,
                    backgroundColor: Constants.DOBO_RED_COLOR,
                    paddingHorizontal: 0
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                    width: Constants.SCREEN_WIDTH / this.props.children.length,
                    backgroundColor: Constants.LIGHT_GREY_COLOR,
                    //padding: 0
                }}
                inactiveDotOpacity={0.5}
                inactiveDotScale={1}
            />
        );
    }

    onSnapToItem = (index) => {
        this.setState({ activeSlide: index })
        const { onSnapToItem } = this.props
        if (onSnapToItem !== undefined)
            onSnapToItem(index)
    }

    render() {
        const { isDataLoaded, loading, autoplay, children, renderItem, loop } = this.props
        //console.log('Loading & Children length', loading, children.length, isDataLoaded)
        return (
            <View style={{ height: this.props.height || Constants.BANNER_HEIGHT }}>

                {
                    isDataLoaded && children.length == 0 ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <NoDataFound message='No Results Found' />
                        </View>
                    ) : (

                            <View style={{ flex: 1 }}>
                                {
                                    loading ? (
                                        <View style={{ flex: 1, justifyContent: 'center' }}>
                                            <ActivityIndicator
                                                animating={true}
                                                size='large'
                                                color={Constants.DOBO_RED_COLOR}
                                            />
                                        </View>

                                    ) : (
                                            <View style={{ flex: 1 }}>
                                                <Carousel
                                                    data={children}
                                                    renderItem={renderItem}
                                                    onSnapToItem={(index) => this.onSnapToItem(index)}
                                                    autoplay={autoplay}
                                                    //autoplayDelay={20}
                                                    autoplayInterval={5 * 1000}
                                                    loop={loop}
                                                    sliderWidth={Constants.SCREEN_WIDTH}
                                                    itemWidth={Constants.SCREEN_WIDTH}
                                                    layout='default'
                                                    lockScrollWhileSnapping={autoplay ? true : false}
                                                    containerCustomStyle={{ paddingBottom: 8, margin: 0, flexGrow: 1 }}
                                                //slideStyle={{ flex: 1 }}
                                                //activeSlideAlignment='start'
                                                //activeSlideOffset={10}
                                                //layoutCardOffset={9}
                                                //contentContainerCustomStyle={{ paddingVertical: 0 }}
                                                />
                                                {this.pagination}
                                            </View>
                                        )
                                }
                            </View>
                        )
                }
            </View>
        );
    }
}

AutoPlayCarousel.defaultProps = {
    isDataLoaded: false,
    loop: true
}

export default AutoPlayCarousel