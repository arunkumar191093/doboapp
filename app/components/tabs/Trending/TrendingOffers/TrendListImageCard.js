import React from 'react'
import { View, TouchableWithoutFeedback, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import * as Constants from '../../../../services/Constants'
import IconComponent from '../../../Common/IconComponent'
import { ImageConst } from '../../../../services/ImageConstants'

const TrendListImageCard = (props) => {
    const mediaUrl = props.data && props.data.values && props.data.values.media && props.data.values.media.indexOf('http') > -1 ? props.data.values.media : Constants.imageResBaseUrl + props.data.values.media;
    return (
        <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
            <TouchableWithoutFeedback onPress={() => props.onImageClickHandler(props.data)}>
                <ImageBackground
                    style={{ height: props.height }}
                    source={{ uri: mediaUrl }}
                    resizeMode='stretch'
                >
                    <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
                        <View style={{ height: 40, flexDirection: 'row-reverse', backgroundColor: Constants.LIGHT_GRADIENT_COLOR }}>
                            <TouchableOpacity style={styles.share}
                                onPress={() => props.onShareClickHandler(props.data)}
                            >
                                <IconComponent
                                    name={ImageConst["share-default"]}
                                    size={30}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.wishlist}
                                onPress={() => props.onWishlistClickHandler(props.data)}
                            >
                                <IconComponent
                                    name={props.data.values.wishList ? ImageConst['like-active'] : ImageConst['like-default']}
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                </ImageBackground>
            </TouchableWithoutFeedback>
        </View>
    )
};
const styles = StyleSheet.create({
    wishlist: {
        justifyContent: 'center',
        marginHorizontal: '2%'

    },
    share: {
        justifyContent: 'center',
        marginHorizontal: '2%'
    },
});

export default TrendListImageCard;