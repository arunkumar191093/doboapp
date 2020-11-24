import React from 'react';
import { TouchableOpacity, Text } from "react-native";
import * as Constants from '../../services/Constants'

const FilterOptionItem = ({ item, selected, onSelect }) => {

    // const renderSelectedFilterTextView = () => {
    //     return (
    //         <Text style={{ paddingLeft: 20, paddingBottom: 10, fontSize: 12, color: Constants.DOBO_RED_COLOR, fontFamily: Constants.LIST_FONT_FAMILY }}>Hello</Text>
    //     )

    // }
    return (
        < TouchableOpacity onPress={() => onSelect(item)}
            style={[
                { backgroundColor: selected ? '#F9FAFB' : '#F2F6F7' },
            ]}
        >
            <Text style={{ paddingLeft: 20, paddingVertical: '15%', color: 'black', fontSize: 18, fontFamily: Constants.LIST_FONT_FAMILY }}>{item.value}</Text>
            {/* {renderSelectedFilterTextView()} */}
        </ TouchableOpacity >
    );
}

export default FilterOptionItem

