import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Text,
    Image,
} from 'react-native'
import { facebookService } from '../../services/FacebookService'
import { Button } from 'react-native-elements'
import * as Constants from '../../services/Constants'
import { HeaderBackButton } from 'react-navigation-stack'

class RegisterOptions extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (<HeaderBackButton onPress={() => { navigation.popToTop() }} />),
            headerTitle: <Text style={{ fontSize: 20, fontFamily: Constants.LIST_FONT_FAMILY }}>Sign Up</Text>
        }
    }

    isFacebook = false
    profile = {}
    constructor(props) {
        super(props)
        this.loadData = this.loadData.bind(this)
        this.loginWithFacebook = this.loginWithFacebook.bind(this)
        this.onRegisterClicked = this.onRegisterClicked.bind(this)
        this.navigateTo = this.navigateTo.bind(this)
    }
    onRegisterClicked() {
        this.isFacebook = false;
        this.navigateTo()
    }

    async navigateTo() {
        const { navigate } = this.props.navigation;
        if (this.isFacebook) {
            navigate('FaceBookConfirmation', {
                username: this.profile.name,
                avatar: this.profile.avatar
            })
            this.isFacebook = false;
        } else {
            navigate('SignUp')
        }
    }

    async loadData() {
        console.log('RegisterOptions::loadData()')
        try {
            const profile = await facebookService.fetchProfile()
            console.log('Facebook Profile', profile)
            this.isFacebook = true;
            this.profile = profile

            // await AsyncStorage.setItem("username", profile.name);
            // await AsyncStorage.setItem("avatar", profile.avatar);
            this.navigateTo()
        } catch (error) {
            console.error(error)
        }
        // const [profile, error] = await facebookService.fetchProfile()
        // if(error)
        // {
        //     console.log('Error in Facebook load data'+error)
        // }
        // else
        // {

        //}

    }
    loginWithFacebook() {
        console.log('RegisterOptions::loginWithFacebook()')
        facebookService.loginToFacebook((accessToken) => {

            console.log('Access Token received from FB ' + accessToken)
            //this.login()
            this.loadData()
        })
    }

    render() {
        return (
            <View style={[styles.container]}>
                <View style={[styles.imageView]}>
                    <Image
                        style={styles.doboImage}
                        source={require('../../assets/images/app_icon.png')}
                        resizeMode='contain'
                    />
                </View>
                <View style={{ flex: 0.6, justifyContent: 'center', margin: 20 }}>
                    <Button
                        title='CONNECT WITH FACEBOOK'
                        buttonStyle={styles.fbButton}
                        containerStyle={{
                            marginTop: '5%',
                            borderRadius: 30
                        }}
                        icon={{
                            name: 'facebook',
                            type: 'font-awesome',
                            size: 20,
                            color: 'white',
                        }}
                        iconContainerStyle={{ marginRight: '10%', marginLeft: '5%' }}
                        titleStyle={{ fontSize: 16 }}
                        onPress={() => this.loginWithFacebook()}
                    />

                    <Button
                        title='SIGN UP'
                        buttonStyle={styles.registerButton}
                        containerStyle={{
                            marginTop: '5%',
                            borderRadius: 30
                        }}
                        titleStyle={{ fontSize: 16, color: Constants.DOBO_RED_COLOR }}
                        onPress={() => this.onRegisterClicked()}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    imageView: {
        flex: 0.5,
        justifyContent: 'center'
    },
    doboImage: {
        height: undefined,
        width: undefined,
        flex: 1,
        alignSelf: 'stretch',
        marginTop: 50
    },
    registerButton: {
        borderRadius: 30,
        backgroundColor: 'white',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Constants.DOBO_RED_COLOR,
        overflow: 'hidden'
    },
    fbButton: {
        justifyContent: 'flex-start',
        backgroundColor: '#3b5998',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden',
    }

});

export default RegisterOptions