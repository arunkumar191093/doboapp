import React, { Component } from 'react';
import * as Constants from '../../services/Constants'
import { Icon } from 'react-native-elements'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    ImageBackground
} from 'react-native';
import { GetStoresByCategory } from '../../services/StoreApi';
import Loader from '../Common/Loader';
import StoreListComponent from '../Common/StoreListComponent';
import { connect } from 'react-redux';
class StoreCategory extends Component {

    value = {};
    static navigationOptions = ({ navigation }) => {
        const { state: { params = {} } } = navigation;
        return {
            title: params.value.description || 'default title',
        };
    }
    state = {
        loading: false,
        storeListData: [],
    };
    constructor(props) {
        super(props);
        this.value = this.props.navigation.getParam('value');
        this.onCloseClickHandler = this.onCloseClickHandler.bind(this);
        this.onListItemClickHandler = this.onListItemClickHandler.bind(this);
    }

    componentDidMount = async () => {
        let id = this.value.id;
        this.callGetStoreByCategory(id);
    }

    onCloseClickHandler = () => {
        this.props.navigation.goBack();
    }

    onListItemClickHandler = (item) => {
        console.log("ITEM_STORE>>>>", item);
        this.props.navigation.navigate('StorePage', { listVal: item.store })
    }

    callGetStoreByCategory = async (id) => {
        this.startLoading();
        const { coordinates } = this.props
        let body = {
            "Latitude": coordinates.latitude,
            "Longitude": coordinates.longitude,
            "Distance": 35000
        }
        let response = await GetStoresByCategory(id, body);
        if (response.status === 200) {
            let storeData = response.responseJson;
            this.setState({ storeListData: JSON.parse(storeData) });
            this.stopLoading();
        } else {
            this.stopLoading();
        }


    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false })
    }


    render() {
        return (
            <View style={styles.container}>
                <Loader
                    loading={this.state.loading}
                />
                <ImageBackground style={{ height: Constants.BANNER_HEIGHT }}
                    source={{ uri: Constants.imageResBaseUrl + this.value.icon }}
                    resizeMode='stretch'>
                    <TouchableWithoutFeedback onPress={this.onCloseClickHandler}>
                        <View style={styles.header}>
                            <Icon name="arrow-back" color="black"></Icon>
                            <Text style={styles.textHeader}>{this.value.name.toUpperCase() || ''}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ImageBackground>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 18, justifyContent: 'center', padding: 20, fontFamily: Constants.BOLD_FONT_FAMILY }}>Stores{' (' + this.state.storeListData.length + ')'}</Text>
                    <View style={{ position: 'absolute', right: 0, padding: 20 }} >
                        <Icon
                            name="sliders"
                            type="feather"
                            color="grey" />
                    </View>
                </View>
                <View style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CEDCCE",
                }}
                />
                <StoreListComponent
                    data={this.state.storeListData}
                    onCurrentItemClick={(item) => this.onListItemClickHandler(item)} />

            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: '5%',
        marginVertical: '5%'
    },
    textHeader: {
        fontSize: 18,
        marginLeft: '3%',
        textAlign: 'center',
        fontFamily: Constants.BOLD_FONT_FAMILY
    },
    categoryImage: {
        alignSelf: 'center',
        height: '50%',
        width: '30%',
        marginTop: '3%'
    },
    filterView: {
        marginTop: 10,
        position: "absolute",
        right: 10,
    },
    categoryImageFilter: {
        marginLeft: 20,
        marginTop: 100,
    }
});

const mapStateToProps = state => ({
    coordinates: state.location.coordinates,
});

export default connect(mapStateToProps, null)(StoreCategory)