import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import NavHeader from '../Common/NavHeader';
import CartBag from '../Common/CartBag';
import * as Constants from '../../services/Constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../Common/Loader';
import { getBagDetails, removeBagFromStore } from '../../services/StoreBag';

const statusEnum = {
  Submitted: 'Pending Confirmation',
  Confirmed: 'Confirmed',
  PartiallyConfirmed: 'Partially Confirmed',
  NotAvailable: 'Not Available',
  Rejected: 'Not Available',
  Delivered: 'Delivered',
  Returned: 'Returned',
}

const calculateTimeDifference = (newDate, oldDate) => {
  let diffTime = newDate - oldDate;
  let minutes = Math.floor(diffTime / (60 * 1000));
  if (minutes > 59) {
    var hours = Math.floor(minutes / 60);
    hours = (hours >= 10) ? hours : "0" + hours;
    minutes = minutes - (hours * 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
  }
  return isNaN(hours) || isNaN(minutes) ? '' : minutes > 59 ? `${hours} hr and ${minutes} min ago` : `${minutes} min ago`;
}

const BagItem = ({
  bagInfo = {},
  onDeleteBag = () => { },
  onReturn = () => { },
  handleBagPress = () => { },
  onBuyNow = () => { },
}) => {
  const { bag: { storeInfo, status, updatedAt } } = bagInfo;
  const bagStatus = statusEnum[status] || '';
  const disableBuy = !bagStatus ||bagStatus == 'Not Available' || bagStatus == 'Pending Confirmation' || bagStatus == 'Returned' || bagStatus == 'Delivered' ? true : false;
  let today = (new Date()).getTime();
  let updatedAtTime = (new Date(updatedAt.replace('T', ' ').substring(0, 16))).getTime();
  let timeAgo = calculateTimeDifference(today, updatedAtTime);
  let mediaURL = storeInfo.retailer && storeInfo.retailer.iconURL && storeInfo.retailer.iconURL.indexOf('http') > -1 ? storeInfo.retailer.iconURL : Constants.imageResBaseUrl + storeInfo.retailer.iconURL;
  let returnLastDate = new Date(updatedAt.substring(0, 10))
  returnLastDate.setDate(returnLastDate.getDate() + 10) // assuming 10days return period

  return (
    <TouchableOpacity style={styles.bagItemContainer} onPress={() => handleBagPress(bagInfo)}>

      <View style={styles.listRow}>
        <Image style={styles.listImage}
          source={{ uri: mediaURL || Constants.DEFAULT_STORE_ICON }} />
        <View style={styles.rowText}>
          <Text
            style={styles.listNameText}>
            {storeInfo.description.trim() || ''}
          </Text>
          <Text numberOfLines={3}
            style={styles.listAddressText}>
            {(storeInfo.address.address1 || '') + '\n' + (storeInfo.address.address2 || '')}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', alignSelf: 'center', paddingRight: 8 }}>
          <CartBag count={bagInfo.countOfBaggedProducts} onBadgePress={() => handleBagPress(bagInfo)} />
          <Text style={{
            fontFamily: Constants.BOLD_FONT_FAMILY,
            color: Constants.SEMI_BOLD_FONT_COLOR,
            fontSize: 10,
            textAlignVertical: 'center',
            marginTop: 8,
          }}>Rs. {bagInfo.finalPrice}</Text>
        </View>
      </View>

      <View style={styles.bagStatusRow}>
        <View style={styles.timer}>
          {/* <Text style={styles.timerTxt}>14 : 22</Text> */}
        </View>
        {
          !!bagStatus &&
          <View style={[styles.bagStatusContainer,
          bagStatus == 'Pending Confirmation' ? styles.pendingStatus :
            bagStatus == 'Not Available' ? styles.errorStatus : null]}>
            <Text style={styles.statusTxt}>{bagStatus}</Text>
          </View>
        }
        <Text style={styles.timerAgo}>{timeAgo ? timeAgo : ''}</Text>

      </View>

      <View style={styles.infoMsgContainer}>
        {
          bagStatus == 'Delivered' &&
          <Text style={styles.infoMsg}>Return may be possible through {returnLastDate.toDateString()}</Text>
        }
        {
          bagStatus != 'Delivered' &&
          <Text style={styles.infoMsg}>Payment will be enabled for 30 min after confirmation</Text>
        }
      </View>

      <View style={[styles.splitBtncontainer]}>
        {
          bagStatus == 'Delivered' &&
          <TouchableOpacity onPress={() => onReturn(bagInfo)} style={styles.leftBtn}>
            <Text style={[styles.splitBtnTxt, { color: Constants.DOBO_RED_COLOR }]}>REQUEST RETURN</Text>
          </TouchableOpacity>
        }
        {
          bagStatus != 'Delivered' &&
          <>
            <TouchableOpacity onPress={() => onDeleteBag(bagInfo)} style={styles.leftBtn}>
              <Text style={[styles.splitBtnTxt, { color: Constants.DOBO_RED_COLOR }]}>DELETE BAG</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onBuyNow(bagInfo)} style={[styles.rightBtn, disableBuy ? styles.disabledBtn : null]} disabled={disableBuy}>
              <Text style={styles.splitBtnTxt}>PAY NOW</Text>
            </TouchableOpacity>
          </>
        }
      </View >
    </TouchableOpacity>
  )
}


