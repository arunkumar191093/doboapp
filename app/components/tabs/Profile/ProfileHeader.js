import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity
} from 'react-native'
import * as Constants from '../../../services/Constants'
import { GetUserProfile } from '../../../services/Api';
import ImagePicker from 'react-native-image-picker';
import { UpdateUserProfile } from '../../../services/ProfileListApi'
import Loader from '../../Common/Loader';
import NoNetwork from '../../Common/NoNetwork';
import IconComponent from '../../Common/IconComponent';
import { ImageConst } from '../../../services/ImageConstants';


class ProfileHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            avatar: Constants.DEFAULT_PROFILE_IMAGE,
            username: '',
            phoneNumber: '',
            email: '',
            photo: '',
            photo2: false,
            loading: false,
            errorPage: false
        }

    }

    async componentDidMount() {
        //await this.setAvatar()
        await this.setUserProfile()
    }

    async setUserProfile() {
        this.startLoading();
        let response = await GetUserProfile()
        if (response.status == 200) {
            let userProfile = response.responseJson
            let jsonUserProfile = JSON.parse(userProfile)
            console.log('Userprofile>>>', jsonUserProfile)

            if (jsonUserProfile != null && jsonUserProfile != undefined) {
                let replaceUrl
                if (jsonUserProfile.profileImage) {
                    replaceUrl = jsonUserProfile.profileImage.replace(/\\/gi, '/')
                } else {
                    replaceUrl = ''
                }

                this.setState({
                    username: jsonUserProfile.name,
                    phoneNumber: jsonUserProfile.phoneNumber,
                    email: jsonUserProfile.email,
                    photo: replaceUrl,
                    photo2: false
                })
            }
            this.stopLoading();
        }
    }
    handleChoosePhoto = () => {
        const options = {
            title: 'Select Photo',
            takePhotoButtonTitle: 'Take photo with your camera',
            chooseFromLibraryButtonTitle: 'Choose photo from library',
        }
        //ImagePicker.showImagePicker({ noData: true, mediaType: 'photo', allowsEditing: true }, (response) => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('ImagePicker>>', response);
            this.setState({ photo: response.uri, photo2: true })
            if (response.didCancel) {
                this.setUserProfile();
                console.log('User cancelled image picker');
            } else if (response.error) {
                this.setUserProfile();
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.UploadImage(response)
                console.log(response.uri)
            }
        });
    };

    UploadImage = async (photoData) => {
        console.log('FormData', photoData)
        const data = new FormData();
        //data.append('submit','ok')
        data.append("file", {
            name: photoData.fileName,
            type: photoData.type,
            uri: Platform.OS === "android" ? photoData.uri : photoData.uri.replace("file://", "")
        });
        // this.startLoading();
        if (data == null) {
            await this.setUserProfile()
            //  this.stopLoading();
        } else {
            try {
                let response = await UpdateUserProfile(data);
                if (response.status == 200) {
                    await this.setUserProfile()
                    //   this.stopLoading();
                } else {
                    await this.setUserProfile()
                    //  this.stopLoading();
                }
            } catch (error) {
                // this.stopLoading();
                this.setState({ errorPage: true })
            }

        }
    }


    errorPage1() {
        console.log("Api call error");
        if (this.state.errorPage) {
            return (
                <NoNetwork />
            )
        }

    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false });
    }

    // async setAvatar() {
    //     const avatar = await AsyncStorage.getItem('avatar') || Constants.DEFAULT_PROFILE_IMAGE;
    //     this.setState({
    //         avatar: avatar,
    //     });
    // }

    render() {
        const { photo } = this.state
        console.log('photo', this.state.photo)
        return (
            <View style={styles.container}>
                <Loader
                    loading={this.state.loading}
                />
                <View style={styles.profileImageContainer}>
                    {photo == '' ? (<Image source={{ uri: this.state.avatar }}
                        style={styles.profileImage} />
                    ) : (
                            this.state.photo2 ? <Image source={{ uri: photo }}
                                style={styles.profileImage} />
                                : <Image source={{ uri: Constants.baseURL + photo }}
                                    style={styles.profileImage} />
                        )}
                    <TouchableOpacity onPress={() => this.handleChoosePhoto()}>
                        <Text style={{ color: Constants.DOBO_RED_COLOR, padding: 5, fontFamily: Constants.BOLD_FONT_FAMILY }}>EDIT</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={{ fontFamily: Constants.BOLD_FONT_FAMILY, marginBottom: '5%', color: Constants.LABEL_FONT_COLOR }}>
                        {this.state.username}
                    </Text>
                    <Text style={styles.profileTextDesc}>
                        {this.state.phoneNumber}
                    </Text>
                    <Text style={styles.profileTextDesc}>
                        {this.state.email}
                    </Text>
                </View>
                <TouchableOpacity style={styles.rightContainer}
                    onPress={this.props.giftVoucherClicked}>
                    <IconComponent
                        style={{ marginHorizontal: '5%', }}
                        name={ImageConst["notification-bell-icon"]}
                        size={30} />
                </TouchableOpacity>
                {this.errorPage1()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: Constants.SCREEN_WIDTH,
    },
    profileImageContainer: {
        flex: 1,
        //backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: '5%',
        marginVertical: '2%'
    },
    infoContainer: {
        flex: 3,
        alignItems: 'flex-start',
        marginVertical: '2%'
    },
    rightContainer: {
        flex: 1,
        //backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileImage:
    {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        borderColor: Constants.DOBO_RED_COLOR,
        borderWidth: 1,
        overflow: 'hidden'
    },
    profileTextDesc:
    {
        fontFamily: Constants.LIST_FONT_FAMILY,
        fontSize: 12,
        marginVertical: '1%',
        color: Constants.BODY_TEXT_COLOR
    }
})

export default ProfileHeader