import React, { Component } from 'react'
import {
    View,
    Image,
    TextInput,
    StyleSheet,
    Text,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
 import PropTypes from 'prop-types';
import * as Constants from '../../services/Constants';
class LoginLargeView extends Component {
    constructor()
    {
        super()
        //this.onFocusChange = this.onFocusChange.bind(this)
    }
    // onFocusChange()
    // {
    //     const {navigate} = this.props.navigation;
    //     navigate('EnterMobileNumber')
    // }
    render() {
        return (
            <View style = {{flex:1, justifyContent: 'flex-start'}}>
                <View style = {[styles.centerEverything, styles.imageView]}>
                    <Image
                        style={styles.doboImage}
                        source={require('../../assets/images/app_icon.png')}
                        resizeMode = 'contain'
                    />
                </View>
                <View style={[styles.parentContainer]}>
                    <View style={[styles.iconViewContainer]}>
                        <Icon name="keyboard-arrow-down"
                        size={30}
                        color = 'red'
                        />
                    </View>
                    <View style = {[styles.textViewContainer,]}>
                        <Text style={styles.firstText}>
                            LOGIN
                        </Text>
                        <Text style = {styles.secondText}>
                            OR
                        </Text>
                        <Text style={{fontFamily:Constants.LIST_FONT_FAMILY}}>
                            REGISTER
                        </Text>
                    </View>
                    <View style={{justifyContent: 'center',alignItems: 'center',}}>
                        <TextInput
                            placeholder = "Enter your mobile number"
                            //onChangeText = {this.handleChangeText}
                            //style = {} 
                            onFocus = {this.props.onFocus}
                            //autoFocus = {true}
                            keyboardType={'phone-pad'}>
		                </TextInput>
                        <View style={styles.underlineStyle}></View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  centerEverything: {
    //justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    
  },
  imageView: {
    flex: 0.6,
    //backgroundColor: 'green',
  },
  doboImage : {
    height: undefined,
    width: undefined,
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 50
  },
    parentContainer: {
        justifyContent: 'flex-start',
        //alignItems: 'center',
        //backgroundColor: 'blue'
    },
    iconViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'orange'
    },
    textViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        //backgroundColor: 'grey'
    },
    firstText:{
        marginLeft: 20,
        fontFamily:Constants.LIST_FONT_FAMILY
    },
    secondText:{
          color:'red',
          padding: 10,
          fontFamily:Constants.LIST_FONT_FAMILY
    },
    underlineStyle: {
        width: 200,
        height: 1,
        backgroundColor: '#202020',
        marginLeft: 0
    }
});

export default LoginLargeView