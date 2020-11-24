import React from 'react';
import { View, StyleSheet, Text } from "react-native";
import * as Constants from '../../services/Constants';

const InfoComponent = ({
  heading,
  children
}) => {
  return (
    <View style={styles.infocompContainer}>
      <Text style={styles.infoHeading}>{heading}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  infocompContainer: {
    marginVertical: 8,
    paddingHorizontal: 12
  },
  infoHeading: {
    fontFamily: Constants.BOLD_FONT_FAMILY,
    textTransform: 'uppercase',
    color: "#5E7A90",
    fontSize: 10,
    paddingBottom: 2
  }
})

export default InfoComponent;