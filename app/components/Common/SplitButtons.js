import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Constants from '../../services/Constants';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SplitButtons = ({
  leftBtnName = 'SUBMIT',
  amount = 0,
  onLeftPress = () => { },
  onRightPress = () => { },
  showDetails = false,
  isDisabled = false
}) => {
  return (
    <View style={[styles.container, isDisabled ? styles.disabledBtn : null]}>
      <TouchableOpacity onPress={onLeftPress} style={styles.leftBtn} disabled={isDisabled}>
        <Text style={styles.leftBtnTxt}>{leftBtnName}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRightPress} style={styles.rightBtn} disabled={isDisabled}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Text style={styles.total}>Total: Rs. </Text>
          <Text style={styles.amount}>{amount.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={styles.viewDetails}>VIEW DETAILS</Text>
          <Icon
            name={showDetails ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            color={Constants.DOBO_RED_COLOR}
            size={16}
          />
        </View>
      </TouchableOpacity>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  leftBtn: {
    flex: 1,
    backgroundColor: Constants.DOBO_RED_COLOR,
    padding: 12,
  },
  rightBtn: {
    flex: 1,
    padding: 4,
    paddingRight: 16,
    backgroundColor: '#F2F2F2'
  },
  leftBtnTxt: {
    fontFamily: Constants.LIST_FONT_FAMILY,
    textAlign: 'center',
    color: '#fff',
    fontSize: 12
  },
  total: {
    fontFamily: Constants.LIST_FONT_FAMILY,
    color: "#5E7A90",
    textAlign: 'right',
    fontSize: 10
  },
  amount: {
    fontFamily: Constants.BOLD_FONT_FAMILY,
    color: "#5E7A90",
    textAlign: 'right',
    fontSize: 10
  },
  viewDetails: {
    fontFamily: "Montserrat-Regular",
    textAlign: 'right',
    fontSize: 8,
    fontWeight: 'bold',
    color: Constants.DOBO_RED_COLOR
  },
  disabledBtn: {
    opacity: 0.5,
  }
})

export default SplitButtons;