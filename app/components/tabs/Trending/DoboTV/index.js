import React, { Component } from 'react'
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native'
import Loader from '../../../Common/Loader';
import YoutubeWebView from '../../../Common/YoutubeWebView';
import { getCategories } from '../../../../services/Categories';
import * as Constants from '../../../../services/Constants'
import DoboVideoGrid from './DoboVideoGrid';
import { YouTubeStandaloneAndroid, YouTubeStandaloneIOS } from 'react-native-youtube';
import { GetDoboTv } from '../../../../services/DoboTVApi';
import { youtubeVideoIdParser, likeContent, createShareUserAction, shareYoutubeLink } from '../../../../services/Helper';
import { GetTrend, GetUserList, DeleteUserActions } from '../../../../services/UserActions';
import CategoryListComponent from './CategoryListComponent';
import { EntityType } from '../../../../services/ApiConstants';
import NoNetwork from '../../../Common/NoNetwork';
import AutoPlayCarousel from '../../../Common/AutoPlayCarousel';
import YoutubePlayer from '../../../Common/YoutubePlayer';

class DoboTV extends Component {

    state = {
        doboTvTrend: [],
        loading: false,
        campaigns: [],
        categories: [],
        doboTVGridData: [],
        carouselLoader: false,
        doboTvTrendLoaded: false,
        activeCarouselIndex: 0
    };
    constructor() {
        super()
    }

    async componentDidMount() {

        await this.getTrendingVideos();
        await this.getCategories();
        await this.getDoboTv()

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

    getDoboTv = async () => {
        let userListDoboTvs = await this.getUserListDoboTv()
        let response = await GetDoboTv()
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

    }

    getTrendingVideos = async () => {
        let userListDoboTvs = await this.getUserListDoboTv()
        console.log('UserListDoboTV>>>', userListDoboTvs)
        let response = await GetTrend();
        if (response.status == 200) {
            //this.setState({ campaigns: response.responseJson });
            let trends = response.responseJson;
            let jsonTrends = JSON.parse(trends)
            let doboTvTrend = jsonTrends.doboTvs
            if (doboTvTrend == undefined || doboTvTrend.length == 0) {
                this.stopCarouselLoading()
                this.setState({ doboTvTrendLoaded: true })
                return
            }
            doboTvTrend.forEach((image, index) => {
                let foundDoboTv = userListDoboTvs.find(value => value.doboTv.id === image.id)
                if (foundDoboTv) {
                    image['wishList'] = true
                    image['useraction'] = foundDoboTv.useraction
                }
                else {
                    image['wishList'] = false
                }
                this[index] = image
            }, doboTvTrend);
            console.log('DoboTv Trend>>>', doboTvTrend)
            this.setState({ doboTvTrend: doboTvTrend, doboTvTrendLoaded: true })

        }
        else {
            //TODO Handle the error condition to show some default Error View
            this.setState({ doboTvTrendLoaded: true })
        }
    }

    onWishlistClickHandler = async (data) => {
        this.startCarouselLoading()
        console.log('DoboTV Wishlist data>>>', data)
        if (data.wishList == false) {
            await likeContent(EntityType.DoboTv, data)
        }
        else {
            if (data.useraction != undefined) {
                let result = await DeleteUserActions(data.useraction.id)
                console.log('Delete Result>>', result)
            }
        }
        await this.getTrendingVideos()
        this.stopCarouselLoading()
    }

    onShareClickHandler = async (data) => {
        console.log("DoboTv Page ITEM_Share>>>>", data)
        let sharedData = 'DOBO APP'
        if (data != undefined) {
            let replaceUrl = data.media.replace(/\\/gi, '/')
            sharedData = replaceUrl
        }
        try {
            let result = await shareYoutubeLink(sharedData)
            console.log('shared with App ', result.app)
            let response = await createShareUserAction(EntityType.DoboTv, data.id)
            console.log('Share UserAction Response', response)
        } catch (error) {
            console.error('Could not share', error)
        }
    }

    getCategories = async () => {
        this.startLoading();
        let response = await getCategories();
        if (response.status == 200) {
            let jsonResponse = JSON.parse(response.responseJson)

            this.setState({ categories: jsonResponse });

        }
        else {
            this.stopLoading()
        }
        this.stopLoading();
    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false })
    }

    onGirdImageClickHandler = (item) => {
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
        else {
            YouTubeStandaloneIOS.playVideo(videoId)
                .then(message => console.log(message))
                .catch(errorMessage => console.error(errorMessage));
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
        this.startLoading()
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
        await this.getDoboTv()
        this.stopLoading()

    }

    onCategoryClickHandler = (item) => {
        console.log('Dobo TV Category Clicked>>>', item)
        this.props.navigation.navigate('DoboCategoryFilter', { value: item });
    }

    onFilterClickHandler = () => {
        console.log('Dobo TV Filter Clicked')
    }

    renderCarouselItem = ({ item, index }) => {
        //console.log('renderCarouselItem', item, index, this.state.activeCarouselIndex)
        if (Platform.OS === 'ios') {
            return (
                <YoutubePlayer
                    key={index}
                    mediaUrl={item.media}
                    data={item}
                    play={index === this.state.activeCarouselIndex ? true : false}
                    onWishlistClickHandler={(data) => this.onWishlistClickHandler(data)}
                    onShareClickHandler={(data) => this.onShareClickHandler(data)}
                    onImageClickHandler={() => { }}
                />
            )
        }
        else {
            return (
                <YoutubeWebView
                    key={index}
                    mediaUrl={item.media}
                    data={item}
                    onWishlistClickHandler={(data) => this.onWishlistClickHandler(data)}
                    onShareClickHandler={(data) => this.onShareClickHandler(data)}
                    onImageClickHandler={() => { }}
                />
            )
        }
    }

    startCarouselLoading = () => {
        this.setState({ carouselLoader: true })
    }

    stopCarouselLoading = () => {
        this.setState({ carouselLoader: false })
    }

    render() {
        return (
            <View style={styles.container}>
                <NoNetwork />
                <Loader
                    loading={this.state.loading}
                />
                <View
                    pointerEvents={this.state.carouselLoader ? 'none' : 'auto'}
                    style={styles.pager}>
                    <AutoPlayCarousel
                        children={this.state.doboTvTrend}
                        renderItem={this.renderCarouselItem}
                        height={Constants.BANNER_HEIGHT}
                        autoplay={false}
                        loop={false}
                        //loading={this.state.carouselLoader}
                        isDataLoaded={this.state.doboTvTrendLoaded}
                        onSnapToItem={(index) => this.setState({ activeCarouselIndex: index })}
                    />
                    {this.state.carouselLoader &&
                        <View style={styles.overlay}>
                            <ActivityIndicator size='large'
                                color={Constants.DOBO_RED_COLOR} />
                        </View>
                    }
                </View>
                <View style={styles.category}>
                    <CategoryListComponent
                        data={this.state.categories}
                        onCategoryClick={(item) => this.onCategoryClickHandler(item)}>
                    </CategoryListComponent>
                </View>
                <DoboVideoGrid
                    data={this.state.doboTVGridData}
                    onImageClickHandler={this.onGirdImageClickHandler}
                    onShareClickHandler={this.onGridShareClickHandler}
                    onWishlistClickHandler={this.onGridWishlistClickHandler} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    pager: {
        //marginTop: Constants.TOP_HEADER_HEIGHT,
    },
    category: {
        flexDirection: "row",
        width: '100%',
        backgroundColor: Constants.BACKGROUND_COLOR,
        justifyContent: 'space-between'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center'
    }

});
export default DoboTV