import React, { PureComponent } from 'react'
import { View, FlatList, Text, ScrollView } from 'react-native'
import { CheckBox } from 'react-native-elements'
import * as Constants from '../../services/Constants'
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'


class FilterDetail extends PureComponent {


    handleChange = (index) => {
        let detailItem = [...this.props.filterItem]
        detailItem[index].checked = !detailItem[index].checked
        this.props.onCheckItemSelected(detailItem)
    }

    onSelectRadioButton = (index) => {
        this.props.onSelectRadioButton(index)
    }

    renderItem = ({ item, index }) => {
        console.log('FilterItem Item>>>', item.name)
        return (
            <CheckBox
                title={item.name}
                onPress={() => this.handleChange(index)}
                checkedColor={Constants.DOBO_RED_COLOR}
                checked={item.checked} />
        )
    }



    renderSingleSelectionView = () => {
        console.log('renderSingleSelectionView()')
        return (
            <ScrollView style={{ margin: '5%' }}>
                <RadioGroup
                    size={24}
                    thickness={2}
                    color={Constants.DOBO_RED_COLOR}
                    //highlightColor='#ccc8b9'
                    selectedIndex={this.props.selectedRadioButtonIndex}
                    onSelect={(index, value) => this.onSelectRadioButton(index, value)}
                >
                    {this.props.filterItem.map(item1 => {
                        return (
                            <RadioButton value={item1.id}>
                                <Text>{item1.value}</Text>
                            </RadioButton>);
                    })}
                </RadioGroup>
            </ScrollView>
        )
    }

    renderMultipleSelectionView = () => {
        console.log('renderMultipleSelectionView()', this.props.filterItem)
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={this.props.filterItem}
                    keyExtractor={item => item.id}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }
    render() {
        console.log('Detail Type>>>', this.props.type)
        if (this.props.type === 'Single') {
            return this.renderSingleSelectionView()
        }
        else {
            return this.renderMultipleSelectionView()
        }

    }
}

export default FilterDetail