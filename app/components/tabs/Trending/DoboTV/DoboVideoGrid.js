import React, { Component } from 'react';
import {
    FlatList,
    View,
    StyleSheet,
    ImageBackground,
    Text,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native';
import { youtubeVideoIdParser } from '../../../../services/Helper';
import * as Constants from '../../../../services/Constants'
import IconComponent from '../../../Common/IconComponent';
import { ImageConst } from '../../../../services/ImageConstants';

class DoboVideoGrid extends Component {
    constructor(props) {
        super(props);
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

    renderComponent = ({ item }) => {
        let videoId = youtubeVideoIdParser(item.media)
        let thumbnailImage = `https://img.youtube.com/vi/${videoId}/0.jpg`
        return (
            <View style={{ flex: 0.5, flexDirection: 'column', margin: 1 }}>
                <TouchableHighlight onPress={() => this.props.onImageClickHandler(item)}>
                    <ImageBackground
                        style={{ height: 150 }}
                        source={{ uri: thumbnailImage }}
                        resizeMode='stretch'
                    >
                        <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
                            <View style={{ height: 30, flexDirection: 'row-reverse', backgroundColor: Constants.LIGHT_GRADIENT_COLOR }}>
                                <TouchableOpacity style={styles.share}
                                    onPress={() => this.props.onShareClickHandler(item)}
                                >
                                    <IconComponent
                                        name={ImageConst["share-default"]}
                                        size={25}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.wishlist}
                                    onPress={() => this.props.onWishlistClickHandler(item)}
                                >
                                    <IconComponent
                                        name={item.wishList ? ImageConst['like-active'] : ImageConst['like-default']}
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.description}>
                                <Text style={{ ...styles.descriptionText }}>
                                    {item.description.toUpperCase()}
                                </Text>
                                {/* <Text style={{ ...styles.descriptionText }}>
                                    Which Products Work Best
                            </Text> */}
                            </View>
                        </View>
                    </ImageBackground>

                </TouchableHighlight>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.MainContainer}>
                <FlatList
                    ItemSeparatorComponent={this.renderSeparatorView}
                    data={this.props.data}
                    columnWrapperStyle={{ justifyContent: 'space-between', }}
                    renderItem={this.renderComponent}
                    numColumns={2}
                    keyExtractor={item => item.id.toString()}>
                </FlatList>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        paddingTop: 10,
    },
    description: {
        position: "absolute",
        top: "5%",
        backgroundColor: Constants.LIGHT_GRADIENT_COLOR,
        width: '100%'
    },
    descriptionText: {
        color: 'white',
        fontSize: 9,
        marginLeft: '5%',
        fontFamily: Constants.LIST_FONT_FAMILY
    },
    share: {
        justifyContent: 'center',
        marginHorizontal: '2%'
    },
    wishlist: {
        justifyContent: 'center',
        marginHorizontal: '2%'
    }
});

export default DoboVideoGrid;