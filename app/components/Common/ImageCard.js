import React, { PureComponent } from 'react'
import {
    View,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight
} from 'react-native'
import * as Constants from '../../services/Constants'
import IconComponent from './IconComponent'
import { ImageConst } from '../../services/ImageConstants'

// -------------------Props---------------------
// mediaUrl;
// onWishlistClickHandler;
// onShareClickHandler;


class ImageCard extends PureComponent {
    render() {
        return (
            <TouchableHighlight onPress={() => this.props.onImageClickHandler(this.props.data)}>

                <ImageBackground
                    style={{ width: '100%', height: '100%' }}
                    source={{ uri: this.props.mediaUrl }}
                    resizeMode='cover'
                >
                    <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
                        <View style={{ height: 40, flexDirection: 'row-reverse', backgroundColor: Constants.LIGHT_GRADIENT_COLOR }}>
                            <TouchableOpacity style={styles.share}
                                onPress={() => this.props.onShareClickHandler(this.props.data)}>
                                <IconComponent
                                    name={ImageConst["share-default"]}
                                    size={30}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.wishlist}
                                onPress={() => this.props.onWishlistClickHandler(this.props.data)}>
                                <IconComponent
                                    name={this.props.data.wishList ? ImageConst['like-active'] : ImageConst['like-default']}
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    wishlist: {
        justifyContent: 'center',
        marginHorizontal: '2%'

    },
    share: {
        justifyContent: 'center',
        marginHorizontal: '2%'
    }
});
export default ImageCard