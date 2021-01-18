
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
import { getCategoriesForFilter, getBrands, getCategoriesForFilterForStore } from '../../services/Categories';
import EntypoIcon from 'react-native-vector-icons/Entypo';

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
        {
            id: '2',
            value: 'Rating',
            checked: false
        },
    ]
    storeSortDetails = [

        {
            id: '1',
            value: "What's New",
            mapping: 'whatsnew',
            checked: false
        },
        {
            id: '2',
            value: "Price Low To High",
            mapping: 'PriceLowToHigh',
            checked: false
        },
        {
            id: '3',
            value: "Price High To Low",
            mapping: 'PriceHighToLow',
            checked: false
        },
        {
            id: '4',
            value: "Discount",
            mapping: 'discount',
            checked: false
        }
    ]

    constructor(props) {
        super(props);
        console.log('filter store', props.storeData)
        this.state = {
            isModalVisible: false,
            selectedType: props.filterOptions[0].type,
            selectedItem: props.filterOptions[0].value,
            selectedFilterDetails: [],
            isSelectedItemTree: !!props.filterOptions[0].isTree,
            loading: false,
            selectedRadioButtonIndex: props.filterOptions[0].selectedIndex,
            isApplyDisabled: true,
            isFilterInsideStore: !!props.isFilterInsideStore,
            storeDetails: props.storeData
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
            await this.getFilterCategoriesForStore()
            await this.getFilterBrands()
            await this.createOrRefreshFilterData()
            // if (this.state.isFilterInsideStore) {
            //     let defaultSelectItem = this.props.filterOptions[0];
            //     this.onFilterItemClick(defaultSelectItem);
            // }
        }
        this.setOrResetState()
        console.log('Final Filter Data>>>', JSON.stringify(this.props.filterOptions))
        this.stopLoading()
    }

    // componentDidUpdate(prevProps, prevState, snapshot){
    //     console.log("in did update",prevProps, prevState, snapshot)
    //     console.log('this.props.categoriesForStore',this.props.categoriesForStore)
    //     if( this.props.storeData && (prevProps.storeData.id != this.props.storeData.id)){
    //         console.log('in if')
    //         this.createOrRefreshFilterData();
    //     }
    // }

    getFilterCategories = async () => {
        if (!this.state.isFilterInsideStore) {
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
    }

    getFilterCategoriesForStore = async () => {
        if (this.state.isFilterInsideStore) {
            let response = await getCategoriesForFilterForStore(this.state.storeDetails.id)
            if (response.status == 200) {
                let jsonCategories = response.responseJson
                console.log('getFilterCategoriesForStore', jsonCategories)
                jsonCategories = jsonCategories.map(v => ({ ...v, checked: false }))
                this.categories = jsonCategories

            }
            else {
                //this.stopLoading()
            }
        }
    }
    getFilterBrands = async () => {
        let response = await getBrands()
        if (response.status == 200) {
            let jsonBrands = JSON.parse(response.responseJson);
            let distinctBrands = []
            jsonBrands = jsonBrands.forEach(v => {
                let index = distinctBrands.findIndex(b => b.name == v.name);
                if (index > -1) {
                    distinctBrands[index].brandIds.push(v.id)
                } else {
                    distinctBrands.push({ ...v, checked: false, brandIds: [v.id] })
                }
            })
            this.brands = distinctBrands;
        }
        else {
            //this.stopLoading()
        }
    }

    createOrRefreshFilterData = async (isUpdateFlow) => {
        const { filterOptions } = this.props
        filterOptions.forEach((image, index) => {
            let details = []
            switch (image.value) {
                case 'Sort by':
                    details = this.state.isFilterInsideStore ? JSON.parse(JSON.stringify(this.storeSortDetails)) : JSON.parse(JSON.stringify(this.sortDetails))
                    break;
                case 'Categories':
                    details = this.props.categoriesForStore ? JSON.parse(JSON.stringify(this.props.categoriesForStore)) : JSON.parse(JSON.stringify(this.categories));
                    break;
                case 'Brands':
                    details = JSON.parse(JSON.stringify(this.brands))
                    break;
                case 'Ratings':
                    details = this.state.isFilterInsideStore ? JSON.parse(JSON.stringify(this.storeSortDetails)) : JSON.parse(JSON.stringify(this.sortDetails))
                    break;
                case 'More Filters':
                    details = this.state.isFilterInsideStore ? JSON.parse(JSON.stringify(this.storeSortDetails)) : JSON.parse(JSON.stringify(this.sortDetails))
                    break;
            }
            image.details = details
            if (image.type === 'Single') {
                image.selectedIndex = 0
            }
            this[index] = image;
        }, filterOptions);
        this.setOrResetState(isUpdateFlow)
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
                    details = this.state.isFilterInsideStore ? JSON.parse(JSON.stringify(this.storeSortDetails)) : JSON.parse(JSON.stringify(this.sortDetails))
                    break;
                case 'Categories':
                case 'Brands':
                    details = image.details.map(x => {
                        if (x.children) {
                            x.children.forEach((c) => {
                                c.checked = false
                                c.expand = false
                                if (c.children) {
                                    c.children.forEach((subC) => {
                                        subC.checked = false;
                                    })
                                }
                            })
                        }
                        return ({ ...x, expand: false, checked: false })
                    })
                    break;
                case 'Ratings':
                    details = this.state.isFilterInsideStore ? JSON.parse(JSON.stringify(this.storeSortDetails)) : JSON.parse(JSON.stringify(this.sortDetails))
                    break;
                case 'More Filters':
                    details = this.state.isFilterInsideStore ? JSON.parse(JSON.stringify(this.storeSortDetails)) : JSON.parse(JSON.stringify(this.sortDetails))
                    break;
            }
            image.details = details
            if (image.type === 'Single') {
                image.selectedIndex = 0
            }
            this[index] = image;
        }, filterOptions);
        this.setOrResetState();
    }

    setOrResetState = (isUpdateFlow) => {
        let isCheckApplied = this.isCheckApplied();
        // if (isUpdateFlow && this.state.isFilterInsideStore) {
        //     let valueDetails = this.props.filterOptions[1].details;
        //     let modifiedData = this.createParentChildRelations(valueDetails);
        //     this.setState({
        //         selectedItem: this.props.filterOptions[1].value,
        //         selectedFilterDetails: modifiedData,
        //         isSelectedItemTree: !!this.props.filterOptions[1].isTree,
        //         selectedType: this.props.filterOptions[1].type,
        //     }
        //     )
        // } else {
            this.setState({
                selectedRadioButtonIndex: this.props.filterOptions[0].selectedIndex,
                selectedType: this.props.filterOptions[0].type,
                selectedItem: this.props.filterOptions[0].value,
                selectedFilterDetails: this.props.filterOptions[0].details,
                isSelectedItemTree: !!this.props.filterOptions[0].isTree,
                isApplyDisabled: !isCheckApplied
            }
            )
        // }
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

    createParentChildRelations = (inputArr) => {
        let mainArr = [];
        if (inputArr) {
            inputArr.forEach(element => {
                if (!element.parent_Category) {
                    element.children = element.children && element.children.length ? element.children : [];
                    mainArr.push(element)
                }
                else {
                    //checking if element is child of parent
                    let index = mainArr.findIndex(item => {
                        return item.id == element.parent_Category.id;
                    })
                    if (index > -1) {
                        //checking if element is already present in children array
                        let cIdx = mainArr[index].children.findIndex((el) => el.id == element.id)
                        if (cIdx == -1) {
                            mainArr[index].children.push(element);
                        }
                    }
                    else {
                        mainArr.some((mainEle) => {
                            // method which will append subchild to children of parent
                            return this.createParentSubChildRelations(mainEle.children, element);
                        })
                    }
                }
            });
        }
        return mainArr;
    }

    createParentSubChildRelations = (childArr, subChildElement) => {
        let index = childArr.findIndex(item => {
            return item.id == subChildElement.parent_Category.id;
        })
        if (index > -1) {
            //checking if child already has subchilds 
            if (childArr[index].children && childArr[index].children.length) {
                //checking if element is already present in children array
                let cIdx = childArr[index].children.findIndex((el) => el.id == subChildElement.id)
                if (cIdx == -1) {
                    childArr[index].children.push(subChildElement);
                    return true;
                }
            }
            else {
                childArr[index].children = [subChildElement];
                return true;
            }
        }
        return false
    }

    onFilterItemClick = (item) => {
        console.log("ITEM111>>>", item.details)
        let detailType = item.type
        let valueDetails = item.details/*this.sortDetails*/
        let modifiedData = this.createParentChildRelations(valueDetails);
        console.log('parent child', modifiedData)
        this.startLoading()
        this.setState(
            {
                selectedItem: item.value,
                selectedFilterDetails: modifiedData,
                selectedType: detailType,
                selectedRadioButtonIndex: item.selectedIndex,
                isSelectedItemTree: !!item.isTree
            }, () => console.log("ITEM>>>", this.state.selectedFilterDetails)
        );

        this.renderSubMenu(item);
        this.stopLoading()
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

    renderSubMenu = async (item) => {
        if (item.value === 'Sort by') {
            console.log("sortby>>>>")

        } else if (item.value === 'Rating') {
            console.log("rating>>>>")
        }
        else if (item.value === 'Categories') {
            console.log("Categories>>>>")
            // if (this.state.isFilterInsideStore) {
            //     await this.getFilterCategoriesForStore();
            //     await this.createOrRefreshFilterData(true)
            // }
            // // await this.getFilterBrands()
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
                if (element.details.some(e => {
                    if (e.children) { //checking if children are there
                        if (e.children.some(child => {
                            if (child.children) { //checking if sub children are there
                                if (child.children.some(subChild => subChild.checked === true)) {
                                    return true;
                                }
                            }
                            return child.checked === true;
                        })) {
                            return true;
                        }
                    }
                    return e.checked === true
                })) {
                    return true;
                }
            }
            // else if (element.type === 'Single' && this.state.isFilterInsideStore) {
            //     return true;
            // }
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

    handleIconPress = (details) => {
        this.setState({ selectedFilterDetails: details })
    }

    onSelectRadioButton = (index) => {
        const { filterOptions } = this.props
        let objIndex = filterOptions.findIndex((obj => obj.value == this.state.selectedItem));
        filterOptions[objIndex].selectedIndex = index
        console.log('Filter Options after Radio', JSON.stringify(filterOptions))
        this.setState({ selectedRadioButtonIndex: index, isApplyDisabled: !this.state.isFilterInsideStore })
    }

    render() {
        console.log('this.state.selectedFilterDetails',this.state.selectedFilterDetails)
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    // visible={true}
                    onRequestClose={this.onCloseClick}>
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
                                <Text style={{ fontSize: 16, fontFamily: Constants.BOLD_FONT_FAMILY }}>Filters</Text>
                            </View>

                            <TouchableWithoutFeedback>
                                <TouchableOpacity style={{ right: 0, position: 'absolute', padding: 20 }}
                                    onPress={
                                        this.onCloseClick
                                    }>
                                    <EntypoIcon name="circle-with-cross" color={Constants.DOBO_RED_COLOR}
                                        size={30} />
                                </TouchableOpacity>
                            </TouchableWithoutFeedback>
                        </View>
                        <View
                            style={{
                                borderBottomColor: '#DAE7EC',
                                borderBottomWidth: 1,
                            }} />
                        <View style={styles.mainFilterView}>
                            <View style={{ flex: 0.4 }}>
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
                                    filterItem={this.props.filterOptions[1].value == this.state.selectedItem && this.props.categoriesForStore ? this.createParentChildRelations(this.props.categoriesForStore) : this.state.selectedFilterDetails}
                                    type={this.state.selectedType}
                                    onCheckItemSelected={this.onCheckItemSelected}
                                    selectedRadioButtonIndex={this.state.selectedRadioButtonIndex}
                                    onSelectRadioButton={this.onSelectRadioButton}
                                    onIconPress={this.handleIconPress}
                                    isSelectedItemTree={this.state.isSelectedItemTree}
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
                                    buttonStyle={{ backgroundColor: Constants.DOBO_RED_COLOR, borderRadius: 40 }}
                                    titleStyle={{ fontSize: 16, padding: 30, fontFamily: Constants.LIST_FONT_FAMILY }}
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
        flex: 2,
        borderColor: '#fff',
        backgroundColor: "white",
    },
    footerView: {
        paddingHorizontal: '5%',
        flex: 1,
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