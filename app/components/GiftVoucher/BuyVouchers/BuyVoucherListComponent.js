import React, { Component } from 'react';
import {
    SafeAreaView,
    FlatList,
    Text,
    Image,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import * as Constants from '../../../services/Constants';
class BuyVoucherListComponent extends Component {
    constructor(props) {
        super(props);
        this.onCurrentItemClick = this.onCurrentItemClick.bind(this);
    }

    onCurrentItemClick = (item) => {
        this.props.onCurrentItemClick(item)
    }

    renderComponent = ({ item }) => {
        return (
            <View style={{ flex: 0.33, flexDirection: 'column', margin: 2 }}>
                <TouchableWithoutFeedback onPress={() => this.onCurrentItemClick(item)}>
                    {/* <View style={{ flex: 0.5, flexDirection: 'column', margin: 3 }}> */}
                    <ImageBackground
                        style={{ height: 110 }}
                        imageStyle={{ borderRadius: 5 }}
                        source={{ uri: Constants.baseURL + item.retailers.iconURL }}
                    // resizeMode='stretch'
                    >
                    </ImageBackground>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.MainContainer}>
                <FlatList
                    ItemSeparatorComponent={this.renderSeparatorView}
                    columnWrapperStyle={{ marginHorizontal: 5 }}
                    data={this.props.data}
                    renderItem={this.renderComponent}
                    numColumns={3}
                    keyExtractor={item => item.id} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        paddingTop: 10,
        marginBottom: 10
    },
});

export default BuyVoucherListComponent;