import React, { Component } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import * as Constants from '../../services/Constants'

class ProductSizeList extends Component {


    renderItem = ({ item }) => {

        const { size } = item
        return (
            <View style={styles.circleShapeView}>
                <Text style={{ ...styles.sizeText }}>
                    {size.dimensions}
                </Text>
            </View>
        )
    }
    render() {
        const { data } = this.props
        return (
            <View style={{display:'flex', flexDirection: 'row'}}>
                <FlatList
                    data={data}
                    renderItem={this.renderItem}
                    // horizontal={true}
                    keyExtractor={item => item.sizeId.toString()}
                    contentContainerStyle={{display: 'flex', flexDirection: 'row'}}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    circleShapeView: {
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        backgroundColor: "#C1C1C1",
        alignItems: 'center',
        justifyContent: 'center',
        marginEnd: 10,
        borderWidth: 1,
        borderColor: Constants.DOBO_GREY_COLOR
    },
    sizeText: {
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 10

    }
})
export default ProductSizeList