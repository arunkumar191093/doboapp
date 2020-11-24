import React from 'react';
import {
  View,
  Text,
  TextInput,
} from 'react-native';

const PasscodeTextInput = React.forwardRef(({ autoFocus, onSubmitEditing, onChangeText, value, onKeyPress }, ref) => {

  const { inputStyle, underlineStyle } = styles;

  return (
    <View>
      <TextInput
        ref={ref}
        autoFocus={autoFocus}
        onSubmitEditing={onSubmitEditing}
        style={[inputStyle]}
        maxLength={1}
        keyboardType="numeric"
        placeholderTextColor="#212121"
        //secureTextEntry={true}
        onChangeText={onChangeText}
        onKeyPress={onKeyPress}
        onChange={(event) => console.log('onChange', event.nativeEvent.text)}
        value={value}
      />
      <View style={underlineStyle} />
    </View>
  );
})

const styles = {
  inputStyle: {
    height: 80,
    width: 30,
    fontSize: 50,
    color: '#212121',
    fontSize: 20,
    padding: 5,
    margin: 5,
    marginBottom: 0
  },
  underlineStyle: {
    width: 30,
    height: 4,
    backgroundColor: '#202020',
    marginLeft: 0
  }
}

export { PasscodeTextInput };