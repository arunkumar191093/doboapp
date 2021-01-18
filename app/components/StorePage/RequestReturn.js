import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as Constants from '../../services/Constants';
import NavHeader from '../Common/NavHeader';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import ModalPopUp from '../Common/ModalPopUp';
import {
  returnBag
} from '../../services/StoreBag';


const RequestReturn = ({ navigation }) => {
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(0);
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const bagId = navigation.getParam('bagId');
  const returnedItem = navigation.getParam('returnedItems');

  const backPressHandler = () => {
    navigation.goBack();
  }

  const handleReturnSubmit = async () => {
    let req = {
      "returnBaggedProducts": returnedItem,
      "returnType": selectedDeliveryOption == 0 ? 'AtStore' : 'CollectFromDoor',
      "returnReason": reason
    };
    if (returnedItem.length) {
      const response = await returnBag(bagId, req);
      if (response.status == 200) {
        setShowModal(true);
      }
    }
  }

  const onModalClose = () => {
    setShowModal(false);
    navigation.navigate('Home');
  }

  return (
    <View>
      <NavHeader backPressHandler={backPressHandler}></NavHeader>
      <View style={styles.container}>
        <Text style={styles.mainHeading}>Return Request</Text>
        <Text style={styles.returnQues}>How would you like to return your bag?</Text>
        <RadioGroup
          size={24}
          thickness={2}
          color={Constants.DOBO_RED_COLOR}
          //highlightColor='#ccc8b9'
          selectedIndex={selectedDeliveryOption}
          onSelect={(index, value) => setSelectedDeliveryOption(index)}
        >
          <RadioButton style={styles.returnOptions} value={0} key={'AtStore'}>
            <Text style={{ paddingLeft: 8 }}>At store</Text>
          </RadioButton>
          <RadioButton style={styles.returnOptions} value={1} key={'CollectFromDoor'}>
            <Text style={{ paddingLeft: 8 }}>Collect from my door</Text>
          </RadioButton>
        </RadioGroup>
        <View style={styles.commentBox}>
          <TextInput
            placeholder="Reason for return"
            onChangeText={(val) => setReason(val)}
            multiline={true}
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={500}
            style={{
              padding: 16
            }}
          />
        </View>
        <TouchableOpacity style={styles.doneBtn} onPress={handleReturnSubmit} disabled={!reason}>
          <Text style={[styles.doneBtnText, !reason ? styles.disabledBtn : null]}>SUBMIT</Text>
        </TouchableOpacity>
      </View>

      {
        showModal &&
        <ModalPopUp canClose={true} onClose={onModalClose}>
          <>
            <View style={styles.modalContainer}>
              <Text style={styles.mainHeading}>Return Request</Text>
              <Text style={styles.message}>Your return request has been submitted successfully!</Text>
              <Text style={styles.message}>Your refund will be initiated once the item recieved at the store and upon confirmation.</Text>
            </View>
            <TouchableOpacity style={styles.doneBtn} onPress={onModalClose} disabled={!reason}>
              <Text style={[styles.doneBtnText, !reason ? styles.disabledBtn : null]}>CLOSE</Text>
            </TouchableOpacity>
          </>
        </ModalPopUp>
      }
    </View >

  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 30,
  },
  modalContainer: {
    paddingHorizontal: 30,
    paddingBottom: 200
  },
  mainHeading: {
    fontSize: 26,
    color: '#31546E',
    fontFamily: Constants.LIST_FONT_FAMILY,
    paddingBottom: 34
  },
  returnQues: {
    fontSize: 14,
    color: '#31546E',
    fontFamily: Constants.LIST_FONT_FAMILY,
    paddingBottom: 24
  },
  returnOptions: {
    fontSize: 16,
    color: '#31546E',
    fontFamily: Constants.LIST_FONT_FAMILY
  },
  message: {
    fontSize: 16,
    color: '#31546E',
    fontFamily: Constants.LIST_FONT_FAMILY,
    paddingVertical: 12
  },
  doneBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 16,
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
  commentBox: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Constants.DOBO_RED_COLOR,
    marginTop: 30,
    marginHorizontal: 16
  }
})

export default RequestReturn;