import React, { Component } from 'react';
import * as Constants from '../../../services/Constants'

import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback
} from 'react-native';

class CategoryListComponent extends Component {
    constructor(props) {
        super(props);
        this.onItemClickHandler = this.onItemClickHandler.bind(this);
    }

    onItemClickHandler = (item) => {
        this.props.onCategoryClick(item);
    }

    renderComponent = ({ item }) => {
        let mediaURL = item.image && item.image.indexOf('http') > -1 ? item.image : Constants.imageResBaseUrl + item.image
        return (
            <TouchableWithoutFeedback onPress={() => this.onItemClickHandler(item)}>
                <View style={styles.category}>
                    <View style={styles.categoryView}>
                        <Image
                            source={{ uri: mediaURL }}
                            style={styles.categoryImage}
                            resizeMode='contain' />
                        <Text style={{
                            fontFamily: Constants.LIST_FONT_FAMILY,
                            color: Constants.DOBO_GREY_COLOR,
                            fontSize: 10,
                            textAlign: "center"
                        }}>{item.name}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    render() {
        return (
            <FlatList
                data={this.props.data}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                renderItem={this.renderComponent}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ justifyContent: 'space-evenly' }}>
            </FlatList>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    category: {
        flexDirection: "row",
        flexWrap: 'wrap',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        backgroundColor: '#fbeeef',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e2e2e2',
        width: 70,
        height: 75,
        padding: 4,
    },
    categoryView: {
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center'
    },
    categoryImage: {
        height: 40,
        width: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        paddingTop: 8,
    },
});

export default CategoryListComponent;
