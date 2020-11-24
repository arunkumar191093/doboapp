import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import * as Constants from '../../../services/Constants'
import HeaderLocationBox from '../../Common/HeaderLocationBox'
import IconComponent from '../../Common/IconComponent'
import { ImageConst } from '../../../services/ImageConstants'
class NearMeHeader extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={styles.container}>
                <HeaderLocationBox
                    locationName={this.props.locationName}
                    onLocationEdit={this.props.onLocationEdit}
                />
                <View style={styles.rightContainer}>
                    <TouchableOpacity
                        style={{ marginRight: '10%' }}
                        onPress={this.props.showList}>
                        <IconComponent
                            name={this.props.isMapSelected ? ImageConst['list-view-default'] : ImageConst['list-view-active']}
                            size={25}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.props.showMap}>
                        <IconComponent
                            name={this.props.isMapSelected ? ImageConst['map-view-active'] : ImageConst['map-view-default']}
                            size={25}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: Constants.TOP_HEADER_HEIGHT,
        width: Constants.SCREEN_WIDTH,
        position: 'absolute',
        top: 0,
    },
    rightContainer: {
        flex: 1,
        //backgroundColor: 'green',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        marginEnd: '5%'
    },

})

export default NearMeHeader