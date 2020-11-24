import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';

const CartBag = ({
  count = 0,
  onBadgePress = () => { }
}) => {
  return (
    <TouchableOpacity onPress={onBadgePress}>
      <Icon name="shopping-bag" size={20} color="#31546e" />
      {
        !!count &&
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      }

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    bottom: -6,
    right: -4,
    backgroundColor: 'red',
    padding: 4,
    minWidth: 16,
    textAlign: 'center',
    borderRadius: 100,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 8,
    color: '#fff'
  },
  cartItemContainer: {

  }
})

export default CartBag;