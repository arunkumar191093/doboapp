import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as likeActions from '../../actions/like'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, ImageBackground, StyleSheet, Text, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Modal } from "react-native";
import { GetProductsDetails, GetStoreAdDetails } from "../../services/StoreApi";
import { EntityType, StoreEntityType } from '../../services/ApiConstants';
import * as Constants from '../../services/Constants'
import ProductSizeList from "./ProductSizeList";
import ProductColorList from "./ProductColorList";
import AutoPlayCarousel from '../Common/AutoPlayCarousel';
import IconComponent from '../Common/IconComponent';
import { Icon } from 'react-native-elements';
import { ImageConst } from '../../services/ImageConstants';
import CartBag from '../Common/CartBag';
import InfoComponent from '../Common/InfoComponent';
import ProductOptions from './ProductOptions';
import NavHeader from '../Common/NavHeader';
import SlideModalPopUp from '../Common/SlideModalPopUp';
import FlashMessage from '../Common/FlashMessage';
import { updateCartItemInStorage, getCartItemsFromStorage, addUpdateProductToBag, getAllProductByStoreId } from '../../services/StoreBag';
import { likeContent, createShareUserAction, shareProduct, callNumber } from '../../services/Helper';
import { DeleteUserActions } from '../../services/UserActions';

class StorePageDetails extends Component {

    storeDetails = {}
    storeInfo = {}
    state = {
        //imageURL: '',
        productDetails: {},
        mediaURLs: [],
        quantity: [1, 2, 3, 4, 5],
        selectedSize: '',
        selectedColor: '',
        selectedQty: 1,
        showProductOptionsModal: false,
        cartItemsCount: 0,
        isAddedInBag: false,
        bagId: 0,
        showFlashMessage: false,
        storeData: {},
        isOfferPage: false
    }
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let productDetails = this.props.navigation.getParam('value');
        this.storeInfo = this.props.navigation.getParam('storeInfo');

        this.setState({ storeData: productDetails });
        let image = Constants.imageResBaseUrl + productDetails.media
        this.setState({ imageURL: image })

