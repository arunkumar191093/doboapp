import React, { PureComponent } from 'react'
import { View, FlatList, Text, ScrollView, StyleSheet } from 'react-native'
import { CheckBox } from 'react-native-elements'
import * as Constants from '../../services/Constants'
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


class FilterDetail extends PureComponent {


    handleChange = (index) => {
        let detailItem = [...this.props.filterItem]
        detailItem[index].checked = !detailItem[index].checked
        if (detailItem[index].children && detailItem[index].children.length) {
            detailItem[index].children.forEach((c) => {
                c.checked = detailItem[index].checked;
            })
        }
        this.props.onCheckItemSelected(detailItem)
    }

    handleChildChange = (parent, item, index, parentIdx) => {
        let detailItem = [...this.props.filterItem]
        parent.children[index].checked = !parent.children[index].checked;
        if (this.checkForSelectAllChilds(parent)) {
            parent.checked = true;
        }
        else {
            parent.checked = false;
        }
        if (parent.children[index].children && parent.children[index].children.length) {
            parent.children[index].children.forEach((subChild) => {
                subChild.checked = parent.children[index].checked;
            })
        }
        this.props.onCheckItemSelected(detailItem)
    }
    handleSubChildChange = (parent, subParent, item, index, parentIdx) => {
        let detailItem = [...this.props.filterItem]
        subParent.children[index].checked = !subParent.children[index].checked;
        if (this.checkForSelectAllChilds(subParent)) {
            subParent.checked = true;
        }
        else {
            subParent.checked = false;
        }
        this.props.onCheckItemSelected(detailItem)
    }

    checkForSelectAllChilds = (parent) => {
        let total = parent.children.length, count = 0;
        parent.children.forEach((c) => {
            if (c.checked) {
                count += 1;
            }
        })
        return count == total;
    }

    onSelectRadioButton = (index) => {
        this.props.onSelectRadioButton(index)
    }

    getItemLayout = (data, index) => {
        return { length: 50, offset: 50 * index, index }
    }

    calculateOffsetValue(data, index) {
        let totalOffset = 0;
        data.forEach((catItem, idx) => {
            // if (idx < index) {
            let childOffset = 0, subChildOffset = 0;
            if (catItem.expand) {
                childOffset = catItem.children && catItem.children.length ? (catItem.children.length * 40) + 50 : 50;
                if (catItem.children) {
                    catItem.children.forEach((catChild) => {
                        subChildOffset = subChildOffset + catChild.expand && catChild.children && catChild.children.length ? (catChild.children.length * 40) + 50 : 50;
                    })
                }
            }
            totalOffset = totalOffset + childOffset + subChildOffset;
            // }
        })
        console.log('totalOffset', totalOffset)
        return totalOffset;
    }

    oninnerChildIconPress = (index, item, parentIdx) => {
        let detailItem = [...this.props.filterItem];

        detailItem[parentIdx].children[index].expand = !detailItem[parentIdx].children[index].expand;
        this.props.onIconPress(detailItem)
        let offsetValue = this.calculateOffsetValue(detailItem, parentIdx);
        setTimeout(() => {
            if (this.flatListRef) {
                this.flatListRef.scrollToOffset({ animated: true, offset: offsetValue });
            }
        }, 200)
    }

    renderSubChild = (parent, subParent, item, index, parentIdx) => {
        console.log('FilterItem sub-child>>>', item, parent)
        return (
            <CheckBox
                title={item.name}
                onPress={() => this.handleSubChildChange(parent, subParent, item, index, parentIdx)}
                checkedColor={Constants.DOBO_RED_COLOR}
                checked={item.checked}
                fontFamily={Constants.LIST_FONT_FAMILY}
                containerStyle={styles.subChildCheckboxContainer}
            />
        )
    }

    onIconPress = (index, item) => {
        let detailItem = [...this.props.filterItem]
        detailItem[index].expand = !detailItem[index].expand;
        this.props.onIconPress(detailItem)
        let offsetValue = this.calculateOffsetValue(detailItem, index);
        setTimeout(() => {
            if (this.flatListRef) {
                this.flatListRef.scrollToOffset({ animated: true, offset: offsetValue });
            }
        }, 200)
    }

