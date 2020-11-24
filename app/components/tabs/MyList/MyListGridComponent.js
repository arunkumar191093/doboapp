/***
 Use this component inside your React Native Application.
 A scrollable list with different item type
 */
import React, { PureComponent } from "react";
import { RecyclerListView } from "recyclerlistview";
import CampaignCard from "./CampaignCard";
import StoreAdsCard from "./StoreAdsCard";
import ProductsCard from "./ProductsCard";

export default class MyListGridComponent extends PureComponent {

    constructor(props) {
        super(props);

        //let { width } = Dimensions.get("window");

        //Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
        //THIS IS VERY IMPORTANT, FORGET PERFORMANCE IF THIS IS MESSED UP
        // this.dataProvider = new DataProvider((r1, r2) => {
        //     return r1 !== r2;
        // }).cloneWithRows(props.data);
        //Create the layout provider
        //First method: Given an index return the type of item e.g ListItemType1, ListItemType2 in case you have variety of items in your list/grid
        //Second: Given a type and object set the exact height and width for that type on given object, if you're using non deterministic rendering provide close estimates
        //If you need data based check you can access your data provider here
        //You'll need data in most cases, we don't provide it by default to enable things like data virtualization in the future
        //NOTE: For complex lists LayoutProvider will also be complex it would then make sense to move it to a different file
        //this._layoutProvider = new LayoutProvider(this.props.dataProvider)

        this._rowRenderer = this._rowRenderer.bind(this);

        //Since component should always render once data has changed, make data provider part of the state
        // this.state = {
        //     dataProvider: this.dataProvider.cloneWithRows(this.props.data)
        // };
    }

    //Given type and data return the view component
    _rowRenderer(type, data) {
        //You can return any view here, CellContainer has no special significance
        console.log('row render', type, data)
        switch (type) {
            case 'STORE_ITEM':
                return (
                    <StoreAdsCard
                        data={data}
                        onImageClickHandler={this.props.onImageClickHandler}
                        onDeleteClickHandler={this.props.onDeleteClickHandler}
                        onShareClickHandler={this.props.onShareClickHandler}
                    />
                )
            case 'PRODUCT_ITEM':
                return (
                    <ProductsCard
                        data={data}
                        onImageClickHandler={this.props.onImageClickHandler}
                        onDeleteClickHandler={this.props.onDeleteClickHandler}
                        onShareClickHandler={this.props.onShareClickHandler}
                    />
                )
            case 'CN_ITEM':
                return (
                    <CampaignCard
                        data={data}
                        onImageClickHandler={this.props.onImageClickHandler}
                        onDeleteClickHandler={this.props.onDeleteClickHandler}
                        onShareClickHandler={this.props.onShareClickHandler} />
                )
            default:
                return null;
        }
    }

    render() {
        return (
            <RecyclerListView
                layoutProvider={this.props.layoutProvider}
                dataProvider={this.props.dataProvider}
                rowRenderer={this._rowRenderer}
                scrollViewProps={this.props.scrollViewProps}
            />
        )
    }
}


