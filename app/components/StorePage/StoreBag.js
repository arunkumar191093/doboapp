import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import NavHeader from '../Common/NavHeader';
import CartBag from '../Common/CartBag';
import * as Constants from '../../services/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SplitButtons from '../Common/SplitButtons';
import SlideModalPopUp from '../Common/SlideModalPopUp';
import Loader from '../Common/Loader';
import AddUpdateAddress from '../Common/AddUpdateAddress';
import FlashMessage from '../Common/FlashMessage';
import ProductOptions from './ProductOptions';
import {
  updateCartItemInStorage,
  getCartItemsFromStorage,
  getAllProductByBagId,
  getBagDetails,
  addUpdateProductToBag,
  removeProductFromBag,
  submitBag,
  removeBagFromStore
} from '../../services/StoreBag';
import { getUserAddresses } from '../../services/UserActions';
import { NavigationEvents } from 'react-navigation';
import { STATUS_ENUM } from '../../services/Constants';

const PriceInfo = ({
  heading = '',
  value = '',
  prependValue = '',
  color = '#31546E',
}) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
      <Text style={[styles.defaultTextHeading, { color: color }]}>{heading}</Text>
      <View style={{ flexDirection: 'row' }}>
        {
          !!prependValue &&
          <Text style={[styles.defaultTextHeading, { color: color }]}>{prependValue} </Text>
        }
        <Text style={[styles.defaultTextHeading, { color: color, fontFamily: Constants.SEMI_BOLD_FONT_FAMILY, fontWeight: 'bold' }]}>{value}</Text>
      </View>
    </View>
  )
}

//component to render each cart item
const CartItem = ({
  isDisabled = false,
  itemInfo = {},
  storeData = {},
  canDelete = true,
  onDeleteItem = () => { },
  handleSpecificationClick = () => { }
}) => {
  const { quantity, selectedSize, selectedColor, isNotAvailable } = itemInfo.baggedProduct;
  const { price, discount, name, media, brand } = itemInfo.baggedProduct.product;
  let totalPrice = (price * quantity)
  // let discountedPrice = (totalPrice - totalPrice * (discount / 100)).toFixed(2);
  let discountedPrice = itemInfo.priceWithDiscount.toFixed(2);

  return (
    <View style={[styles.cartItemContainer, isNotAvailable ? styles.disabledCartItem : null]}>
      <Image style={styles.itemImage}
        source={{ uri: Constants.imageResBaseUrl + media }} />
      <View style={styles.itemContent}>
        <View style={styles.headContent}>
          <View>
            <Text style={styles.itemText} numberOfLines={2}>{name} ahjgsdhjag sdgsdjhga js</Text>
            {!!brand && <Text style={styles.itemSubText}>{brand.name}</Text>}
          </View>
          {
            canDelete &&
            <TouchableOpacity style={styles.closeBtn} onPress={!isNotAvailable ? () => onDeleteItem(itemInfo) : null}>
              <Icon
                name='close-circle'
                color={Constants.DOBO_RED_COLOR}
                size={24}
              />
            </TouchableOpacity>
          }

        </View>
        <TouchableOpacity style={styles.itemSpecifications} onPress={!isNotAvailable && !isDisabled ? handleSpecificationClick : null}>
          <View style={styles.squareBox}>
            <Text style={styles.squareBoxHeading}>QTY</Text>
            <Text style={styles.squareBoxSubHeading}>{quantity}</Text>
          </View>
          <View style={styles.squareBox}>
            <Text style={styles.squareBoxHeading}>SIZE</Text>
            <Text style={styles.squareBoxSubHeading}>{selectedSize.dimensions}</Text>
          </View>
          <View style={styles.squareBox}>
            <Text style={styles.squareBoxHeading}>COLOR</Text>
            <Text style={{
              borderRadius: 2,
              width: 12,
              height: 12,
              marginTop: 2,
              alignSelf: 'center',
              textAlign: 'center',
              borderWidth: 0.4,
              backgroundColor: selectedColor.colorCode.toLowerCase()
            }}>{''}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.priceInfoContainer}>
          <Text style={[styles.priceDefault, styles.price]}>Rs. {discountedPrice}</Text>
          <Text style={[styles.priceDefault, styles.strikePrice]}>Rs. {totalPrice.toFixed(2)}</Text>
          {
            discount ?
              <Text style={[styles.priceDefault, styles.discountPercent]}>({discount}% OFF)</Text> : null
          }
        </View>
      </View>
    </View >
  )
}