    renderChild = (parent, item, index, parentIdx) => {
        console.log('FilterItem child>>>', item, parent)
        let subParent = item;
        return (
            <>
                <View style={{ flexDirection: 'row' }}>
                    <CheckBox
                        title={item.name}
                        onPress={() => this.handleChildChange(parent, item, index, parentIdx)}
                        checkedColor={Constants.DOBO_RED_COLOR}
                        checked={item.checked}
                        textStyle={{ fontFamily: Constants.LIST_FONT_FAMILY }}
                        containerStyle={styles.childCheckboxContainer}
                    />
                    {
                        item.children && !!item.children.length &&
                        <Icon
                            onPress={() => this.oninnerChildIconPress(index, item, parentIdx)}
                            name={item.expand ? 'minus-box-outline' : 'plus-box-outline'}
                            color={'#c4d5de'}
                            size={24}
                            style={styles.iconStyle}
                        />
                    }
                </View>
                {
                    item.expand &&
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={item.children}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item, index }) => this.renderSubChild(parent, subParent, item, index, parentIdx)}
                        />
                    </View>
                }
            </>

        )
    }

    renderItem = ({ item, index }) => {
        console.log('FilterItem Item>>>', item)
        let parent = item,
            parentIdx = index;
        return (
            <>
                <View style={[!!this.props.isSelectedItemTree ? styles.parenAccordionHeading : { flexDirection: 'row' }]}>
                    {
                        !!this.props.isSelectedItemTree ?
                            <Text style={{ padding: 12, paddingHorizontal: 18, fontFamily: Constants.LIST_FONT_FAMILY }}>{item.name}</Text>
                            :
                            <CheckBox
                                title={item.name}
                                onPress={() => this.handleChange(index)}
                                checkedColor={Constants.DOBO_RED_COLOR}
                                checked={item.checked}
                                textStyle={{ fontFamily: Constants.LIST_FONT_FAMILY }}
                                containerStyle={{ width: '90%' }}
                            />
                    }
                    {
                        item.children && !!item.children.length &&
                        <Icon
                            onPress={() => this.onIconPress(index, item)}
                            name={item.expand ? 'minus-box-outline' : 'plus-box-outline'}
                            color={'#c4d5de'}
                            size={24}
                            style={styles.iconStyle}
                        />
                    }
                </View>
                {
                    item.expand &&
                    <View style={{ flex: 1 }}>
                        <FlatList
                            data={item.children}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item, index }) => this.renderChild(parent, item, index, parentIdx)}
                        />
                    </View>
                }
            </>
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
                            <RadioButton value={item1.id} key={item1.id}>
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
                {
                    this.props.filterItem && this.props.filterItem.length ?
                        <FlatList
                            ref={(ref) => { this.flatListRef = ref; }}
                            getItemLayout={this.getItemLayout}
                            data={this.props.filterItem}
                            keyExtractor={item => item.id.toString()}
                            renderItem={this.renderItem}
                        /> :
                        <Text style={styles.noMsgText}>No Data Found</Text>
                }
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

const styles = StyleSheet.create({
    iconStyle: {
        position: 'absolute',
        top: '30%',
        right: "10%"
    },
    childCheckboxContainer: {
        // backgroundColor: '#fff',
        // borderWidth: 0,
        padding: 8,
        // paddingLeft: 16
        margin: 2,
        width: '90%'
    },
    subChildCheckboxContainer: {
        backgroundColor: '#fff',
        borderWidth: 0,
        padding: 2,
        paddingLeft: 11,
        margin: 0,
        // width: '90%'
    },
    parenAccordionHeading: {
        flexDirection: 'row',
        borderBottomWidth: 0.8,
        borderBottomColor: '#CEDCCE',
        borderTopWidth: 0.8,
        borderTopColor: '#CEDCCE'
    },
    noMsgText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: Constants.LIST_FONT_FAMILY,
        paddingTop: '40%'
    }
})

export default FilterDetail