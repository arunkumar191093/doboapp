import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import * as Constants from '../../services/Constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, BorderlessButton } from 'react-native-gesture-handler';
import { PostReviewRatings } from '../../services/Api';
import Loader from '../Common/Loader';

const Stars = ({
  heading,
  defaultSelected = 0,
  maxRating = 5,
  onSelectStar = () => { }
}) => {
  const [ratingStars, setRatingStars] = useState([]);

  useEffect(() => {
    let ratingStarsArr = [];
    for (let i = 1;i <= maxRating;i++) {
      ratingStarsArr.push(
        <TouchableOpacity key={i} onPress={() => onSelectStar(i)} style={styles.star}>
          <Icon
            name={i <= defaultSelected ? 'star' : 'star-outline'}
            color={i <= defaultSelected ? '#ffc106' : '#5E7A90'}
            size={24}
          />
        </TouchableOpacity>
      )
    }
    setRatingStars(ratingStarsArr);
  }, [defaultSelected])
  return (
    <View style={styles.starContainer}>
      {
        heading ?
          <Text style={styles.ratingHeading}>
            {heading}
          </Text> : null
      }
      <View style={styles.centerAlignRow}>
        {ratingStars}
      </View>
    </View>
  );
}

const RatingsPage = ({
  storeDetails = {},
  checkinDetails = {},
  defaultRating = 0,
  onRatingSubmit = () => { }
}) => {
  const [purchaseExpRating, setPurchaseExpRating] = useState(defaultRating);
  const [productQualityRating, setProductQualityRating] = useState(defaultRating);
  const [storeStaffSupportRating, setStoreStaffSupportRating] = useState(defaultRating);
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { retailer, address, description } = storeDetails;
  let imageURL = retailer != null ? (Constants.imageResBaseUrl + retailer.iconURL) : Constants.DEFAULT_STORE_ICON;
  let isDisabled = !purchaseExpRating || !productQualityRating || !storeStaffSupportRating;

  const handleRatingSubmit = async () => {
    setIsLoading(true);
    let request = {
      storeId: storeDetails.storeId,
      storeCheckInId: checkinDetails.id,
      purchaseExpRating: purchaseExpRating,
      productQualityRating: productQualityRating,
      storeStaffSupportRating: storeStaffSupportRating,
      reviewHeader: "",
      reviewText: comments ? comments : ""
    }
    let ratingResponse = await PostReviewRatings(request);
    console.log('ratingResponse', ratingResponse);
    setIsLoading(false);
    if (ratingResponse.status == 200) {
      await AsyncStorage.removeItem('storeCheckInData');
      onRatingSubmit();
    }
    else {
      alert('Something went wrong. Please try again')
    }
  }
  return (

    <View style={styles.ratingsContainer}>
      <Loader
        loading={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 22, color: Constants.DOBO_RED_COLOR, alignSelf: 'center', fontFamily: Constants.BOLD_FONT_FAMILY }}>Check-out</Text>
        <Text style={{ fontSize: 16, color: "#5E7A90", textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY, paddingVertical: 4, marginBottom: '8%' }}>
          Rate your experience
        </Text>
        <View style={styles.storeInfoContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Image style={styles.listImage}
              source={{ uri: imageURL }} />
            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 16, color: "#5E7A90", fontFamily: Constants.LIST_FONT_FAMILY, paddingBottom: 8 }}>
                {description.trim()}
              </Text>
              <Text numberOfLines={3} style={{ fontSize: 10, color: "#5E7A90", textAlign: 'left', fontFamily: Constants.LIST_FONT_FAMILY }}>
                {(address.address1 || '') + '\n' + (address.address2 || '')}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.storeStarRating}>{storeDetails.rating || '5.0'}</Text>
            <Icon
              name='star'
              color="#ffc106"
              size={14}
              style={{
                fontFamily: Constants.LIST_FONT_FAMILY
              }}
            />
          </View>
        </View>
        <View style={styles.ratingsWrapper}>
          <Stars heading="Shopping Experience" defaultSelected={purchaseExpRating} onSelectStar={(rating) => setPurchaseExpRating(rating)} />
          <Stars heading="Product Quality" defaultSelected={productQualityRating} onSelectStar={(rating) => setProductQualityRating(rating)} />
          <Stars heading="Staff Behaviour" defaultSelected={storeStaffSupportRating} onSelectStar={(rating) => setStoreStaffSupportRating(rating)} />
        </View>
        <View style={styles.commentBox}>
          <TextInput
            placeholder="Add your comments"
            onChangeText={(val) => setComments(val)}
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={500}
            style={{
              padding: 16
            }}
          />
        </View>
        <TouchableOpacity style={styles.doneBtn} onPress={handleRatingSubmit} disabled={isDisabled}>
          <Text style={[styles.doneBtnText, isDisabled ? styles.disabledBtn : null]}>DONE</Text>
        </TouchableOpacity>
      </ScrollView>
    </View >
  )
}

const styles = StyleSheet.create({
  listImage: {
    width: 60,
    height: 60,
    // marginTop: '5%',
    alignSelf: 'center',
    borderRadius: 10
  },
  storeInfoContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#cecece',
    paddingVertical: 12,
    paddingRight: 12,
    justifyContent: 'space-between'
    // marginTop: '8%'
  },
  storeStarRating: {
    paddingRight: 4,
    fontSize: 12,
    color: '#5E7A90',
    fontFamily: Constants.LIST_FONT_FAMILY
  },
  ratingsContainer: {
    alignSelf: 'center',
    flex: 1,
    width: '100%',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4
  },
  ratingsWrapper: {
    margin: '4%',
    marginVertical: '8%',
  },
  centerAlignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  star: {},
  ratingHeading: {
    fontSize: 12,
    // fontWeight: 'bold',
    color: "#5E7A90",
    fontFamily: Constants.LIST_FONT_FAMILY,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  commentBox: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Constants.DOBO_RED_COLOR,
    marginTop: 6,
    marginHorizontal: 16
  },
  doneBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 16,
    bottom: 0
  },
  disabledBtn: {
    opacity: 0.5,
  },
  doneBtnText: {
    borderRadius: 30,
    backgroundColor: Constants.DOBO_RED_COLOR,
    justifyContent: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden',
    padding: 16,
    paddingVertical: 12,
    width: 110,
    color: '#fff',
    fontFamily: Constants.LIST_FONT_FAMILY
  }
})

export default RatingsPage;