const StoreBag = ({ navigation }) => {

  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [discountValue, setDiscountValue] = useState(0);
  const [renderOptions, setRenderOptions] = useState(false);
  const [renderAddress, setRenderAddress] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showFlashMessage, setShowFlashMessage] = useState(false);
  const [disableBottomBtns, setDisableBottomBtns] = useState(false);
  // const [bagStatus, setBagStatus] = useState('Not Available');
  // const [bagStatus, setBagStatus] = useState('Pending Confirmation');
  const [bagStatus, setBagStatus] = useState('');
  const [bagStatusTime, setBagStatusTime] = useState(0);
  const [screenHeightDiff, setScreenHeightDiff] = useState(150);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [isNewAddress, setIsNewAddress] = useState(true);


  useEffect(() => {
    if (bagStatus) {
      setScreenHeightDiff(180);
      bagStatus == 'Not Available' || bagStatus == 'Pending Confirmation' ? setDisableBottomBtns(true) : null;
    }
  }, [bagStatus])

  const [cartItems, setCartItems] = useState([]);
  const storeData = navigation.getParam('storeInfo');
  const bagId = navigation.getParam('bagId');

  // useEffect(() => {
  //   // checkPresenceInCart();
  //   getBagInfo()
  //   getItemsInBag();
  // }, []);

  // useEffect(() => {
  //   getBagInfo()
  //   getItemsInBag();
  // }, [bagId]);

  useEffect(() => {
    if (renderAddress) {
      getAddresses()
    }
  }, [renderAddress]);

  const getBagInfo = async (isAfterDelete) => {
    setLoading(true);
    const response = await getBagDetails(bagId);
    if (response.status == 200) {
      console.log('getBagInfo', response)
      let { bag: bagDetails } = response.responseJson
      if (bagDetails) {
        setBagStatus(STATUS_ENUM[bagDetails.status])
        setTotalItems(response.responseJson.countOfBaggedProducts);
        setTotalPrice(response.responseJson.finalPrice)
        setSubTotal(response.responseJson.totalPrice);
        setDiscountValue(response.responseJson.totalDiscount);
      }
    }
    // else if (!isAfterDelete) {
    //   alert('Something went wrong while fetching your info. Please try again later.')
    // }
    setLoading(false);
  }

  const getItemsInBag = async (isAfterDelete) => {
    setLoading(true);
    const response = await getAllProductByBagId(bagId);
    if (response.status == 200) {
      console.log('getItemsInBag', response)
      setCartItems(response.responseJson.baggedProducts);
      setTotalPrice(response.responseJson.finalPrice);
      if (response.responseJson && !response.responseJson.finalPrice) {
        calculateTotalPriceDetails(response.responseJson.baggedProducts) //calculating price for view details popup
      }
    }
    // else if (!isAfterDelete) {
    //   alert('Something went wrong while fetching your bag items. Please try again later.')
    // }
    setLoading(false);
  }

  const getAddresses = async () => {
    const response = await getUserAddresses()
    if (response.status === 200) {
      let addressArr = response.responseJson;
      setUserAddresses(addressArr);
      console.log('addresses', response)
      if (addressArr.length) {
        addressArr.some((add) => {
          if (add.isDefault) {
            setSelectedAddress(add);
            return true;
          }
        })

      }
    } else {
      console.log('addressess err', response)
    }
  }


  const backPressHandler = () => {
    navigation.navigate('StorePage', { listVal: storeData })
  }

  const checkPresenceInCart = async () => {
    if (storeData && storeData.id) {
      const cartData = await getCartItemsFromStorage(storeData.id);
      if (cartData.cartItems && cartData.cartItems.length) {
        setCartItems(cartData.cartItems);
        setLoading(false);
        calculateTotalPriceDetails(cartData.cartItems); //calculating price for view details popup
      }
      else {
        setLoading(false);
      }
    }
  }

  const calculateTotalPriceDetails = (items) => {
    let totalQty = 0,
      totalPrice = 0,
      discountPrice = 0;
    items.forEach(item => {
      let { baggedProduct: { quantity, product: { price, discount }, isNotAvailable } } = item;
      if (!isNotAvailable) {
        totalQty += quantity;
        totalPrice += (quantity * price);
        discountPrice += (quantity * price * discount / 100);
      }
    });
    setTotalItems(totalQty);
    setSubTotal(totalPrice.toFixed(2));
    setDiscountValue(discountPrice.toFixed(2));
  }

  const handleSelection = (product) => {
    const { baggedProduct: { product: productInfo }, priceWithDiscount, baggedProduct } = product;
    setSelectedProduct({ ...productInfo, priceWithDiscount, ...baggedProduct });
    setRenderOptions(true);
  }

  const handleDeleteProduct = async (baggedProductDetails) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete?',
      [
        {
          text: 'Yes', onPress: async () => {
            setLoading(true);
            const { baggedProduct: { bagId, id: productId } } = baggedProductDetails;
            const response = await removeProductFromBag(storeData.id, bagId, productId)
            if (response.status == 204) {
              getBagInfo(true); //TODO: uncomment if info about bag is needed
              getItemsInBag(true);
            }
            else {
              alert('Something went wrong while deleting your bag item. Please try again.')
            }
            setLoading(false);
          }
        },
        { text: 'No', onPress: () => { } }
      ],
      { cancelable: true });
  }


  const handleOptionUpdate = async (productData) => {
    setLoading(true);
    // await updateCartItemInStorage(storeData.id, productData);
    let req = {
      "ProductId": productData.id, //this ID is the baggedProduct Id not the product that is inside bagged product object
      "SelectedSizeId": productData.selectedSizeId,
      "SelectedColorId": productData.selectedColorId,
      "Quantity": productData.quantity
    }
    console.log('productData', productData)
    const response = await addUpdateProductToBag(storeData.id, req, true, productData.bagId);
    if (response.status == 200) {
      setRenderOptions(false);
      getBagInfo();
      getItemsInBag();
    }
    else {
      alert('Something went wrong while updating your bag item. Please try again.')
    }
    setLoading(false);
    // checkPresenceInCart();
  }

  //handle close of add or update or select address pop-up
  const handleAddUpdateAddressClose = () => {
    getAddresses();
    setShowAddressForm(false);
  }

  // this modal pop-up is used when user tries to update product qty,color,size
  const renderProductOptionsModal = () => {

    console.log('selectedProduct', selectedProduct)
    const disabled = !selectedProduct.selectedSize.dimensions || !selectedProduct.selectedColor.colorCode || !selectedProduct.quantity;

    const handleOptionSelect = (type, item) => {
      console.log('handleOptionSelect', item)
      switch (type) {
        case 'size':
          selectedProduct.selectedSize = item.size;
          selectedProduct.selectedSizeId = item.sizeId;
          break;
        case 'color':
          selectedProduct.selectedColor = item.color;
          selectedProduct.selectedColorId = item.colorId;
          break;
        case 'qty':
          selectedProduct.quantity = item;
          break;
      }
      setSelectedProduct({ ...selectedProduct });
    }

    return (
      <SlideModalPopUp handleClose={() => setRenderOptions(false)}>
        <ProductOptions productSizes={selectedProduct.productSizes} selectedSize={selectedProduct.selectedSize.dimensions}
          productColors={selectedProduct.productColors} selectedColor={selectedProduct.selectedColor.colorCode}
          productQty={[1, 2, 3, 4, 5]} selectedQty={selectedProduct.quantity}
          onSizeSelect={(item) => handleOptionSelect('size', item)}
          onColorSelect={(item) => handleOptionSelect('color', item)}
          onQtySelect={(item) => handleOptionSelect('qty', item)}
        />
        <TouchableOpacity style={[
          { ...styles.addToBagBtn, width: '105%' },
          disabled ? styles.disabledBtn : null]} onPress={() => handleOptionUpdate(selectedProduct)} disabled={disabled}>
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY }}>Done</Text>
        </TouchableOpacity>
      </SlideModalPopUp>
    )
  }

  // this pop-up shows the selected address and pincode info
  const renderAddressModal = () => {

    console.log('selectedAddress', selectedAddress)
    const disabled = !selectedAddress.address1 && !selectedAddress.city && !selectedAddress.state && !selectedAddress.zipCode;

    let addressStr = selectedAddress.address1 && selectedAddress.city && selectedAddress.state ?
      `${selectedAddress.address1} ${selectedAddress.address2}, ${selectedAddress.city} ${selectedAddress.state}` : ''

    const handleAddressSubmit = async () => {
      setLoading(true);
      let addressId = selectedAddress.id;
      const response = await submitBag(bagId, addressId);
      console.log('address submitted', response)
      if (response.status == 200) {
        setRenderAddress(false);
        setShowFlashMessage(true);
        getBagInfo();
        getItemsInBag();
      }
      setLoading(false);
    }

    const handleAddressChange = () => {
      setShowAddressForm(true);
    }


    return (
      <SlideModalPopUp handleClose={() => setRenderAddress(false)}>
        <View style={{ padding: 16 }}>
          <Text style={[styles.defaultTextHeading, { fontSize: 16, fontWeight: 'bold' }]}>Delivery Address</Text>

          {/* <View style={{ ...styles.addressRow, marginTop: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.defaultTextHeading, styles.addressHeading]}>YOUR PINCODE</Text>
              <TouchableOpacity onPress={handleAddressChange}>
                <Text style={[styles.defaultTextHeading, styles.addressBtnTxt]}>{disabled ? 'ADD' : 'CHANGE'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.defaultTextHeading, styles.addressValue]}>
              {selectedAddress.zipCode || '(Required for delivery)'}
            </Text>
          </View> */}

          <View style={[styles.addressRow, { marginTop: 20 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.defaultTextHeading, styles.addressHeading]}>YOUR ADDRESS</Text>
              <TouchableOpacity onPress={handleAddressChange}>
                <Text style={[styles.defaultTextHeading, styles.addressBtnTxt]}>{disabled ? 'ADD' : 'CHANGE'}</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.defaultTextHeading, styles.addressValue]} numberOfLines={3}>
              {addressStr || '(Required for delivery)'}
            </Text>
            <Text style={[styles.defaultTextHeading, styles.addressValue]} numberOfLines={3}>
              PINCODE - {selectedAddress.zipCode || '(Required for delivery)'}
            </Text>
          </View>

        </View>
        <TouchableOpacity style={[
          { ...styles.addToBagBtn, width: '105%' },
          disabled ? styles.disabledBtn : null]} onPress={() => handleAddressSubmit()} disabled={disabled}>
          <Text style={{ color: 'white', textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY }}>CONTINUE</Text>
        </TouchableOpacity>
      </SlideModalPopUp>
    )
  }

  const goToAllBags = () => {
    navigation.navigate('AllBags')
  }

  const onPageFocus = () => {
    console.log('bag focused');
    getBagInfo(); //TODO: uncomment if info about bag is needed
    getItemsInBag();
  }

  const handleDeleteBag = async () => {
    Alert.alert(
      'Delete Bag',
      'Are you sure you want to delete?',
      [
        {
          text: 'Yes', onPress: async () => {
            setLoading(true);
            const response = await removeBagFromStore(bagId)
            if (response.status == 200) {
              getBagInfo(); //TODO: uncomment if info about bag is needed
              getItemsInBag();
              setBagStatus('');
            }
            else {
              alert('Something went wrong while deleting your bag. Please try again.')
            }
            setLoading(false);
          }
        },
        { text: 'No', onPress: () => { } }
      ],
      { cancelable: true });

  }

  const goToPayment = () => {
    navigation.navigate('PayNowSummary', { storeInfo: storeData, bagId: bagId })
  }


  //main render 
  return (
    <View>
      <Loader
        loading={loading}
      />
      <NavigationEvents
        onDidFocus={onPageFocus}
      />
      <NavHeader backPressHandler={backPressHandler} heading={bagStatus ? "My Submitted Bag" : "My Happy Bag"}>
        <TouchableOpacity onPress={() => goToAllBags()}>
          <Text style={{
            fontFamily: Constants.BOLD_FONT_FAMILY,
            color: Constants.DOBO_RED_COLOR,
            fontSize: 10,
            textAlignVertical: 'center',
            padding: 4
          }}>VIEW ALL BAGS</Text>
        </TouchableOpacity>
      </NavHeader>
      <View style={styles.storeInfoContainer}>

        <View style={styles.listRow}>
          <Image style={styles.listImage}
            source={{ uri: Constants.imageResBaseUrl + storeData.retailer.iconURL || Constants.DEFAULT_STORE_ICON }} />
          <View style={styles.rowText}>
            <Text
              style={styles.listNameText}>
              {storeData.description.trim()}
            </Text>
            <Text numberOfLines={3}
              style={styles.listAddressText}>
              {(storeData.address.address1 || '') + '\n' + (storeData.address.address2 || '')}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', alignSelf: 'center', paddingRight: 8 }}>
            <CartBag count={totalItems} />
            {
              !!bagStatus &&
              <TouchableOpacity onPress={handleDeleteBag}>
                <Text style={{
                  fontFamily: Constants.BOLD_FONT_FAMILY,
                  color: Constants.DOBO_RED_COLOR,
                  fontSize: 10,
                  textAlignVertical: 'center',
                  marginTop: 8,
                }}>DELETE BAG</Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>

      {
        !!bagStatus &&
        <View style={[
          styles.statusContainer,
          bagStatus == 'Pending Confirmation' ? styles.pendingStatus :
            bagStatus == 'Not Available' ? styles.errorStatus : null
        ]}>
          <Text style={styles.status}>{bagStatus}</Text>
          {!!bagStatusTime && <Text style={styles.statusTime}>{bagStatusTime} min ago</Text>}
        </View>
      }


      <View style={{ height: Constants.SCREEN_HEIGHT - screenHeightDiff, paddingBottom: 40 }}>
        {
          cartItems.length ?
            <FlatList
              data={cartItems}
              renderItem={({ item }) => <CartItem
                storeData={storeData}
                itemInfo={item}
                canDelete={!bagStatus}
                isDisabled={bagStatus != ''} //TODO: remove this once API is ready
                handleSpecificationClick={() => handleSelection(item)}
                onDeleteItem={handleDeleteProduct} />}
              keyExtractor={item => item.baggedProduct.id.toString()}
            >
            </FlatList> :
            <Text style={styles.emptyBagMsg}>
              Your bag is empty!
        </Text>
        }

      </View>

      <View style={styles.bottomBtns}>
        <SplitButtons
          leftBtnName={bagStatus ? "PAY NOW" : "SUBMIT BAG"}
          amount={totalPrice}
          onLeftPress={() => bagStatus ? goToPayment() : setRenderAddress(true)}
          onRightPress={() => setShowPriceDetails(!showPriceDetails)}
          showDetails={showPriceDetails}
          isDisabled={!cartItems.length || disableBottomBtns}
        />
      </View>

      {showPriceDetails &&
        <SlideModalPopUp handleClose={() => setShowPriceDetails(false)} childrenStyle={{ flex: 0.35 }}>
          <View style={{ padding: 12 }}>
            <PriceInfo heading="Total Items" value={totalItems.toFixed(0)} />
            <PriceInfo heading="Sub Total" value={subTotal.toFixed(2)} prependValue="Rs." />
            <PriceInfo heading="Discount" value={discountValue.toFixed(2)} prependValue="- Rs." color={Constants.DOBO_RED_COLOR} />
          </View>
          <View style={{ ...styles.bottomBtns, width: '105%' }}>
            <SplitButtons
              leftBtnName={bagStatus ? "PAY NOW" : "SUBMIT BAG"}
              amount={totalPrice}
              onLeftPress={() => bagStatus ? goToPayment() : setRenderAddress(true)}
              onRightPress={() => setShowPriceDetails(!showPriceDetails)}
              showDetails={showPriceDetails} />
          </View>
        </SlideModalPopUp>
      }

      {renderOptions && renderProductOptionsModal()}
      {renderAddress && renderAddressModal()}
      {showAddressForm && <AddUpdateAddress allAddresses={userAddresses} onClose={handleAddUpdateAddressClose} />}
      {showFlashMessage &&
        <FlashMessage heading={'Your bag has been submitted!'}
          content={'Please wait for store confirmation to make payment. It may take several minutes.'}
          timeOut={1500} onAnimateComplete={() => setShowFlashMessage(false)}
        />}
    </View>
  )
}

