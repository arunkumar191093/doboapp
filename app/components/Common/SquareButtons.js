import React from 'react';
import * as Constants from '../../services/Constants';
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

const SquareButtons = ({
  items = [],
  name = '',
  isBgColor = false,
  selectedItem = '',
  onClick = () => { }
}) => {
  const renderBtns = items.map((item) => {
    const itemName = name ? eval("item." + name) : item,
      key = `${itemName}-${item.productId}`,
      bgColorStyle = isBgColor ? { backgroundColor: `${itemName.toLowerCase()}` } : { backgroundColor: 'white' },
      isSelected = selectedItem == itemName;
    return (
      <TouchableOpacity key={key} onPress={() => onClick(item)} style={[
        styles.squareBtnContainer,
        bgColorStyle,
        isSelected ? styles.selectedBtn : null
      ]}>
        {
          isBgColor ?
            <Text style={{ textAlign: 'center', color: '#5E7A90' }}>{''}</Text> :
            <Text style={[{ textAlign: 'center', color: '#5E7A90' }, isSelected ? styles.selectedBtnTxt : null]}>{itemName}</Text>
        }
      </TouchableOpacity>
    )
  })
  return (
    <View style={{ flexDirection: 'row' }}>
      {renderBtns}
    </View>
  )
}

const styles = StyleSheet.create({
  squareBtnContainer: {
    padding: 4,
    borderRadius: 4,
    minWidth: 30,
    justifyContent: 'center',
    borderWidth: 0.4,
    marginHorizontal: 2
  },
  selectedBtn: {
    borderColor: Constants.DOBO_RED_COLOR,
    borderWidth: 1.45
  },
  selectedBtnTxt: {
    color: Constants.DOBO_RED_COLOR
  },
})

export default SquareButtons;