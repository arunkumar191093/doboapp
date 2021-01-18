import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import * as Constants from '../../../services/Constants'
import NumericInput from 'react-native-numeric-input'
import { ImageConst } from '../../../services/ImageConstants'
import IconComponent from '../../Common/IconComponent'
import NearMeListComponent from './NearMeListComponent'

// -------------------Props---------------------
// radiusDistance
// onRadiusDistanceChanged
// storeList
// onListItemClicked

class NearMeListView extends Component {

    state = {
        storeList: [],
        loading: false
    }
    constructor(props) {
        super(props)
    }

    onFilterOptionsClicked = () => {
        console.log('NearMe::onFilterOptionsClicked')
    }


    render() {
        return (
            <View style={{ flex: 1, width: '100%', marginTop: Constants.TOP_HEADER_HEIGHT }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#CADAE2' }}>
                    <NumericInput
                        value={this.props.radiusDistance}
                        onChange={this.props.onRadiusDistanceChanged}
                        containerStyle={{ backgroundColor: Constants.DOBO_RED_COLOR, alignSelf: 'flex-start' }}
                        textColor='white'
                        totalWidth={120}
                        totalHeight={60}
                        type='up-down'
                        iconStyle={{ color: 'black' }}
                        inputStyle={{ fontSize: 16 }}
                        minValue={6}
                        editable={false}
                    />

                    <TouchableOpacity
                        onPress={this.props.onFilterClickHandler}
                        style={{
                            position: 'absolute',
                            right: 0,
                            margin: '1%'
                            //top: Constants.NEAR_ME_BUTTON_POSITION,
                        }}
                    >
                        <IconComponent
                            name={ImageConst["map-filter"]}
                            size={50} />
                    </TouchableOpacity>
                </View>
                <NearMeListComponent
                    data={this.props.storeList}
                    onCurrentItemClick={(item) => this.props.onListItemClicked(item)}
                />
            </View>
        )
    }
}

export default NearMeListView