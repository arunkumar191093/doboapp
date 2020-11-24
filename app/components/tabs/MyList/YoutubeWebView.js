import React, { Component } from 'react'
import WebView from 'react-native-webview';
import { Platform, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as Constants from '../../../services/Constants'
import { getDateDiffInDays } from '../../../services/Helper';
import IconComponent from '../../Common/IconComponent';
import { ImageConst } from '../../../services/ImageConstants';

class YoutubeWebView extends Component {
    render() {
        let today = new Date();
        let startDate = new Date(this.props.startDate)
        let endDate = new Date(this.props.endDate)
        let startDiff = getDateDiffInDays(today, startDate)
        let endDiff = getDateDiffInDays(today, endDate)
        let promptDesc
        let descColor
        let daysDesc
        if (startDiff < 0) {
            promptDesc = 'Expires in'
            descColor = 'red'
            if (Math.abs(endDiff) > 1) {
                daysDesc = `${Math.abs(endDiff)} days`
            }
            else {
                daysDesc = `${Math.abs(endDiff)} day`
            }
        }
        else {
            promptDesc = 'Starts in'
            descColor = 'green'
            if (Math.abs(startDiff) > 1) {
                daysDesc = `${Math.abs(startDiff)} days`
            }
            else {
                daysDesc = `${Math.abs(startDiff)} day`
            }
        }
        return (
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: this.props.mediaUrl }}
                    mediaPlaybackRequiresUserAction={((Platform.OS !== 'android') || (Platform.Version >= 17)) ? false : undefined}
                    cacheEnabled={true}
                    allowsInlineMediaPlayback={true}
                />
                <View style={styles.description}>
                    <TouchableOpacity style={{ height: '100%', flexDirection: 'row', backgroundColor: Constants.LIGHT_GRADIENT_COLOR }}
                        onPress={() => this.props.onImageClickHandler(this.props.data)}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={styles.expireIconView}>
                                <IconComponent
                                    name={ImageConst['expiry-icon']}
                                    size={20}
                                />
                            </View>
                            <View style={styles.expiryTextView}>
                                <Text style={{ color: 'white', fontFamily: Constants.LIST_FONT_FAMILY }}>
                                    {promptDesc}
                                </Text>
                                <Text style={{ color: descColor, marginLeft: '2%', fontFamily: Constants.BOLD_FONT_FAMILY }}>
                                    {daysDesc}
                                </Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row-reverse', flex: 1 }}>
                            <TouchableOpacity style={styles.share}
                                onPress={() => this.props.onShareClickHandler(this.props.data)}>
                                <IconComponent
                                    name={ImageConst["share-default"]}
                                    size={30}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.wishlist}
                                onPress={() => this.props.onDeleteClickHandler(this.props.data)}>
                                <IconComponent
                                    name={ImageConst['delete']}
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    wishlist: {
        justifyContent: 'center',
        marginHorizontal: '10%'

    },
    share: {
        justifyContent: 'center',
        marginHorizontal: '10%'
    },
    expireIconView: {
        flex: 1,
        justifyContent: 'center'
    },
    expiryTextView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    description: {
        position: "absolute",
        bottom: 0,
        backgroundColor: Constants.GRADIENT_COLOR,
        width: '100%',
        height: '20%'
    }
});

export default YoutubeWebView