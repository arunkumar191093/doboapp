import React, { Component } from 'react';
import * as Constants from '../../../../services/Constants'
import { Icon } from 'react-native-elements'
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import Loader from '../../../Common/Loader';
import { GetDoboTvByCategory } from '../../../../services/DoboTVApi';
// import { youtubeVideoIdParser } from '../../../../services/Helper';
import { youtubeVideoIdParser, likeContent, createShareUserAction, shareYoutubeLink } from '../../../../services/Helper';
import { YouTubeStandaloneAndroid } from 'react-native-youtube';
import DoboVideoGrid from './DoboVideoGrid';
import { ImageBackground } from 'react-native';
import { EntityType } from '../../../../services/ApiConstants';
import { GetUserList, DeleteUserActions } from '../../../../services/UserActions';

class DoboCategoryFilter extends Component {

    value = {};
    static navigationOptions = ({ navigation }) => {
        const { state: { params = {} } } = navigation;
        return {
            title: params.value.description || 'default title',
        };
    }
    state = {
        loading: false,
        doboTVGridData: [],
    };
    constructor(props) {
        super(props);
        this.value = this.props.navigation.getParam('value');
        this.onCloseClickHandler = this.onCloseClickHandler.bind(this);
    }

    componentDidMount = async () => {
        let id = this.value.id;
        await this.getDoboTvByCategory(id);
        // await this.getDoboTv()
    }

    onCloseClickHandler = () => {
        this.props.navigation.goBack();
    }

    async getUserListDoboTv() {
        let response = await GetUserList()
        let doboTvs = []
        if (response.status == 200) {
            let userList = response.responseJson
            let jsonUserList = JSON.parse(userList)
            doboTvs = jsonUserList.doboTvs;
        }
        else {
            //TODO Handle the error condition to show some default Error View

        }
        return doboTvs
    }


    getDoboTvByCategory = async (id) => {
        this.startLoading();
        let userListDoboTvs = await this.getUserListDoboTv()
        let response = await GetDoboTvByCategory(id)
        if (response.status == 200) {
            let doboTvData = response.responseJson
            let jsonDoboTvData = JSON.parse(doboTvData)
            jsonDoboTvData.forEach(function (image, index) {
                let foundDoboTv = userListDoboTvs.find(value => value.doboTv.id === image.id)
                if (foundDoboTv) {
                    image['wishList'] = true
                    image['useraction'] = foundDoboTv.useraction
                }
                else {
                    image['wishList'] = false
                }
                this[index] = image;
            }, jsonDoboTvData);

            console.log('DoboTV after merge>>>', jsonDoboTvData)


            this.setState({ doboTVGridData: jsonDoboTvData })
        }
        this.stopLoading()

    }


    onGirdImageClickHandler = (item) => {
        console.log('onGirdImageClickHandler', item)
        //this.props.navigation.navigate('DoboVideoPlayer')
        let videoId = youtubeVideoIdParser(item.media)
        console.log('Slected Video id>>>', videoId)
        if (Platform.OS === 'android') {
            YouTubeStandaloneAndroid.playVideo({
                apiKey: Constants.YOUTUBE_API_KEY,
                videoId: videoId,
                autoplay: true,
                lightboxMode: false,
            })
                .then(() => {
                    console.log('Android Standalone Player Finished');
                })
                .catch(errorMessage => {
                    this.setState({ error: errorMessage });
                })
        }
    }


    onGridShareClickHandler = async (item) => {

        console.log('onGridShareClickHandler>>', item)
        let sharedData = 'DOBO APP'
        if (item != undefined) {
            sharedData = item.media
        }
        try {
            let result = await shareYoutubeLink(sharedData)
            console.log('shared with App ', result.app)
            let response = await createShareUserAction(EntityType.DoboTv, item.id)
            console.log('Share UserAction Response', response)
        } catch (error) {
            console.error('Could not share', error)
        }
    }

    onGridWishlistClickHandler = async (data) => {
        console.log('onGridWishlistClickHandler>>', data)
        if (data.wishList == false) {
            await likeContent(EntityType.DoboTv, data)
        }
        else {
            if (data.useraction != undefined) {
                let result = await DeleteUserActions(data.useraction.id)
                console.log('Delete Result>>', result)
            }
        }
        this.getDoboTvByCategory(this.value.id)

    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false })
    }


    render() {
        return (
            <View style={styles.container}>
                <Loader
                    loading={this.state.loading}
                />
                <ImageBackground style={{ height: Constants.BANNER_HEIGHT }}
                    source={{ uri: Constants.imageResBaseUrl + this.value.icon }}
                    resizeMode='stretch'>
                    <TouchableWithoutFeedback onPress={this.onCloseClickHandler}>
                        <View style={styles.header}>
                            <Icon name="arrow-back" color="black"></Icon>
                            <Text style={styles.textHeader}>{this.value.name.toUpperCase() || ''}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ImageBackground>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 18, justifyContent: 'center', padding: 20, fontFamily: Constants.BOLD_FONT_FAMILY }}>Videos{' (' + this.state.doboTVGridData.length + ')'}</Text>
                </View>
                <View style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CEDCCE",
                }}
                />
                <DoboVideoGrid
                    data={this.state.doboTVGridData}
                    onImageClickHandler={this.onGirdImageClickHandler}
                    onShareClickHandler={this.onGridShareClickHandler}
                    onWishlistClickHandler={this.onGridWishlistClickHandler}
                />

            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: '5%',
        marginVertical: '5%'
    },
    textHeader: {
        fontSize: 18,
        marginLeft: '3%',
        textAlign: 'center',
        fontFamily: Constants.BOLD_FONT_FAMILY
    },
    categoryImage: {
        alignSelf: 'center',
        height: '50%',
        width: '30%',
        marginTop: '3%'
    },
});


export default DoboCategoryFilter;