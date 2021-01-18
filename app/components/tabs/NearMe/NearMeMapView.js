import React, { Component } from 'react'
import {
    View,
    StyleSheet,
} from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

import { Icon, Overlay, Image } from 'react-native-elements'
import NumericInput from 'react-native-numeric-input'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import StoreQuickView from './StoreQuickView'
import * as Constants from '../../../services/Constants'
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconComponent from '../../Common/IconComponent';
import { ImageConst } from '../../../services/ImageConstants';

// -------------------Props---------------------
// initialRegion;
// storeList
// radiusDistance
// onRadiusDistanceChanged

class NearMeMapView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            selectedStoreIndex: -1
        }
        this.onFilterOptionsClicked = this.onFilterOptionsClicked.bind(this)
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onSelectedStoreClickHandler = this.onSelectedStoreClickHandler.bind(this);
    }

    // onMapReady = () => {
    //   Platform.OS === 'ios' && this.map.animateToRegion(this.state.initialPosition, 0.1); // TODO remove once the initialRegion is fixed in the module
    // };

    onSelectedStoreClickHandler = (item) => {
        console.log("item>>>>>", item);
        this.setState({ isVisible: false });
        this.props.onSelectedMapViewStoreClick(item)
    }
    onFilterOptionsClicked() {
        console.log('NearMe::onFilterOptionsClicked')
    }

    onMarkerClick(i) {
        console.log('Marker Clicked ' + i)
        //console.log(e)
        console.log('Selected Store Data>>>', this.props.storeList[i])
        this.selectedStoreIndex = i
        this.setState({ isVisible: true, selectedStore: this.props.storeList[i] })
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    zoomEnabled={true}
                    ref={map => {
                        this.map = map
                    }}
                    //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={this.props.initialRegion}
                //onMapReady={this.onMapReady}
                >
                    <Marker
                        coordinate={{
                            latitude: this.props.initialRegion.latitude,
                            longitude: this.props.initialRegion.longitude,
                        }}
                    >
                        <MaterialCommunityIcons name='map-marker' size={30} color="#3996FC" />
                    </Marker>
                    {this.props.storeList.map((marker, i) => (
                        <Marker
                            key={i}
                            coordinate={{
                                latitude: marker.store.location.coordinates[1],
                                longitude: marker.store.location.coordinates[0]
                            }}
                            title={marker.store.description}
                            onPress={() => this.onMarkerClick(i)}
                        >
                            <MaterialCommunityIcons name='map-marker-circle' size={25} />
                        </Marker>
                    ))}
                </MapView>
                <NumericInput
                    value={this.props.radiusDistance}
                    onChange={this.props.onRadiusDistanceChanged}
                    containerStyle={{ position: 'absolute', top: 0, left: 0, backgroundColor: Constants.DOBO_RED_COLOR }}
                    textColor='white'
                    totalWidth={120}
                    totalHeight={60}
                    type='up-down'
                    iconStyle={{ color: 'black' }}
                    inputStyle={{ fontSize: 16 }}
                    minValue={6}
                    editable={false}
                />
                <View style={{
                    position: "absolute", right: 0,
                    margin: '1%',
                }}>
                    <TouchableOpacity onPress={this.props.onFilterClickHandler}>
                        <IconComponent
                            name={ImageConst["map-filter"]}
                            size={50} />
                    </TouchableOpacity>
                </View>

                <Overlay isVisible={this.state.isVisible}
                    overlayStyle={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: Constants.SCREEN_WIDTH,
                        height: Constants.SCREEN_HEIGHT/2,
                        padding: 0,
                        backgroundColor: 'transparent'
                    }}
                onBackdropPress={() => this.setState({ isVisible: false })}
                >
                    <StoreQuickView
                        onCancelClicked={() => this.setState({ isVisible: false })}
                        onStoreClick={(item) => this.onSelectedStoreClickHandler(item)}
                        selectedStore={this.state.selectedStore}
                    />
                </Overlay>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: Constants.SCREEN_WIDTH,
        alignItems: 'center',
        marginTop: Constants.TOP_HEADER_HEIGHT
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        //top: 0,
    },
});

export default NearMeMapView