import React, { PureComponent, useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity
}
  from 'react-native';
import * as Constants from '../../services/Constants';
import IconComponent from '../Common/IconComponent';
import Loader from '../Common/Loader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { ImageConst } from '../../services/ImageConstants';
import moment from 'moment';
import ModalPopUp from '../Common/ModalPopUp';
import RatingResponses from './RatingResponses';
import { getCheckinsByStoreId } from '../../services/ProfileListApi';

const CheckinItem = ({
  details = {},
  onItemClick = () => { }
}) => {
  const { storeCheckIn, review } = details;
  let responseCount = review && review.replies.length ? `(${review.replies.length + (review.reviewText ? 1 : 0)})` : review && review.reviewText ? '(1)' : ''
  return (
    <TouchableOpacity style={styles.checkinInfoContainer} onPress={onItemClick}>
      <View style={styles.checkinMarker}>
        <EvilIcons name='location' size={40} color={Constants.DOBO_RED_COLOR} />
      </View>
      <View style={styles.checkinItemInfo}>
        <Text style={styles.checkinInfoHeading}>Check-in on</Text>
        <Text style={styles.checkinInfoTime}>{moment(storeCheckIn.checkInTime).format('D MMM YYYY, hh:mm a')}</Text>
        {
          !!review ?
            <View style={styles.checkinDetailRow}>
              <View style={{ ...styles.roundCornerView }}>
                <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                  <Text style={{
                    fontSize: 10,
                    fontFamily: Constants.LIST_FONT_FAMILY,
                    color: '#31546E',
                  }}>
                    {review.avgRating.toFixed(1)}
                  </Text>
                  <IconComponent
                    style={{ marginLeft: 4, }}
                    name={ImageConst["star-rating"]}
                    size={12} />

                </View>
              </View>
              <View style={{ ...styles.roundCornerView, marginStart: '2%', flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name='comment-text-multiple' size={12} color="#5E7A90" />
                <Text style={styles.checkinDetailText}>
                  Reviews & Responses {responseCount}
                </Text>
              </View>
            </View>
            :
            <View style={styles.checkinDetailRow}>
              <View style={{ ...styles.roundCornerView, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ ...styles.checkinDetailText, color: Constants.DOBO_RED_COLOR }}>
                  Add your Rating & Reviews
            </Text>
              </View>
            </View>
        }
      </View>
    </TouchableOpacity>
  )
}

const MyCheckinDetails = ({ navigation }) => {
  const [storeDetails, setStoreDetails] = useState(navigation.getParam('storeData') || {});
  const [address, setAddress] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [storeCheckins, setStoreCheckins] = useState([]);
  const [showRatingResponse, setShowRatingResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewDetails, setReviewDetails] = useState({});
  const [aggRating, setAggRating] = useState('5.0');


  useEffect(() => {
    setLoading(true);
    setAggRating(storeDetails.aggStoreRating)
    getCheckinDetailsOfStore(storeDetails.storeId);
    setAddress(((storeDetails.storeAddress && storeDetails.storeAddress.address1) || '') + ((storeDetails.storeAddress && storeDetails.storeAddress.address2) || ''))
    setImageURL(storeDetails.iconURL !== null ? (Constants.imageResBaseUrl + storeDetails.iconURL) : Constants.DEFAULT_STORE_ICON)
  }, [storeDetails])

  const getCheckinDetailsOfStore = async (storeId) => {
    setLoading(true);
    let response = await getCheckinsByStoreId(storeId);
    setLoading(false);
    if (response.status == 200) {
      const responseData = JSON.parse(response.responseJson);
      const { checkInToReview } = responseData;
      setStoreCheckins(checkInToReview);
      console.log('response', responseData)
    }
  }

  const renderRatingResponses = (data) => {
    console.log('renderRatingResponses', data)
    setReviewDetails(data)
    setShowRatingResponse(true)
  }

  const handleClose = () => {
    setShowRatingResponse(false)
    getCheckinDetailsOfStore(storeDetails.storeId);
  }

  return (
    <View style={styles.detailsContainer}>
      <Loader
        loading={loading}
      />
      <View style={styles.storeDetailsWrapper}>
        <View style={styles.listRow}>
          {
            !!imageURL &&
            <Image style={styles.listImage}
              source={{ uri: imageURL }} />
          }
          <View style={styles.rowText}>
            <View>
              {
                !!storeDetails.storeDescription &&
                <Text numberOfLines={2}
                  style={styles.listNameText}>
                  {storeDetails.storeDescription.trim()}
                </Text>
              }

            </View>
            <View>
              <Text numberOfLines={3}
                style={styles.listAddressText}>
                {address}
              </Text>
            </View>
          </View>
          <View style={{ flex: 0.3, flexDirection: 'row', marginTop: '3%', alignSelf: 'flex-start' }}>
            <Text style={{
              fontSize: Constants.LIST_FONT_SIZE_ADDRESS,
              fontFamily: Constants.LIST_FONT_FAMILY,
              color: Constants.DOBO_GREY_COLOR,
            }}>
              {aggRating}
            </Text>
            <IconComponent
              style={{ marginHorizontal: '5%', }}
              name={ImageConst["star-rating"]}
              size={12} />

          </View>
        </View>
      </View>

      <View>
        <FlatList
          contentContainerStyle={styles.checkinitemsList}
          data={storeCheckins}
          renderItem={({ item }) => <CheckinItem details={item} onItemClick={() => renderRatingResponses(item)} />}
          keyExtractor={(item) => item.storeCheckIn.id.toString()}
        >
        </FlatList>
      </View>

      {
        showRatingResponse &&
        <ModalPopUp canClose={true} onClose={handleClose}>
          <RatingResponses storeDetails={storeDetails} reviewDetails={reviewDetails} onRatingSubmit={handleClose} />
        </ModalPopUp>
      }

    </View>
  )
}

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1
  },
  storeDetailsWrapper: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#dadada',
    paddingBottom: 4,
  },
  listRow: {
    flexDirection: "row",
  },
  checkinDetailRow: {
    flexDirection: "row",
    paddingVertical: '2%',
  },
  listImage: {
    width: 60,
    height: 60,
    margin: 10,
    // borderRadius: 10
  },
  rowText: {
    flexDirection: "column",
    flex: 1,
    marginTop: 10,
    paddingBottom: 10,
    justifyContent: 'space-between'
  },
  listNameText: {
    fontSize: Constants.LIST_FONT_HEADER_SIZE,
    fontFamily: Constants.LIST_FONT_FAMILY,
    color: Constants.DOBO_GREY_COLOR
  },
  listAddressText: {
    fontSize: 10,
    color: Constants.BODY_TEXT_COLOR,
    fontFamily: Constants.LIST_FONT_FAMILY,
  },
  roundCornerView: {
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F7EEED',
    justifyContent: 'center',
    paddingHorizontal: '5%'
  },
  checkinDetailText: {
    fontSize: 10,
    fontFamily: Constants.LIST_FONT_FAMILY,
    color: '#31546E',
    paddingLeft: 4
  },
  boldCheckinDetailsText: {
    fontSize: 10,
    color: Constants.BODY_TEXT_COLOR,
    fontFamily: Constants.BOLD_FONT_FAMILY
  },
  checkinInfoContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dadada',
    paddingBottom: 4,
  },
  checkinMarker: {
    width: 70,
    height: 70
  },
  checkinitemsList: {
    paddingBottom: 100
  },
  checkinInfoHeading: {
    fontFamily: Constants.LIST_FONT_FAMILY,
    color: Constants.DOBO_GREY_COLOR,
    fontSize: 12
  },
  checkinInfoTime: {
    color: '#31546E',
    fontSize: 12,
    fontFamily: Constants.SEMI_BOLD_FONT_FAMILY
  }

});

export default MyCheckinDetails;