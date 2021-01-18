import React, { Component } from 'react';

import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import * as Constants from '../../../../services/Constants';

class CategoryListComponent extends Component {
    constructor(props) {
        super(props);
        this.onItemClickHandler = this.onItemClickHandler.bind(this);
    }

    onItemClickHandler = (item) => {
        this.props.onCategoryClick(item);
    }

    renderComponent = ({ item }) => {
        let mediaURL = item.image && item.image.indexOf('http') > -1 ? item.image : Constants.imageResBaseUrl + item.image;
        return (
            <TouchableWithoutFeedback onPress={() => this.onItemClickHandler(item)}>
                <View style={styles.category}>
                    <View style={styles.categoryView}>
                        <Image
                            source={{ uri: mediaURL }}
                            style={styles.categoryImage}
                            resizeMode='contain' />
                        <Text style={{
                            marginBottom: 15,
                            fontFamily: Constants.LIST_FONT_FAMILY,
                            color: Constants.DOBO_GREY_COLOR
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
                horizontal={true}
                renderItem={this.renderComponent}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ justifyContent: 'space-around', flex: 1 }}
            >

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
        // width: '100%',
        // backgroundColor: '#F9EEED'
    },
    categoryView: {
        marginTop: 20
    },
    categoryImage: {
        height: 30,
        width: 30,
        alignSelf: 'center',
        marginBottom: 5
    },
});

export default CategoryListComponent;