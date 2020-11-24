
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Modal,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { Icon, Button } from 'react-native-elements';
import * as Constants from '../../services/Constants';
import FilterDetail from './FilterDetail';
import FilterOptionItem from './FilterOptionItem';
import { getCategoriesForFilter, getBrands } from '../../services/Categories';

class Filter extends Component {

    // this.props.filterOptions = [
    //     {
    //         id: '1',
    //         value: 'Sort by',
    //         type: 'Single',
    //         details: [],
    //         selectedIndex: 0
    //     },
    //     {
    //         id: '2',
    //         value: 'Categories',
    //         type: 'Multiple',
    //         details: []
    //     },
    //     {
    //         id: '3',
    //         value: 'Brands',
    //         type: 'Multiple',
    //         details: []
    //     },
    //     // {
    //     //     id: '4',
    //     //     value: 'Ratings',
    //     //     type: 'Single',
    //     //     details: [],
    //     //     selectedIndex: null
    //     // },
    //     // {
    //     //     id: '5',
    //     //     value: 'More Filters',
    //     //     type: 'Single',
    //     //     details: [],
    //     //     selectedIndex: null
    //     // }
    // ]
    categories = []
    brands = []
    sortDetails = [

        {
            id: '1',
            value: 'Near By',
            checked: false
        },
    ]

    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            selectedType: props.filterOptions[0].type,
            selectedItem: props.filterOptions[0].value,
            selectedFilterDetails: [],
            loading: false,
            selectedRadioButtonIndex: props.filterOptions[0].selectedIndex,
            isApplyDisabled: true
        }

    }

    componentDidMount = async () => {
        const { filterOptions } = this.props
        this.startLoading()
        let isApiReloadRequired = true;
        for (const item of filterOptions) {
            if (item.value == 'Categories' || item.value == 'Brands') {
                if (Array.isArray(item.details) && item.details.length)
                    isApiReloadRequired = false
            }
        }
        if (isApiReloadRequired) {
            await this.getFilterCategories()
            await this.getFilterBrands()
            await this.createOrRefreshFilterData()
        }
        this.setOrResetState()
        console.log('Final Filter Data>>>', JSON.stringify(this.props.filterOptions))
        this.stopLoading()
    }

    getFilterCategories = async () => {
        let response = await getCategoriesForFilter()
        if (response.status == 200) {
            let jsonCategories = JSON.parse(response.responseJson)
            jsonCategories = jsonCategories.map(v => ({ ...v, checked: false }))
            this.categories = jsonCategories

        }
        else {
            //this.stopLoading()
        }
    }
    getFilterBrands = async () => {
        let response = await getBrands()
        if (response.status == 200) {
            let jsonBrands = JSON.parse(response.responseJson)
            jsonBrands = jsonBrands.map(v => ({ ...v, checked: false }))
            this.brands = jsonBrands
        }
        else {
            //this.stopLoading()
        }
    }

    createOrRefreshFilterData = async () => {
        const { filterOptions } = this.props
        filterOptions.forEach((image, index) => {
            let details = []
            switch (image.value) {
                case 'Sort by':
                    details = JSON.parse(JSON.stringify(this.sortDetails))
                    break;
                case 'Categories':
                    details = JSON.parse(JSON.stringify(this.categories))
                    break;
                case 'Brands':
                    details = JSON.parse(JSON.stringify(this.brands))
                    break;
                case 'Ratings':
                    details = JSON.parse(JSON.stringify(this.sortDetails))
                    break;
                case 'More Filters':
                    details = JSON.parse(JSON.stringify(this.sortDetails))
                    break;
            }
            image.details = details
            if (image.type === 'Single') {
                image.selectedIndex = 0
            }
            this[index] = image;
        }, filterOptions);
        this.setOrResetState()
    }

    clearFilterData = async () => {
        const { filterOptions } = this.props

        filterOptions.forEach((image, index) => {
            let details = []
            // if(image.value == 'Categories' || image.value == 'Categories'){
            //     image.details.map(x => x.checked = false) 
            // }
            // else if(image.value == 'Sort by'){
            //     image.details = JSON.parse(JSON.stringify(this.sortDetails))
            // }
            switch (image.value) {
                case 'Sort by':
                    details = JSON.parse(JSON.stringify(this.sortDetails))
                    break;
                case 'Categories':
                case 'Brands':
                    details = image.details.map(x => ({ ...x, checked: false }))
                    break;
                case 'Ratings':
                    details = JSON.parse(JSON.stringify(this.sortDetails))
                    break;
                case 'More Filters':
                    details = JSON.parse(JSON.stringify(this.sortDetails))
                    break;
            }
            image.details = details
            if (image.type === 'Single') {
                image.selectedIndex = 0
            }
            this[index] = image;
        }, filterOptions);
        this.setOrResetState()
    }

    setOrResetState = () => {
        this.setState({
            selectedRadioButtonIndex: this.props.filterOptions[0].selectedIndex,
            selectedType: this.props.filterOptions[0].type,
            selectedItem: this.props.filterOptions[0].value,
            selectedFilterDetails: this.props.filterOptions[0].details
        }
        )
    }

    startLoading = () => {
        this.setState({ loading: true })
    }
    stopLoading = () => {
        this.setState({ loading: false })
    }

    onClearFilterHandler = async () => {
        console.log("CLEAR ALL CLICKED...");
        await this.clearFilterData()
        this.props.onClearFilter(this.props.filterOptions)
        this.onCloseClick()
    }
    onApplyFilterHandler = () => {
        console.log("APPLY CLICKED...");
        this.props.onApplyFilter(this.props.filterOptions)
        this.onCloseClick()
    }

    onFilterItemClick = (item) => {
        console.log("ITEM111>>>", item.details)
        let detailType = item.type
        let valueDetails = item.details/*this.sortDetails*/
        this.setState(
            {
                selectedItem: item.value,
                selectedFilterDetails: valueDetails,
                selectedType: detailType,
                selectedRadioButtonIndex: item.selectedIndex
            }, () => console.log("ITEM>>>", this.state.selectedFilterDetails)
        );

        this.renderSubMenu(item);
    }

    onCloseClick = () => {
        this.props.onModalClose();
        console.log("CLOSE>>")
    }

    renderFilterListComponent = ({ item }) => {
        return (
            <FilterOptionItem
                item={item}
                selected={this.state.selectedItem === item.value ? true : false}
                onSelect={(item) => this.onFilterItemClick(item)}
            />
        )
    }

    renderSubMenu = (item) => {
        if (item.value === 'Sort by') {
            console.log("sortby>>>>")

        } else if (item.value === 'Rating') {
            console.log("rating>>>>")
        }
    }

    renderSeparatorView = () => {
        return (
            <View style={{
                height: 1,
                width: "100%",
                backgroundColor: "#CEDCCE",
            }}
            />
        );
    };

    isCheckApplied = () => {

        for (const element of this.props.filterOptions) {
            if (element.type === 'Multiple') {
                if (element.details.some(e => e.checked === true)) {
                    return true;
                }
            }
        }
        return false;
    }

    onCheckItemSelected = (detail) => {
        const { filterOptions } = this.props
        let objIndex = filterOptions.findIndex((obj => obj.value == this.state.selectedItem));
        filterOptions[objIndex].details = detail
        let isCheckApplied = this.isCheckApplied()
        console.log('isCheckApplied>>', isCheckApplied)
        this.setState({ selectedFilterDetails: detail, isApplyDisabled: !isCheckApplied })
    }

    onSelectRadioButton = (index) => {
        const { filterOptions } = this.props
        let objIndex = filterOptions.findIndex((obj => obj.value == this.state.selectedItem));
        filterOptions[objIndex].selectedIndex = index
        console.log('Filter Options after Radio', JSON.stringify(filterOptions))
        this.setState({ selectedRadioButtonIndex: index })
    }

    render() {
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                // onRequestClose={() => {
                //     this.onCloseClick
                // }}
                >
                    <View style={{ backgroundColor: 'transparent', flex: 1 }}>

                    </View>

                    <View style={styles.modal}>
                        {this.state.loading &&
                            <View style={styles.overlay}>
                                <ActivityIndicator size='large'
                                    color={Constants.DOBO_RED_COLOR} />
                            </View>
                        }
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ padding: 20 }}>
                                <Text style={{ fontSize: 16, fontFamily: Constants.BOLD_FONT_FAMILY }}>Sort and filters</Text>
                            </View>

                            <TouchableWithoutFeedback>
                                <TouchableOpacity style={{ right: 10, position: 'absolute', padding: 20 }}
                                    onPress={
                                        this.onCloseClick
                                    }>
                                    <Icon name="close" type="material" color="black"></Icon>
                                </TouchableOpacity>
                            </TouchableWithoutFeedback>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#DAE7EC',
                                borderBottomWidth: 1,
                            }} />
                        <View style={styles.mainFilterView}>
                            <View style={{ flex: 0.6 }}>
                                <FlatList
                                    data={this.props.filterOptions}
                                    extraData={this.state.selectedItem}
                                    ItemSeparatorComponent={this.renderSeparatorView}
                                    horizontal={false}
                                    renderItem={this.renderFilterListComponent}
                                    keyExtractor={item => item.id}>

                                </FlatList>

                            </View>
                            <View
                                style={{
                                    borderLeftWidth: 1,
                                    borderLeftColor: '#DAE7EC',

                                }}
                            />
                            <View style={{ flex: 1 }}>
                                <FilterDetail
                                    filterItem={this.state.selectedFilterDetails}
                                    type={this.state.selectedType}
                                    onCheckItemSelected={this.onCheckItemSelected}
                                    selectedRadioButtonIndex={this.state.selectedRadioButtonIndex}
                                    onSelectRadioButton={this.onSelectRadioButton}
                                />
                            </View>
                        </View>
                        <View style={styles.footerView}>
                            <TouchableOpacity style={{ justifyContent: 'center' }} onPress={this.onClearFilterHandler}>
                                <Text style={{ alignSelf: 'center', color: Constants.DOBO_RED_COLOR, fontSize: 18, fontFamily: Constants.LIST_FONT_FAMILY }}>Clear all</Text>
                            </TouchableOpacity>
                            <View style={{ alignSelf: 'center' }}>
                                <Button
                                    title="Apply"
                                    buttonStyle={{ backgroundColor: Constants.DOBO_RED_COLOR }}
                                    titleStyle={{ fontSize: 16, padding: 30 }}
                                    onPress={this.onApplyFilterHandler}
                                    disabled={this.state.isApplyDisabled}
                                    disabledStyle={{ backgroundColor: Constants.DOBO_RED_DISABLED_COLOR }}
                                    disabledTitleStyle={{ color: 'white' }}
                                />
                            </View>

                        </View>
                    </View>
                </Modal>
            </View >

        )
    }

}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        borderColor: '#fff',
        backgroundColor: "white",
    },
    footerView: {
        paddingHorizontal: '5%',
        flex: 2,
        flexDirection: 'row',
        borderTopColor: '#DAE7EC',
        borderWidth: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        //backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center'
    },
    mainFilterView: {
        flexDirection: 'row',
        flex: 4
    }
});
export default Filter;