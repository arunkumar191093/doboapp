import React, { Component } from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'

import NearMeHeader from './NearMeHeader'
import NearMeMapView from './NearMeMapView';
import NearMeListView from './NearMeListView';
import * as Constants from '../../../services/Constants'
import { GetStoresUsingGPS, GetStoresByFilter } from '../../../services/StoreApi';
import { connect } from 'react-redux';
import * as locationActions from '../../../actions/location';
import { bindActionCreators } from 'redux';
import NoNetwork from '../../Common/NoNetwork';
import Filter from '../../Filter';
import { filterOptions } from '../../Filter/FilterValue';

class NearMe extends Component {

  static navigationOptions = {
    header: null,
  }

  state = {
    isFilterModalVisible: false,
    isMapSelected: true,
    storeList: [],
    radiusDistance: Constants.RADIUS_DISTANCE,
    initialRegion: {
      latitude: this.props.coordinates.latitude,
      longitude: this.props.coordinates.longitude,
      latitudeDelta: Constants.LATITUDE_DELTA * Number(Constants.RADIUS_DISTANCE / 15),
      longitudeDelta: Constants.LONGITUDE_DELTA * Number(Constants.RADIUS_DISTANCE / 15)

    }
  }
  constructor(props) {
    super(props)
    this.onEditCurrentLocation = this.onEditCurrentLocation.bind(this)
    this.onShowList = this.onShowList.bind(this)
    this.onShowMap = this.onShowMap.bind(this)
    this.onRadiusDistanceChanged = this.onRadiusDistanceChanged.bind(this)
    this.onFilterClickHandler = this.onFilterClickHandler.bind(this)
    this.filterOptions = JSON.parse(JSON.stringify(filterOptions));
  }

  async componentDidMount() {
    await this.getStoresList()
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.coordinates !== this.props.coordinates || (prevState.radiusDistance !== this.state.radiusDistance)) {
      console.log('NearMe::Coordinates Has Changed')
      await this.getStoresList()
    }
  }

  async getStoresList() {
    const { coordinates } = this.props
    let body = {
      "Latitude": coordinates.latitude,
      "Longitude": coordinates.longitude,
      "Distance": (this.state.radiusDistance * 1000)
    }
    let response = await GetStoresUsingGPS(body)
    if (response.status == 200) {
      let storeListData = response.responseJson
      let jsonStroreList = JSON.parse(storeListData)
      this.setState({ storeList: jsonStroreList })
    }
    else {
      this.setState({ storeList: [] })
    }

  }

  onEditCurrentLocation() {
    console.log('NearMe::Edit Location Clicked')
    this.props.navigation.navigate('LocationEditView')
  }

  onShowList() {
    console.log('Show List clicked')
    this.setState({
      isMapSelected: false
    })
  }

  onShowMap() {
    console.log('Show Map selected')
    this.setState({
      isMapSelected: true
    })
  }

  onRadiusDistanceChanged(value) {
    console.log('onRadiusDistanceChanged()', value)
    this.setState({ radiusDistance: value })
    const { coordinates } = this.props;
    let region = { latitude: coordinates.latitude, longitude: coordinates.longitude, latitudeDelta: Constants.LATITUDE_DELTA * Number(value / 15), longitudeDelta: Constants.LONGITUDE_DELTA * Number(value / 15) }
    this.setState({ initialRegion: region })
  }

  currentListItemClick = (item) => {
    this.props.navigation.navigate('StorePage', { listVal: item.store })
  }

  onFilterClickHandler = () => {
    this.setState({ isFilterModalVisible: !this.state.isFilterModalVisible })

}

onApplyFilter = async (data) => {
  console.log('Filter Options Applied>', JSON.stringify(data))
  this.filterOptions = data
  //this.setState({ filterOptions: data })
  await this.getStoresByFliter(data)

}

onClearFilter = async (data) => {
  this.filterOptions = data
  //this.setState({ filterOptions: data })
  await this.getStoresList(data)
}

getStoresByFliter = async (filterData) => {
  const { coordinates } = this.props
  let body = {
      "Latitude": coordinates.latitude,
      "Longitude": coordinates.longitude,
      "Distance": 35000,
      "SortBy": "Nearby",
      "Categories": [],
      "Brands": []
  }
  filterData.forEach(element => {
      if (element.value === 'Categories') {
          element.details.forEach(element => {
              if (element.checked === true) {
                  body.Categories.push({ id: element.id })
              }
          });

      }
      else if (element.value === 'Brands') {
          element.details.forEach(element => {
              if (element.checked === true) {
                  body.Brands.push({ id: element.id })
              }
          });
      }
  });

  console.log('Filter Body>>>', body)
  let response = await GetStoresByFilter(body)
  if (response.status == 200) {
      let storeListData = response.responseJson
      //Important step to convert to object or else it crashes
      let jsonStroreList = JSON.parse(storeListData)
      this.setState({ storeList: jsonStroreList })
  }
  else {
      this.setState({ storeList: [] })
  }

}
openModal = () => {
  if (this.state.isFilterModalVisible) {
      console.log('Filter Options State', JSON.stringify(this.filterOptions))
      return (

          <Filter
              onModalClose={() => this.setState({ isFilterModalVisible: false })}
              onApplyFilter={this.onApplyFilter}
              onClearFilter={this.onClearFilter}
              filterOptions={this.filterOptions}

          />

      );
  } else {
      return (null);
  }
}


  render() {
    const { shortAddress } = this.props;
    return (
      <View style={styles.container}>
        <NoNetwork />
        <NearMeHeader
          locationName={shortAddress}
          onLocationEdit={this.onEditCurrentLocation}
          showList={this.onShowList}
          showMap={this.onShowMap}
          isMapSelected={this.state.isMapSelected}
        />
        {
          this.state.isMapSelected ?
            <NearMeMapView
              onFilterClickHandler={this.onFilterClickHandler}
              initialRegion={this.state.initialRegion}
              storeList={this.state.storeList}
              onRadiusDistanceChanged={this.onRadiusDistanceChanged}
              radiusDistance={this.state.radiusDistance}
              onSelectedMapViewStoreClick={(item) => this.currentListItemClick(item)}
            >

            </NearMeMapView>
            :
            <NearMeListView
            onFilterClickHandler={this.onFilterClickHandler}
              storeList={this.state.storeList}
              onRadiusDistanceChanged={this.onRadiusDistanceChanged}
              radiusDistance={this.state.radiusDistance}
              onListItemClicked={(item) => this.currentListItemClick(item)}
            />
        }
        {this.openModal()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

const mapStateToProps = state => ({
  shortAddress: state.location.shortAddress,
  longAddress: state.location.longAddress,
  coordinates: state.location.coordinates
});

const ActionCreators = Object.assign(
  {},
  locationActions,
);
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NearMe)