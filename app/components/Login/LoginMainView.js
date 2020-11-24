import React, { Component } from 'react';
import { StyleSheet, Image, ImageBackground } from 'react-native';
import SwipeUpDown from 'react-native-swipe-up-down';
import LoginMiniView from './LoginMiniView'
import EnterMobileNumber from '../EnterMobileNumber'


class LoginMainView extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);

    this.state = {
      animation: "easeInEaseOut"
    }
    this.onFocusChange = this.onFocusChange.bind(this)
  }

  onFocusChange() {
    console.log('LoginMainView::onFocusChange()')
    const { navigate } = this.props.navigation;
    navigate('EnterMobileNumber')
  }

  render() {
    return (
      <ImageBackground
        style={styles.doboBackgroundImage}
        source={require('../../assets/images/start-page-background.png')}
      >
        <Image
          style={styles.doboImage}
          source={require('../../assets/images/app_icon.png')}
          resizeMode='contain'
        />
        <SwipeUpDown
          hasRef={ref => (this.swipeUpDownRef = ref)}
          itemMini={
            <LoginMiniView />
          }
          itemFull={
            //<LoginLargeView onFocus={this.onFocusChange}></LoginLargeView>
            <EnterMobileNumber
              navigateTo={this.props.navigation.navigate}
            />
          }
          // onShowMini={() => console.log('mini')}
          // onShowFull={() => console.log('full')}
          disablePressToShow={false}
          style={{ backgroundColor: 'white' }}
          swipeHeight={200}
          animation={this.state.animation}
        />
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
  },
  centerEverything: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',

  },
  imageView: {
    flex: 0.6,
    //backgroundColor: 'green',
  },
  doboBackgroundImage: {
    height: '100%',
    width: '100%',
    flex: 1,
    alignSelf: 'stretch',
  },
  doboImage: {
    height: '100%',
    width: '100%',
    flex: 0.5,
    alignSelf: 'center',
    marginTop: '20%'
    //position:'absolute'
    //top: 10
    //marginTop: 50
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  panelContainer: {
    flex: 1,
    justifyContent: 'center'
  },
});

export default LoginMainView