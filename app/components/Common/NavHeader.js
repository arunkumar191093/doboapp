import React from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import * as Constants from '../../services/Constants';
import { Icon } from 'react-native-elements';

const NavHeader = ({
  heading = '',
  backPressHandler = () => { },
  children,
  isTransparent = false
}) => {
  return (
    <View style={[styles.headContainer, isTransparent ? { opacity: 0.8 } : null]}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableWithoutFeedback onPress={backPressHandler}>
          <View>
            <Icon name="arrow-back" color="#5E7A90"></Icon>
          </View>
        </TouchableWithoutFeedback>
        <Text style={{
          fontFamily: Constants.LIST_FONT_FAMILY,
          color: "#5E7A90",
          paddingLeft: 16,
          fontSize: 16,
          textAlignVertical: 'center'
        }}>
          {heading}
        </Text>
      </View>
      <View>
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headContainer: {
    position: 'absolute',
    padding: 8,
    paddingRight: 16,
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    zIndex: 10
  },
})

export default NavHeader;