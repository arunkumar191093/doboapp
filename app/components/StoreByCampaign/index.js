import React, { Component } from 'react';
import * as Constants from '../../services/Constants';
import { Icon } from 'react-native-elements';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import { GetStoresByCampaign } from '../../services/StoreApi';
import Loader from '../Common/Loader';
import StoreListComponent from '../Common/StoreListComponent';
import NoNetwork from '.././Common/NoNetwork';
import { connect } from 'react-redux';

class StoreByCampaign extends Component {
  campaignvalue = {};

  state = {
    loading: false,
    storeListData: [],
  };
  constructor(props) {
    super(props);
    this.campaignvalue = this.props.navigation.getParam('campaignvalue');
    this.onCloseClickHandler = this.onCloseClickHandler.bind(this);
    this.onListItemClickHandler = this.onListItemClickHandler.bind(this);
  }

  componentDidMount = async () => {
    let id = this.campaignvalue.id;
    this.callGetCompignRetailer(id);
  };

  onCloseClickHandler = () => {
    this.props.navigation.goBack();
  };

  onListItemClickHandler = item => {
    console.log('ITEM_STORE>>>>', item);
    this.props.navigation.navigate('StorePage', { listVal: item.store });
  };

  callGetCompignRetailer = async id => {
    const { coordinates } = this.props
    this.startLoading();
    let data = { id: id, Latitude: coordinates.latitude, Longitude: coordinates.longitude };
    let response = await GetStoresByCampaign(data);
    if (response.status === 200) {
      let storeData = response.responseJson;
      this.setState({ storeListData: JSON.parse(storeData) });
      this.stopLoading();
    } else {
      this.stopLoading();
    }
  };

  startLoading() {
    this.setState({ loading: true });
  }

  stopLoading() {
    this.setState({ loading: false });
  }

  render() {
    let mediaURL = this.campaignvalue.media && this.campaignvalue.media.indexOf('http') > -1 ? this.campaignvalue.media : Constants.imageResBaseUrl + '/' + this.campaignvalue.media
    return (
      <View style={styles.container}>
        <NoNetwork />
        <Loader loading={this.state.loading} />
        <View
          style={{
            height: Constants.BANNER_HEIGHT,
          }}>
          <ImageBackground
            style={styles.categoryImage}
            source={{ uri: mediaURL }}
            resizeMode="stretch">
            <TouchableWithoutFeedback onPress={this.onCloseClickHandler}>
              <View style={styles.header}>
                <Icon name="arrow-back" color="white" />
              </View>
            </TouchableWithoutFeedback>
          </ImageBackground>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              fontSize: 18,
              justifyContent: 'center',
              padding: 20,
              fontFamily: Constants.BOLD_FONT_FAMILY
            }}>
            Stores{' (' + this.state.storeListData.length + ')'}
          </Text>
          {/* Hidden as part of bug fixes */}
          {/* <View style={{ position: 'absolute', right: 0, padding: 20 }}>
            <Icon name="sliders" type="feather" color="grey" />
          </View> */}
        </View>
        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: '#CEDCCE',
          }}
        />
        <StoreListComponent
          data={this.state.storeListData}
          onCurrentItemClick={item => this.onListItemClickHandler(item)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
  },
  textHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: '3%',
    textAlign: 'center',
  },
  categoryImage: {
    //alignSelf: 'center',
    height: '100%',
    width: '100%',
    //marginTop: '3%',
    resizeMode: 'contain',
    //backgroundColor: 'red',
  },
  filterView: {
    marginTop: 10,
    position: 'absolute',
    right: 10,
  },
  categoryImageFilter: {
    marginLeft: 20,
    marginTop: 100,
  },
});

const mapStateToProps = state => ({
  coordinates: state.location.coordinates,
});


export default connect(mapStateToProps, null)(StoreByCampaign)