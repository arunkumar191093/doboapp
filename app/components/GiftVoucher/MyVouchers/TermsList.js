import React, { Component } from 'react'
import {
    SafeAreaView,
    FlatList,
    Text,
    Image,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import * as Constants from '../../../services/Constants'

class TermsList extends Component {
    constructor(props) {
        super(props);
    }

    renderComponent = ({ item }) => {
        return (

            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                    <ImageBackground
                        style={styles.circle}
                        resizeMode='contain'>
                    </ImageBackground>
                    <Text style={styles.textStyle}>{item.text}</Text>
                </View>

            </View>
        )
    }

    render() {
        return (
            <View >
                <FlatList
                    ItemSeparatorComponent={this.renderSeparatorView}
                    data={this.props.data}
                    renderItem={this.renderComponent}
                    keyExtractor={item => item.id}>
                </FlatList>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    circle: {
        marginTop: '2%',
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        backgroundColor: Constants.DOBO_RED_COLOR
    },
    textStyle: {
        marginLeft: '2%',
        marginRight: '3%',
        paddingBottom: '2%',
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 12
    }
});

export default TermsList;