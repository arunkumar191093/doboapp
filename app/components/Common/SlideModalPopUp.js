import React from 'react';
import { View, TouchableOpacity, Modal } from "react-native";
import * as Constants from '../../services/Constants';

const SlideModalPopUp = ({
  children,
  handleClose = () => { },
  childrenStyle = {}
}) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={handleClose}>
        <TouchableOpacity onPress={handleClose}
          style={{ backgroundColor: '#000', opacity: 0.5, flex: 1 }}>
        </TouchableOpacity>
        <View style={[{
          flex: 0.7,
          borderColor: '#fff',
          backgroundColor: "#fff",
          borderTopColor: Constants.DOBO_RED_COLOR,
          borderTopWidth: 4,
          padding: 8
        },
        childrenStyle]}>
          {children}
        </View>
      </Modal>
    </View>
  )
}

export default SlideModalPopUp;