import React, { Component } from 'react';
import {
    FlatList,
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    TouchableHighlight,
    Animated
}
    from 'react-native';
import * as Constants from '../../services/Constants'
import IconComponent from '../Common/IconComponent';
import { ImageConst } from '../../services/ImageConstants';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
class GridComponent extends Component {
    constructor(props) {
        super(props);
        this.onWishlistClickHandler = this.onWishlistClickHandler.bind(this);
        this.onShareClickHandler = this.onShareClickHandler.bind(this);
        this.onImageClickHandler = this.onImageClickHandler.bind(this);
    }

    onWishlistClickHandler = (item) => {
        this.props.onWishlistClick(item);
    }

    onShareClickHandler = (item) => {
        this.props.onShareClick(item)
    }

    onImageClickHandler = (item) => {
        this.props.onImageClick(item);
    }
    renderSeparatorView = () => {
        return (
            <View style={{
                height: 1,
                width: "100%",
                backgroundColor: "#CEDCCE",
            }}
            />
        );
    };

    onListScroll = (e) => {
        this.props.onListScroll(e.nativeEvent.contentOffset.y);
    }

    renderComponent = ({ item }) => {
        let firstImage = item.media.split(',')[0];
        const mediaURL = firstImage && (firstImage.indexOf('http') > -1) ? firstImage : Constants.imageResBaseUrl + firstImage;
        return (
            <View style={styles.itemContainer}>
                <TouchableHighlight onPress={() => this.onImageClickHandler(item)}>
                    <>
                        <ImageBackground
                            style={{ height: Constants.SCREEN_WIDTH / 2 }}
                            source={{ uri: mediaURL }}
                            resizeMode='cover'
                        >
                            {/* <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
                            <View style={{ height: 30, flexDirection: 'row-reverse', backgroundColor: Constants.LIGHT_GRADIENT_COLOR }}>
                                <TouchableOpacity style={styles.share}
                                    onPress={() => this.onShareClickHandler(item)}>
                                    <IconComponent
                                        name={ImageConst["share-default"]}
                                        size={25}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.wishlist}
                                    onPress={() => this.onWishlistClickHandler(item)}>
                                    <IconComponent
                                        name={item.wishList ? ImageConst['like-active'] : ImageConst['like-default']}
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View> */}
                        </ImageBackground>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemText} numberOfLines={1}>{item.name}</Text>
                                {/* <Text style={styles.itemSubText} numberOfLines={1}>{'subtext subtext subtext subtext'}</Text> */}
                            </View>
                            <View style={{ height: 30, flexDirection: 'row-reverse' }}>
                                <TouchableOpacity style={styles.share}
                                    onPress={() => this.onShareClickHandler(item)}>
                                    <IconComponent
                                        name={ImageConst["share-default"]}
                                        size={22}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.wishlist}
                                    onPress={() => this.onWishlistClickHandler(item)}>
                                    <IconComponent
                                        name={item.wishList ? ImageConst['like-active'] : ImageConst['like-default']}
                                        size={22}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                </TouchableHighlight>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.MainContainer}>
                {
                    this.props.data && this.props.data.length ?

                        <AnimatedFlatList
                            // ItemSeparatorComponent={this.renderSeparatorView}
                            // contentContainerStyle={{ paddingBottom: 40 }}
                            // style={{ marginBottom: Constants.SCREEN_HEIGHT  }}
                            data={this.props.data}
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={16}
                            renderItem={this.renderComponent}
                            numColumns={2}
                            keyExtractor={item => item.id.toString()}
                            onScroll={this.onListScroll}
                            // onScroll={this.props.onListScroll}
                            contentContainerStyle={{ paddingBottom: Constants.SCREEN_HEIGHT / 1.25 }}
                        /> :
                        <Text style={styles.noResultMsg}>No Results Found.</Text>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: 'center',
        // flex: 1,
        // paddingTop: 8,
        backgroundColor: '#fff'
    },
    wishlist: {
        justifyContent: 'center',
        marginHorizontal: '2%'

    },
    share: {
        justifyContent: 'center',
        marginHorizontal: '2%'
    },
    itemContainer: {
        flex: 0.5,
        flexDirection: 'column',
        margin: 6
    },
    itemDetails: {
        fontSize: 12,
        color: "#5E7A90",
        textAlign: 'center',
        fontFamily: Constants.LIST_FONT_FAMILY,
        maxWidth: '65%'
    },
    itemText: {
        fontSize: 9,
        color: "#5E7A90",
        fontFamily: Constants.HEADING_FONT_FAMILY,
        textTransform: 'uppercase',
        marginTop: 4
    },
    itemSubText: {
        fontSize: 9,
        color: "#5E7A90",
        fontFamily: Constants.LIST_FONT_FAMILY,
    },
    noResultMsg: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 20,
        fontFamily: Constants.LIST_FONT_FAMILY,
        padding: '20%'
    }
});

export default GridComponent;