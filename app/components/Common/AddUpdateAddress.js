import React, { useState } from 'react';
import ModalPopUp from '../Common/ModalPopUp';
import * as Constants from '../../services/Constants';
import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList } from 'react-native';
import { addNewUserAddresses, updateDefaultUserAddresses } from '../../services/UserActions';

const InputText = ({
  label = '',
  onChangeText = () => { },
  value = '',
  keyboardType = 'default',
  maxLength = 250
}) => {
  return (
    <View style={styles.inputTextContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={{ borderBottomColor: '#31546E', borderBottomWidth: 1, padding: 0, color: '#424242' }}
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  )
}

const AddressItem = ({
  isSelected = false,
  itemData,
  onItemSelect = () => { }
}) => {
  let formattedAddress = `${itemData.address1} ${itemData.address2}, ${itemData.city}, ${itemData.state} - Pin ${itemData.zipCode}`;
  return (
    <TouchableOpacity style={[styles.addressItemContainer, isSelected ? styles.selectedAddress : null]} onPress={() => onItemSelect(itemData)}>
      <Text style={[styles.label, { fontWeight: 'bold' }]}>{itemData.name}</Text>
      <Text style={[styles.label, { fontFamily: Constants.LIST_FONT_FAMILY }]} numberOfLines={3}>
        {formattedAddress}
      </Text>
    </TouchableOpacity>
  )
}

const AddUpdateAddress = ({
  isNewAddress = true,
  allAddresses = [],
  onClose = () => { }
}) => {
  const [name, changeName] = useState('');
  const [address, changeAddress] = useState('');
  const [phone, changePhone] = useState('');
  const [pincode, changePincode] = useState('');
  const [city, changeCity] = useState('');
  const [stateName, changeStateName] = useState('');
  const [isNewForm, setIsNewForm] = useState(!allAddresses.length);

  const isDisabled = !name || !address || !phone || !pincode || !city || !stateName || (pincode && pincode.length < 6) || (phone && phone.length < 10);

  const handleFormSubmit = async () => {
    let req = {
      name: name,
      address1: address,
      address2: "",
      city: city,
      state: stateName,
      zipCode: pincode,
      phoneNumber: phone
    }
    const response = await addNewUserAddresses(req);
    if (response.status === 200) {
      onClose(true);
      setIsNewForm(false);
    } else {
      alert('Something went wrong. Please try again')
    }

  }

  const updateDefaultAddress = async (addressItem) => {
    const response = await updateDefaultUserAddresses(addressItem)
    if (response.status === 200) {
      onClose();
    } else {
      alert('Something went wrong. Please try again')
    }
  }

  const AddressList = ({
    addressArr = [],
    onAddNew = () => { }
  }) => {
    return (
      <View style={styles.addressList}>
        <FlatList
          data={addressArr}
          renderItem={({ item }) => <AddressItem isSelected={item.isDefault} itemData={item} onItemSelect={updateDefaultAddress} />}
          keyExtractor={(item) => item.id.toString()}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={onAddNew}>
          <Text style={[
            styles.saveBtnText, { backgroundColor: '#fff', color: Constants.DOBO_RED_COLOR, borderColor: Constants.DOBO_RED_COLOR }]}>
            ADD NEW
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ModalPopUp canClose={true} onClose={isNewForm ? () => setIsNewForm(false) : () => onClose()} >
      <View style={styles.addressFormContainer}>
        <Text style={styles.heading}>{isNewForm ? 'Add Address' : 'Change Address'}</Text>
        <ScrollView style={{ flex: 1, marginTop: 28 }}>
          {isNewForm ?
            <>
              <InputText label="Name" value={name} onChangeText={(text) => changeName(text)} />
              <InputText label="Address" value={address} onChangeText={(text) => changeAddress(text)} />
              <InputText label="Phone" value={phone} onChangeText={(text) => changePhone(text)} keyboardType="numeric" maxLength={10} />
              <InputText label="PIN Code" value={pincode} onChangeText={(text) => changePincode(text)} keyboardType="numeric" maxLength={6} />
              <InputText label="City" value={city} onChangeText={(text) => changeCity(text)} maxLength={100} />
              <InputText label="State" value={stateName} onChangeText={(text) => changeStateName(text)} maxLength={100} />

              <TouchableOpacity style={styles.saveBtn} onPress={handleFormSubmit} disabled={isDisabled}>
                <Text style={[styles.saveBtnText, isDisabled ? styles.disabledBtn : null]}>SAVE</Text>
              </TouchableOpacity>
            </>
            : <AddressList addressArr={allAddresses} onAddNew={() => setIsNewForm(true)} />
          }
        </ScrollView>

      </View>
    </ModalPopUp>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    color: Constants.SEMI_BOLD_FONT_COLOR,
    fontFamily: Constants.SEMI_BOLD_FONT_FAMILY,
  },
  addressFormContainer: {
    paddingHorizontal: 16,
    flex: 1
  },
  label: {
    fontSize: 12,
    color: Constants.SEMI_BOLD_FONT_COLOR,
    fontFamily: Constants.SEMI_BOLD_FONT_FAMILY,
  },
  saveBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 16,
    bottom: 0
  },
  disabledBtn: {
    opacity: 0.5,
  },
  saveBtnText: {
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
  inputTextContainer: {
    paddingBottom: 16
  },
  addressList: {
  },
  addressItemContainer: {
    padding: 16,
    marginBottom: 12,
    borderColor: '#81A8BA',
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: '#F0FBFF'
  },
  selectedAddress: {
    borderColor: '#1EBA4A',
    borderRadius: 4,
    backgroundColor: '#EDFFF2'
  }
})

export default AddUpdateAddress;