const styles = StyleSheet.create({
  storeInfoContainer: {
    paddingTop: 50,
    borderBottomColor: '#eaf0f2',
    borderBottomWidth: 1
  },
  listRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    paddingRight: 16
    //borderBottomColor: "black"
  },
  listImage: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
    // marginVertical: 8,
    // borderRadius: 10
  },
  rowText: {
    flexDirection: "column",
    flex: 2.5
  },
  listNameText: {
    // marginTop: 10,
    fontSize: 12,
    fontFamily: Constants.LIST_FONT_FAMILY,
    color: Constants.DOBO_GREY_COLOR
  },
  listAddressText: {
    marginTop: 5,
    fontSize: 10,
    fontFamily: Constants.LIST_FONT_FAMILY,
    color: Constants.BODY_TEXT_COLOR
  },
  priceInfoContainer: {
    flexDirection: 'row',
  },
  priceDefault: {
    fontSize: 12,
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
  cartItemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomColor: '#eaf0f2',
    borderBottomWidth: 1
  },
  itemContent: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 16
  },
  headContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 12
  },
  closeBtn: {
    // justifyContent: 'flex-end',
  },
  itemImage: {
    width: 90,
    height: 110,
    marginHorizontal: 8,
    borderWidth: 0,
    // resizeMode: 'stretch',
  },
  itemText: {
    fontSize: 12,
    color: "#5E7A90",
    fontFamily: Constants.BOLD_FONT_FAMILY,
    textTransform: 'uppercase'
  },
  itemSubText: {
    fontSize: 12,
    color: "#5E7A90",
    fontFamily: Constants.LIST_FONT_FAMILY,
  },
  itemSpecifications: {
    flexDirection: 'row'
  },
  squareBox: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 2,
    minWidth: 52,
    borderRadius: 4,
    marginRight: 4,
    marginVertical: 6
  },
  squareBoxHeading: {
    fontSize: 12,
    color: "#5E7A90",
    fontFamily: Constants.BOLD_FONT_FAMILY,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  squareBoxSubHeading: {
    fontSize: 12,
    color: "#5E7A90",
    fontFamily: Constants.LIST_FONT_FAMILY,
    textAlign: 'center'
  },
  bottomBtns: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    margin: 0
  },
  defaultTextHeading: {
    fontSize: 12,
    color: "#5E7A90",
    fontFamily: Constants.LIST_FONT_FAMILY,
  },
  addToBagBtn: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    padding: 12,
    margin: 0,
    backgroundColor: Constants.DOBO_RED_COLOR
  },
  disabledBtn: {
    opacity: 0.5,
  },
  emptyBagMsg: {
    fontSize: 20,
    color: "#5E7A90",
    fontFamily: Constants.BOLD_FONT_FAMILY,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 150
  },
  addressRow: {
    marginVertical: 8
  },
  addressHeading: {
    fontFamily: Constants.SEMI_BOLD_FONT_FAMILY,
    color: '#81A8BA'
  },
  addressValue: {
    fontFamily: Constants.SEMI_BOLD_FONT_FAMILY,
    color: '#3B5C75',
    paddingTop: 6
  },
  addressBtnTxt: {
    color: Constants.DOBO_RED_COLOR,
    fontWeight: 'bold'
  },
  statusContainer: {
    padding: 8,
    backgroundColor: '#C0FCD1',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center'
  },
  pendingStatus: {
    backgroundColor: '#FFE7AD'
  },
  errorStatus: {
    backgroundColor: '#FFEBEB'
  },
  status: {
    fontSize: 12,
    color: Constants.SEMI_BOLD_FONT_COLOR,
    fontFamily: Constants.LIST_FONT_FAMILY,
    paddingRight: 10
  },
  statusTime: {
    fontSize: 12,
    color: '#838383',
    fontFamily: Constants.LIST_FONT_FAMILY,
  },
  disabledCartItem: {
    opacity: 0.5,
    backgroundColor: '#f3f3f3'
  }
})

export default StoreBag;