import React from 'react';
import { View, Text, StyleSheet, Image, } from 'react-native';
import * as Constants from '../../services/Constants'

const ThanksPage = ({
  storeDetails = {},
}) => {

  const { retailer, address, description } = storeDetails;
  let imageURL = retailer != null ? (Constants.imageResBaseUrl + retailer.iconURL) : Constants.DEFAULT_STORE_ICON;


  return (
    <View style={styles.thanksContainer}>
      <Text style={{ fontSize: 24, color: Constants.DOBO_RED_COLOR, alignSelf: 'center', fontFamily: Constants.LIST_FONT_FAMILY }}>Thank You!</Text>
      <Text style={{ fontSize: 16, color: "#5E7A90", textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY, paddingVertical: 4, marginBottom: '8%' }}>
        Please visit again.
      </Text>
      <View style={styles.storeInfoContainer}>
        <Image style={styles.listImage}
          source={{ uri: imageURL }} />
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '8%' }}>
          <Text style={{ fontSize: 18, color: "#5E7A90", fontFamily: Constants.LIST_FONT_FAMILY, paddingBottom: 8 }}>
            {description.trim()}
          </Text>
          {
            address &&
            <Text numberOfLines={3} style={{ fontSize: 14, color: "#5E7A90", textAlign: 'center', fontFamily: Constants.LIST_FONT_FAMILY }}>
              {(address.address1 || '') + '\n' + (address.address2 || '')}
            </Text>
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  thanksContainer: {
    height: '100%',
    justifyContent: 'center'
  },
  listImage: {
    width: 90,
    height: 90,
    alignSelf: 'center'
  },
  storeInfoContainer: {
    paddingVertical: 12,
    justifyContent: 'space-between'
  }
})

export default ThanksPage;