const AllBags = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [allBags, setAllBags] = useState([]);

  useEffect(() => {
    getAllBags();
  }, [])

  const getAllBags = async () => {
    setLoading(true);
    const response = await getBagDetails();
    if (response.status == 200) {
      console.log('getAllBags', response)
      setAllBags(response.responseJson);
    }
    else {
      alert('Something went wrong while fetching all bags. Please try again later.')
    }
    setLoading(false);
  }

  const handleDeleteBag = async (data) => {
    const { bag: { id: bagId } } = data;
    console.log('delete bag', data)
    Alert.alert(
      'Delete Bag',
      'Are you sure you want to delete?',
      [
        {
          text: 'Yes', onPress: async () => {
            setLoading(true);
            const response = await removeBagFromStore(bagId)
            console.log('after delete bag', response)
            if (response.status == 200) {
              getAllBags()
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

  const handleBuyBag = (data) => {
    console.log('buy bag', data)
    const { bag: { id, storeInfo } } = data;
    navigation.navigate('PayNowSummary', { storeInfo: storeInfo, bagId: id })
    // navigation.navigate('RequestReturn') //TODO: remove this, just used for bypassing steps
  }

  const handleGoToBag = (data) => {
    const { bag: { id: bagId, storeInfo } } = data;
    console.log('go to individual bag', data + '' + bagId, storeInfo)
    navigation.navigate('StoreBag', { storeInfo: storeInfo, bagId: bagId });
  }


  return (
    <View>
      <Loader
        loading={loading}
      />
      <NavHeader backPressHandler={() => navigation.goBack()} heading={"My Happy Bags"}>
      </NavHeader>
      <View style={styles.bagsListContainer}>
        {
          allBags.length ?
            <FlatList
              data={allBags}
              renderItem={({ item }) => <BagItem
                bagInfo={item}
                onDeleteBag={handleDeleteBag}
                onReturn={handleGoToBag}
                handleBagPress={handleGoToBag}
                onBuyNow={handleBuyBag}
              />}
              keyExtractor={item => item.bag.id.toString()}
            >
            </FlatList> :
            <Text style={styles.emptyBagMsg}>
              No Bags found!
            </Text>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bagsListContainer: {
    padding: 12,
    paddingTop: 40,
    paddingBottom: 0,
    backgroundColor: '#C2D5DE',
    height: '100%'
  },
  bagItemContainer: {
    marginTop: 12,
    backgroundColor: '#fff'
  },
  infoMsgContainer: {
    padding: 4,
    backgroundColor: '#FFEBEB'
  },
  infoMsg: {
    fontSize: 9,
    color: '#F64658',
    textAlign: 'center'
  },
  listRow: {
    flexDirection: "row",
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    paddingRight: 16,
  },
  listImage: {
    width: 50,
    height: 50,
    marginRight: 10,
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
  splitBtncontainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  leftBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F2F2F2'
  },
  rightBtn: {
    flex: 1,
    backgroundColor: Constants.DOBO_RED_COLOR,
    padding: 12,
  },
  splitBtnTxt: {
    fontFamily: Constants.LIST_FONT_FAMILY,
    textAlign: 'center',
    color: '#fff',
    fontSize: 12
  },
  disabledBtn: {
    opacity: 0.6
  },
  bagStatusRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingBottom: 12
  },
  timer: {
    paddingLeft: 12,
    minWidth: 70,
    justifyContent: 'center'
  },
  timerTxt: {
    color: Constants.DOBO_RED_COLOR,
    fontSize: 12,
    fontFamily: Constants.LIST_FONT_FAMILY,
  },
  bagStatusContainer: {
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#C0FCD1',
    textAlign: 'center',
    justifyContent: 'center'
  },
  statusTxt: {
    color: '#31546E',
    fontSize: 10,
    fontFamily: Constants.LIST_FONT_FAMILY
  },
  pendingStatus: {
    backgroundColor: '#FFE7AD'
  },
  errorStatus: {
    backgroundColor: '#FFEBEB'
  },
  timerAgo: {
    color: '#838383',
    fontSize: 10,
    fontFamily: Constants.LIST_FONT_FAMILY,
    textAlign: 'center',
    alignSelf: 'center',
    marginLeft: 10
  },
  emptyBagMsg: {
    fontSize: 20,
    color: "#5E7A90",
    fontFamily: Constants.BOLD_FONT_FAMILY,
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingVertical: 150
  }
})

export default AllBags;