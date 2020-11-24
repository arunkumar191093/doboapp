import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import * as Constants from '../../services/Constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView, BorderlessButton } from 'react-native-gesture-handler';
import { PostReviewRatings, getReviewsByReviewId, PostReplyForReview } from '../../services/Api';
import Loader from '../Common/Loader';
import moment from 'moment';

const Stars = ({
  heading,
  isDisabled = false,
  defaultSelected = 0,
  maxRating = 5,
  onSelectStar = () => { }
}) => {
  const [ratingStars, setRatingStars] = useState([]);
  useEffect(() => {
    let ratingStarsArr = [];
    for (let i = 1;i <= maxRating;i++) {
      ratingStarsArr.push(
        <TouchableOpacity key={i} onPress={() => onSelectStar(i)} style={styles.star} disabled={isDisabled}>
          <Icon
            name={i <= defaultSelected ? 'star' : 'star-outline'}
            color={i <= defaultSelected ? '#ffc106' : '#5E7A90'}
            size={24}
          />
        </TouchableOpacity>
      )
    }
    setRatingStars(ratingStarsArr);
  }, [defaultSelected, isDisabled])
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

const RatingResponses = ({
  storeDetails = {},
  reviewDetails = {},
  defaultRating = 0,
  onRatingSubmit = () => { }
}) => {
  const { review, storeCheckIn } = reviewDetails;
  const [userId, setUserId] = useState(review && review.userId ? review.userId : '')
  const [purchaseExpRating, setPurchaseExpRating] = useState(review && review.purchaseExpRating || defaultRating);
  const [productQualityRating, setProductQualityRating] = useState(review && review.productQualityRating || defaultRating);
  const [storeStaffSupportRating, setStoreStaffSupportRating] = useState(review && review.storeStaffSupportRating || defaultRating);
  const [comments, setComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [disableRating, setDisableRating] = useState(true);
  const [repliesArr, setRepliesArr] = useState([]);

  let isDisabled = !purchaseExpRating || !productQualityRating || !storeStaffSupportRating;


  const { retailer, storeAddress, storeDescription } = storeDetails;
  let imageURL = storeDetails.iconURL !== null ? (Constants.imageResBaseUrl + storeDetails.iconURL) : Constants.DEFAULT_STORE_ICON;

  useEffect(() => {
    if (review) {
      console.log('review', review)
      setUserId(review.userId);
      let replies = review.reviewText ? [review, ...review.replies] : [...review.replies]
      setRepliesArr(replies)
      // getReplies(review.id) //make this call if required in future
    } else {
      setDisableRating(false)
    }
  }, [])

  const handleRatingSubmit = async () => {
    setIsLoading(true);
    if (review) {
      let request = {
        reviewId: review.id,
        parentReplyId: 0,
        replyText: comments ? comments : ""
      }
      let ratingResponse = await PostReplyForReview(request);
      console.log('ratingResponse', ratingResponse);
      setIsLoading(false);
      if (ratingResponse.status == 200) {
        onRatingSubmit();
      }
      else {
        alert('Something went wrong. Please try again')
      }
    }
    else {

      let request = {
        storeId: storeDetails.storeId,
        storeCheckInId: storeCheckIn.id,
        purchaseExpRating: purchaseExpRating,
        productQualityRating: productQualityRating,
        storeStaffSupportRating: storeStaffSupportRating,
        reviewHeader: "",
        reviewText: comments ? comments : ""
      }
      console.log('ratingResponse request', request);
      let ratingResponse = await PostReviewRatings(request);
      console.log('ratingResponse', ratingResponse);
      setIsLoading(false);
      if (ratingResponse.status == 200) {
        onRatingSubmit();
      }
      else {
        alert('Something went wrong. Please try again')
      }
    }

  }

  const getReplies = async (id) => {
    let response = await getReviewsByReviewId(id);
    if (response.status == 200) {
      let responseData = JSON.parse(response.responseJson);
      console.log('replies', responseData)
    }
  }

  const RenderReplies = ({
    reviewReplies = [],
    userId = ''
  }) => {
    let replies = [];
    replies = reviewReplies.map((item) => {
      let itemUserId = item.userId || item.repliedBy || '';
      return (
        <View style={[{ paddingTop: 10 }, itemUserId != userId ? { paddingLeft: '10%' } : null]} key={item.id.toString()}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.userName}>{itemUserId != userId ? 'Store' : 'You'},</Text>
            <Text style={styles.responseTime}>{moment(item.lastUpdatedAt).format('D MMM YYYY, hh:mm a')}</Text>
          </View>
          <Text style={styles.responseMsg}>
            {item.reviewText || item.replyText || ''}
          </Text>
        </View>
      )
    })
    return (
      <>
        {replies}
      </>
    )
  }

  return (

    <View style={styles.ratingsContainer}>
      <Loader
        loading={isLoading} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 22, color: Constants.DOBO_GREY_COLOR, alignSelf: 'flex-start', fontFamily: Constants.SEMI_BOLD_FONT_FAMILY }}>
          Your Rating
          </Text>
        <View style={styles.storeInfoContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Image style={styles.listImage}
              source={{ uri: imageURL }} />
            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 16, color: "#5E7A90", fontFamily: Constants.LIST_FONT_FAMILY, paddingBottom: 8 }}>
                {storeDescription.trim()}
              </Text>
              <Text numberOfLines={3} style={{ fontSize: 10, color: Constants.BODY_TEXT_COLOR, textAlign: 'left', fontFamily: Constants.LIST_FONT_FAMILY }}>
                {(storeAddress.address1 || '') + '\n' + (storeAddress.address2 || '')}
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={styles.ratingsWrapper}>
            <Stars heading="Shopping Experience" defaultSelected={purchaseExpRating} isDisabled={disableRating} onSelectStar={(rating) => setPurchaseExpRating(rating)} />
            <Stars heading="Product Quality" defaultSelected={productQualityRating} isDisabled={disableRating} onSelectStar={(rating) => setProductQualityRating(rating)} />
            <Stars heading="Staff Behaviour" defaultSelected={storeStaffSupportRating} isDisabled={disableRating} onSelectStar={(rating) => setStoreStaffSupportRating(rating)} />
          </View>

          <View style={styles.responsesContainer}>
            <RenderReplies reviewReplies={repliesArr} userId={userId} />
          </View>

          <View style={styles.commentBox}>
            <TextInput
              placeholder="Type here..."
              onChangeText={(val) => setComments(val)}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
              style={{
                padding: 16
              }}
            />
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={handleRatingSubmit} disabled={isDisabled}>
            <Text style={[styles.doneBtnText, isDisabled ? styles.disabledBtn : null]}>SUBMIT</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View >
  )
}