        if (productDetails.type == StoreEntityType.FeatureProduct) {
            this.getProductDetails(productDetails.id)
        }
        else if (productDetails.type == StoreEntityType.Offer) {
            this.setState({ isOfferPage: true });
            this.getOfferDetails(productDetails.id)
        }
        if (this.storeInfo.id) {
            this.getBagItems(this.storeInfo.id)
        }
    }

    getProductDetails = async (id) => {
        let response = await GetProductsDetails(id)
        if (response.status == 200) {
            let productDetails = response.responseJson
            let jsonProductDetails = JSON.parse(productDetails)
            this.setState({ productDetails: jsonProductDetails })
            if (jsonProductDetails.mediaUrls) {
                let finalMediaUrls = jsonProductDetails.mediaUrls.map((item) => {
                    return Constants.imageResBaseUrl + item;
                })
                this.setState({ mediaURLs: finalMediaUrls }) //TODO: remove this copying data code
            }
            // this.checkPresenceInCart();
        }
    }

    getOfferDetails = async (id) => {
        let response = await GetStoreAdDetails(id)
        if (response.status == 200) {
            let productDetails = response.responseJson
            let jsonProductDetails = JSON.parse(productDetails)
            this.setState({
                productDetails: jsonProductDetails,
                mediaURLs: [Constants.imageResBaseUrl + jsonProductDetails.media]
            })
            // this.checkPresenceInCart();
        }
    }

    getBagItems = async (storeId) => {
        const response = await getAllProductByStoreId(storeId);
        if (response.status == 200) {
            let cartItems = response.responseJson;
            this.setState({
                cartItemsCount: cartItems.baggedProducts.length,
                bagId: cartItems.baggedProducts[0].baggedProduct.bagId
            })
        }
    }

    handleSizeClick = (item) => {
        this.setState({
            selectedSize: item
        })
    }

    checkPresenceInCart = async () => {
        if (this.storeInfo && this.storeInfo.id) {
            const cartData = await getCartItemsFromStorage(this.storeInfo.id);
            if (cartData.cartItems && cartData.cartItems.length) {
                this.setState({ cartItemsCount: cartData.count })
                cartData.cartItems.some((item) => {
                    if (item.id == this.state.productDetails.id) {
                        let { selectedSize, selectedColor, selectedQty } = item;
                        this.setState({
                            selectedSize,
                            selectedColor,
                            selectedQty,
                            isAddedInBag: true
                        })
                        return true;
                    }
                })
            }

        }
    }

    renderProductOptionsModal = () => {
        const { productDetails } = this.state;
        const disabled = !this.state.selectedSize || !this.state.selectedColor || !this.state.selectedQty;
        return (
            <SlideModalPopUp handleClose={() => this.setState({ showProductOptionsModal: false })}>
                <ProductOptions productSizes={productDetails.productSizes}
                    selectedSize={this.state.selectedSize.size && this.state.selectedSize.size.dimensions}
                    productColors={productDetails.productColors}
                    selectedColor={this.state.selectedColor.color && this.state.selectedColor.color.colorCode}
                    productQty={this.state.quantity} selectedQty={this.state.selectedQty}
                    onSizeSelect={(item) => this.handleSizeClick(item)}
                    onColorSelect={(item) => this.setState({
                        selectedColor: item
                    })}
                    onQtySelect={(item) => this.setState({
                        selectedQty: item
                    })}
                />
                <TouchableOpacity style={[
                    { ...styles.addToBagBtn, width: '105%' },
                    disabled ? styles.disabledBtn : null]} onPress={this.handleAddToBag} disabled={disabled}>
                    <Text style={{ color: 'white', textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY }}>Done</Text>
                </TouchableOpacity>
            </SlideModalPopUp>
        )
    }

    renderImages = (data) => {
        return (
            <ImageBackground
                style={{ ...styles.backgroundImage }}
                source={{ uri: data }}
                resizeMode='contain'

                imageStyle={{ height: '100%', width: '100%' }}
            >
                {/* {this.renderProductDetails()} */}
            </ImageBackground>
        )
    }

    backPressHandler = () => {
        this.props.navigation.goBack();
    }

    handleCartPress = () => {
        this.props.navigation.navigate('StoreBag', { storeInfo: this.storeInfo, bagId: this.state.bagId });
    }

    handleAddToBag = async () => {
        if (!this.state.selectedSize || !this.state.selectedColor || !this.state.selectedQty) {
            this.setState({
                showProductOptionsModal: true
            })
        } else {
            this.setState({
                showProductOptionsModal: false
            })
            let { selectedSize, selectedColor, selectedQty, productDetails, quantity } = this.state;
            let cartItem = {
                "ProductId": productDetails.id, //this ID is the baggedProduct Id not the product that is inside bagged product object
                "SelectedSizeId": selectedSize.sizeId,
                "SelectedColorId": selectedColor.colorId,
                "Quantity": selectedQty
            }

            // const count = await updateCartItemInStorage(this.storeInfo.id, cartItem);
            // this.setState({
            //     cartItemsCount: count,
            //     isAddedInBag: true
            // })
            const response = await addUpdateProductToBag(this.storeInfo.id, cartItem, false, this.state.bagId)
            console.log('add to bag', response)
            if (response.status == 202) {
                this.setState({
                    isAddedInBag: true,
                    showFlashMessage: true
                })
                this.getBagItems(this.storeInfo.id);
            }
        }
    }

    onShareClickHandler = async (item) => {
        console.log("Store Page ITEM_Share>>>>", item)

        let sharedData = 'DOBO APP'
        let isVideo = false;
        if (item != undefined) {

            if (item.mediaType == 0) {
                let replaceUrl = item.media.replace(/\\/gi, '/')
                sharedData = Constants.baseURL + replaceUrl
            }
            else {
                let replaceUrl = item.media
                sharedData = replaceUrl
            }
            try {
                let result = await shareProduct(sharedData, isVideo)
                console.log('shared with App ', result.app)
                const entityType = item.type == StoreEntityType.Offer ? EntityType.Offer : EntityType.FeatureProduct
                let response = await createShareUserAction(entityType, item.id)
                console.log('Share UserAction Response', response)
            } catch (error) {
                console.error('Could not share', error)
            }
        }
    }

    onWishlistClickHandler = async (item) => {
        console.log("Store Page ITEM_WISH>>>>", item)
        let { actions } = this.props;
        if (item.wishList == false) {
            if (item.type == StoreEntityType.Offer) {
                await likeContent(EntityType.Offer, item)
                actions.changeLikeState(true)
                actions.changeLikeShowBadge(true)
            }
            else
                await likeContent(EntityType.FeatureProduct, item)
        }
        else {
            if (item.useraction != undefined) {
                let result = await DeleteUserActions(item.useraction.id)
                console.log('Delete Result>>', result)
            }
        }
        this.setState({
            storeData: { ...this.state.storeData, wishList: !this.state.storeData.wishList }
        })
        // actions.changeLikeState(true)
        // actions.changeLikeShowBadge(true)
        //await this.getStoreAds()
        // await this.getStorePageDetails()
        // if (storeDetails.type == StoreEntityType.FeatureProduct) {
        //     this.getProductDetails(storeDetails.id)
        // }
        // if (this.storeInfo.id) {
        //     this.getBagItems(this.storeInfo.id)
        // }
        // this.stopLoading()
    }

    handleCall = () => {
        callNumber(this.storeInfo.phone || this.storeInfo.retailer.alternateContact)
    }

    render() {
        const { productDetails } = this.state
        if (Object.keys(productDetails).length === 0 && productDetails.constructor === Object) {
            return null
        }
        const { name, discription, price, discount, category, subCategory, otherCategory } = productDetails;
        let categoryName = `${category && category.name || ''}, ${subCategory && subCategory.name || ''}, ${otherCategory && otherCategory.name || ''}`;
        let discountedPrice = (price - price * (discount / 100)).toFixed(0)
        return (
            <View style={{ flex: 1 }}>
                <NavHeader backPressHandler={this.backPressHandler} heading={this.storeInfo.description}>
                    <View style={styles.rightContainer}>
                        <MaterialCommunityIcons name='phone' size={20} color="#31546e" style={styles.callIcon} onPress={this.handleCall} />
                        {
                            Constants.SHOW_FEATURE && !this.state.isOfferPage &&
                            <CartBag count={this.state.cartItemsCount} onBadgePress={this.handleCartPress} />
                        }
                    </View>
                </NavHeader>
                <ScrollView contentContainerStyle={{
                    paddingBottom: Constants.STORE_CHECKIN_BUTTON_POSITION + 40,
                    flexGrow: 1,
                    marginTop: 40
                }}>
                    <AutoPlayCarousel
                        children={this.state.mediaURLs}
                        renderItem={({ item }) => this.renderImages(item)}
                        height={Constants.SCREEN_HEIGHT / 1.5}
                        autoplay={false}
                        isDataLoaded={true}
                    />
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, paddingHorizontal: 12 }}>
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemText} numberOfLines={1}>{name}</Text>
                            {/* <Text style={styles.itemSubText} numberOfLines={1}>{'subtext subtext subtext subtext'}</Text> */}
                        </View>
                        <View style={{ height: 30, flexDirection: 'row-reverse' }}>
                            <TouchableOpacity style={styles.share}
                                onPress={() => this.onShareClickHandler(this.state.productDetails)}
                            >
                                <IconComponent
                                    name={ImageConst["share-default"]}
                                    size={22}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.wishlist}
                                onPress={() => this.onWishlistClickHandler(this.state.storeData)}
                            >
                                <IconComponent
                                    name={this.state.storeData.wishList ? ImageConst['like-active'] : ImageConst['like-default']}
                                    size={22}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        !this.state.isOfferPage &&
                        <>
                            <View style={styles.priceInfoContainer}>
                                <Text style={[styles.priceDefault, styles.price]}>Rs. {discountedPrice}</Text>
                                <Text style={[styles.priceDefault, styles.strikePrice]}>Rs. {price}</Text>
                                {
                                    discount ?
                                        <Text style={[styles.priceDefault, styles.discountPercent]}>({discount}% OFF)</Text> : null
                                }
                            </View>
                            <Text style={{ ...styles.priceDefault, color: '#47c15c', paddingHorizontal: 12 }}>Inclusive of all taxes</Text>
                        </>
                    }


                    {
                        productDetails.brand &&
                        <InfoComponent heading="brand">
                            <Text style={styles.infoContent}>{productDetails.brand.name || ''}</Text>
                        </InfoComponent>
                    }
                    {
                        !this.state.isOfferPage &&
                        <ProductOptions productSizes={productDetails.productSizes}
                            selectedSize={this.state.selectedSize.size && this.state.selectedSize.size.dimensions}
                            productColors={productDetails.productColors}
                            selectedColor={this.state.selectedColor.color && this.state.selectedColor.color.colorCode}
                            productQty={this.state.quantity} selectedQty={this.state.selectedQty}
                            onSizeSelect={(item) => this.handleSizeClick(item)}
                            onColorSelect={(item) => this.setState({
                                selectedColor: item
                            })}
                            onQtySelect={(item) => this.setState({
                                selectedQty: item
                            })}
                        />
                    }
                    {
                        !!discription &&
                        <InfoComponent heading={`${this.state.isOfferPage ? 'Offer' : 'Product'} Details`}>
                            <Text numberOfLines={6} style={styles.infoContent}>
                                {discription}
                            </Text>
                        </InfoComponent>
                    }

                    {/* <InfoComponent heading="Product Code">
                        <Text style={styles.infoContent}></Text>
                    </InfoComponent> */}
                    {
                        !this.state.isOfferPage &&
                        <InfoComponent heading="Category">
                            <Text style={styles.infoContent}>{categoryName}</Text>
                        </InfoComponent>
                    }
                </ScrollView >
                {
                    Constants.SHOW_FEATURE && !this.state.isOfferPage &&
                    <TouchableOpacity style={styles.addToBagBtn} onPress={this.state.isAddedInBag ? this.handleCartPress : this.handleAddToBag}>
                        <Text style={{ color: 'white', textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY, }}>
                            {this.state.isAddedInBag ? 'GO TO BAG' : 'ADD TO BAG'}
                        </Text>
                    </TouchableOpacity>
                }

                {this.state.showProductOptionsModal ? this.renderProductOptionsModal() : null}
                {this.state.showFlashMessage &&
                    <FlashMessage heading={'Yay!'}
                        content={'Added to your happy bag.'}
                        timeOut={1500} onAnimateComplete={() => this.setState({ showFlashMessage: false })}
                    />}
            </View>
        )
    }

    // renderProductDetails() {
    //     const { productDetails } = this.state
    //     if (Object.keys(productDetails).length === 0 && productDetails.constructor === Object) {
    //         return null
    //     }
    //     const { name, discription, price, productSizes, productColors, discount } = productDetails
    //     let discountedPrice = (price - price * (discount / 100)).toFixed(0)
    //     console.log('Product Details', name, discription)
    //     return (
    //         <View style={{ flex: 1, flexDirection: 'column-reverse', margin: '5%', marginBottom: 0 }}>

    //             <View style={{ ...styles.bottomContainerView }}>
    //                 <ProductSizeList
    //                     data={productSizes}
    //                 />
    //                 <ProductColorList
    //                     data={productColors}
    //                 />
    //             </View>
    //             <View style={{ ...styles.descriptionView }}>
    //                 <Text style={{ ...styles.descriptionText, fontFamily: Constants.BOLD_FONT_FAMILY, marginTop: '2%', fontSize: 16 }}>
    //                     Rs. {discountedPrice}
    //                 </Text>
    //                 <Text style={{ ...styles.descriptionText }}>
    //                     {discription}
    //                 </Text>
    //                 <Text style={{ ...styles.descriptionText, fontFamily: Constants.BOLD_FONT_FAMILY }}>
    //                     {name.toUpperCase()}
    //                 </Text>
    //             </View>
    //         </View>
    //     )
    // }
}

