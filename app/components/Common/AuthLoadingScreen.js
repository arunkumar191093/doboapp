import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { getUserToken,setUserToken } from '../../services/Helper';
import NetInfo from "@react-native-community/netinfo";
import * as Constants from '../../services/Constants'


class AuthLoadingScreen extends React.Component {
  state = {
    isConnected: true
  }
  componentDidMount() {
    //below code will set a dummy token to enable app to run in emulator
    // this.setDummyToken(); //TODO: Remove setting dummy token for emulator
    this._bootstrapAsync();
  }

  setDummyToken = async () =>{
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2NzY0ZjdmNi05Yzk1LTRiN2ItYjA4NS03ZGYxOWJmZWFlNTQiLCJyb2xlIjoiQ3VzdG9tZXIiLCJuYmYiOjE2MDg4MzE1MzksImV4cCI6MTYxNjYwNzUzOSwiaWF0IjoxNjA4ODMxNTM5fQ.qrQysnMfvcfjBt853IAltdyGgn_U-RgJreDPiSE3FM4"
    await setUserToken(token)
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    NetInfo.fetch().then(async (state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      this.setState({ isConnected: state.isConnected })
      if (state.isConnected) {
        const userToken = await getUserToken()
        console.log('UserToken ' + userToken)
        //console.log(userToken1)
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
      }
    });
  };

  onTryAgainPress = () => {
    this._bootstrapAsync()
  }

  renderNoNetworkView() {
    if (!this.state.isConnected) {
      return (
        <View>
          <Text style={styles.messageText}>
            Could not connect to the Internet. Please check your network.
                </Text>
          <TouchableOpacity
            style={{ alignItems: 'center', alignSelf: 'center' }}
            onPress={() => this.onTryAgainPress()}>

            <Text style={{ color: Constants.DOBO_RED_COLOR, fontFamily: Constants.LIST_FONT_FAMILY }}>
              Try again
					</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.8 }}>
        {/* <ActivityIndicator />
        <StatusBar barStyle="default" /> */}

        <Image
          style={styles.doboImage}
          source={require('../../assets/images/dobo-app-icon3.png')}
          resizeMode='contain'
        />
        {this.renderNoNetworkView()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  doboImage: {
    height: undefined,
    width: undefined,
    flex: 1,
    alignSelf: 'stretch',
    marginTop: 50
  },
  messageText: {
    textAlign: 'center',
    marginHorizontal: '5%',
    marginVertical: '5%',
    fontFamily: Constants.LIST_FONT_FAMILY
  }
})
export default AuthLoadingScreen