const styles = StyleSheet.create({
  listImage: {
    width: 60,
    height: 60,
    // marginTop: '5%',
    alignSelf: 'center'
  },
  storeInfoContainer: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#cecece',
    paddingVertical: 12,
    paddingRight: 12,
    justifyContent: 'space-between',
    marginTop: 12
  },
  storeStarRating: {
    paddingRight: 4,
    fontSize: 12,
    color: '#5E7A90'
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
    paddingHorizontal: 12,
    paddingBottom: 12,
    marginVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#cecece',
  },
  centerAlignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  star: {},
  ratingHeading: {
    fontSize: 12,
    color: "#5E7A90",
    fontFamily: Constants.LIST_FONT_FAMILY,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  commentBox: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Constants.DOBO_RED_COLOR,
    marginTop: 16,
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
  },
  responsesContainer: {
    paddingHorizontal: 12,
  },
  userName: {
    fontFamily: Constants.BOLD_FONT_FAMILY,
    color: '#5E7A90',
    fontSize: 12,
    paddingVertical: 4,
  },
  responseTime: {
    fontSize: 10,
    color: Constants.BODY_TEXT_COLOR,
    fontFamily: Constants.LIST_FONT_FAMILY,
    paddingLeft: 4
  },
  responseMsg: {
    color: '#5E7A90',
    fontFamily: Constants.LIST_FONT_FAMILY,
    fontSize: 12,
  }
})

export default RatingResponses;