const styles = StyleSheet.create({
    backgroundImage: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    descriptionText: {
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: 'white'
    },
    descriptionView: {
        flex: 8,
        flexDirection: 'column-reverse'
    },
    bottomContainerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '2%',
        height: 40,
    },
    itemDetails: {
        fontSize: 12,
        color: "#5E7A90",
        textAlign: 'center',
        fontFamily: Constants.LIST_FONT_FAMILY,
        maxWidth: '65%'
    },
    itemText: {
        fontSize: 12,
        color: "#5E7A90",
        fontFamily: Constants.BOLD_FONT_FAMILY,
        textTransform: 'uppercase'
    },
    itemSubText: {
        fontSize: 10,
        color: "#5E7A90",
        fontFamily: Constants.LIST_FONT_FAMILY,
    },
    priceInfoContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12
    },
    priceDefault: {
        fontSize: 10,
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: "#5E7A90",
    },
    price: {
        fontFamily: Constants.BOLD_FONT_FAMILY,
    },
    strikePrice: {
        paddingHorizontal: 6,
        textDecorationLine: 'line-through'
    },
    discountPercent: {
        color: Constants.DOBO_RED_COLOR,
    },
    infoContent: {
        fontFamily: Constants.LIST_FONT_FAMILY,
        color: "#5E7A90",
        fontSize: 10
    },
    addToBagBtn: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        padding: 12,
        margin: 0,
        backgroundColor: Constants.DOBO_RED_COLOR
    },
    headContainer: {
        position: 'absolute',
        padding: 8,
        paddingRight: 16,
        backgroundColor: 'white',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row',
        zIndex: 10
    },
    modal: {
        flex: 0.7,
        borderColor: '#fff',
        backgroundColor: "#fff",
        borderTopColor: Constants.DOBO_RED_COLOR,
        borderTopWidth: 4,
        padding: 8
    },
    disabledBtn: {
        opacity: 0.5,
    },
    rightContainer: {
        flexDirection: 'row',
        paddingRight: 4
    },
    callIcon: {
        paddingHorizontal: 12
    },
    wishlist: {
        justifyContent: 'center',
        marginHorizontal: '3%'

    },
    share: {
        justifyContent: 'center',
        marginHorizontal: '3%'
    }
})

const mapStateToProps = state => ({
    isLikeStateChanged: state.like.isStateChanged,
});

const ActionCreators = Object.assign(
    {},
    likeActions

);
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(StorePageDetails);