import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import * as Constants from '../../services/Constants'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ModalPopUp = ({
  style,
  children,
  onClose = () => { },
  canClose = true,
  showClose = true,
  closeIcon = 'close-circle',
  visible = true
}) => {
  return (
    <Modal animationType="fade" presentationStyle='overFullScreen' style={{ ...style, ...styles.modalContainer }}
      visible={visible} onRequestClose={canClose ? onClose : null}>
      {
        canClose && showClose ?
          <TouchableOpacity style={styles.closeBtn} onPress={canClose ? onClose : null}>
            <Icon
              name={closeIcon}
              color={Constants.DOBO_RED_COLOR}
              size={30}
            />
          </TouchableOpacity>
          : <></>
      }

      <View style={styles.childContainer}>
        {children}
      </View>
    </Modal>

  )
}

const styles = StyleSheet.create({
  modalContainer: {
    paddingVertical: 24
  },
  childContainer: {
    padding: 16,
    height: '98%'
  },
  closeBtn: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    position: 'relative',
    right: 20,
    top: 10,
    padding: 4
  }
})

export default ModalPopUp;