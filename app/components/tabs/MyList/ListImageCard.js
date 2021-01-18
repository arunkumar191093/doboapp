import React from 'react'
import { View, TouchableWithoutFeedback, ImageBackground, Text, StyleSheet, TouchableOpacity } from 'react-native'
import * as Constants from '../../../services/Constants'
import { getDateDiffInDays } from '../../../services/Helper';
import IconComponent from '../../Common/IconComponent';
import { ImageConst } from '../../../services/ImageConstants';

const ListImageCard = (props) => {
    let today = new Date();
    let startDate = new Date(props.startDate)
    let endDate = new Date(props.endDate)
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
    // console.log('Diff from start>>', startDiff)
    //console.log('Diff from end>>>', props.media)
    let singleUrl = props.media.split(',')[0]
    const mediaUrl = singleUrl && singleUrl.indexOf('http') > -1 ? singleUrl : Constants.imageResBaseUrl + singleUrl;
    
    return (
        <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
            <TouchableWithoutFeedback onPress={() => props.onImageClickHandler(props.data)}>
                <ImageBackground
                    style={{ height: props.height }}
                    source={{ uri: mediaUrl }}
                    resizeMode='cover'
                >
                    <View style={styles.description}>
                        <View style={{ justifyContent: 'flex-start', flex: 3 }}>
                            {/* <View style={styles.expireIconView}>
                                        <IconComponent
                                            name={ImageConst['expiry-icon']}
                                            size={10}
                                        />
                                    </View> */}
                            < View style={styles.expiryTextView}>
                                <Text style={[{ color: 'white', fontFamily: Constants.LIST_FONT_FAMILY }, !props.startDate || !props.endDate ? { opacity: 0 } : null]}>
                                    {promptDesc}
                                </Text>
                                <Text style={[{ color: descColor, marginLeft: '2%', fontFamily: Constants.BOLD_FONT_FAMILY }, !props.startDate || !props.endDate ? { opacity: 0 } : null]}>
                                    {daysDesc}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.actionsWrapper}>
                            <TouchableOpacity style={styles.wishlist}
                                onPress={() => props.onDeleteClickHandler(props.data)}>
                                <IconComponent
                                    name={ImageConst['delete']}
                                    size={20}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.share}
                                onPress={() => props.onShareClickHandler(props.data)}>
                                <IconComponent
                                    name={ImageConst["share-default"]}
                                    size={20}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </TouchableWithoutFeedback>
        </View >
    )
};
const styles = StyleSheet.create({
    wishlist: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        maxWidth: 20,
        marginHorizontal: 2
    },
    share: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        maxWidth: 20,
        marginHorizontal: 2
    },
    expireIconView: {
        flex: 1,
        justifyContent: 'center'
    },
    expiryTextView: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    description: {
        position: "absolute",
        bottom: 0,
        backgroundColor: Constants.GRADIENT_COLOR,
        width: '100%',
        flexDirection: 'row',
        height: '20%',
        justifyContent: 'space-between'
    },
    actionsWrapper: {
        flexDirection: 'row',
        flex: 1
    }
});

export default ListImageCard;