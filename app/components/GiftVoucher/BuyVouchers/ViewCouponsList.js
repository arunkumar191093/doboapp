import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    FlatList
} from 'react-native';
import CouponListItem from '../../Common/CouponListItem';


class ViewCouponList extends PureComponent {

    constructor(props) {
        super(props);
    }


    // onGetHandler = (item) => {
    //     Alert.alert(item.code)
    //     //this.props.onGetPress(item)
    // }


    renderComponent = ({ item }) => {
        return <CouponListItem item={item} onUsePress={this.props.onUsePress} />

    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                    data={this.props.data}
                    initialNumToRender={10}
                    renderItem={this.renderComponent}
                    keyExtractor={(item) => item.id.toString()}
                >
                </FlatList>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: '2%'
    },
});

export default ViewCouponList;