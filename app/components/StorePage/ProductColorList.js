import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import * as Constants from '../../services/Constants'

class ProductColorList extends Component {


    renderItem = ({ item }) => {

        const { color } = item
        const colorCode = color.colorCode.toLowerCase() || 'white'
        return (
            <View
                style={{ ...styles.circleShapeView, backgroundColor: colorCode }}
            />
        )
    }
    render() {
        const { data } = this.props
        return (
            <View>
                <FlatList
                    data={data}
                    renderItem={this.renderItem}
                    // horizontal={true}
                    keyExtractor={item => item.colorId.toString()}
                    listKey={item => 'C'+item.colorId.toString()}
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
        marginStart: 10,
        borderWidth: 1,
        borderColor: Constants.DOBO_GREY_COLOR
    },
})
export default ProductColorList