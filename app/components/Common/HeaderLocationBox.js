import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native'
import * as Constants from '../../services/Constants';
import IconComponent from '../Common/IconComponent';
import { ImageConst } from '../../services/ImageConstants';

// -------------------Props---------------------
// onLocationEdit
// ;

class HeaderLocationBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.locContainer}>
                <Text style={{ color: '#9A9A9A', padding: '1%', fontFamily: Constants.LIST_FONT_FAMILY, fontSize: 12 }}>
                    Your Location
                    </Text>
                <View>
                    <TouchableOpacity style={{ flexDirection: 'row', width: '100%' }}
                        onPress={this.props.onLocationEdit}>
                        <Text
                            style={{ paddingStart: '2%', paddingEnd: '5%', fontFamily: Constants.BOLD_FONT_FAMILY, fontSize: 14 }}
                            numberOfLines={1}
                        >
                            {this.props.locationName}
                        </Text>
                        {/* <Image
                            style={{ width: 15, height: 15 }}
                            resizeMode="contain"
                            source={require('../../assets/images/pencil-edit.png')}
                        /> */}
                        <IconComponent
                            name={ImageConst["pencil"]}
                            size={15} />
                    </TouchableOpacity>
                    <View style={{
                        borderStyle: 'dashed',
                        borderWidth: 0.7,
                        borderRadius: 2,
                        backgroundColor: 'white',
                    }}>
                    </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    locContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: '2%',
        //backgroundColor:'blue'
    },

})

export default HeaderLocationBox