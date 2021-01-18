import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import MyCheckinList from './MyCheckinList'
import Loader from '../Common/Loader'
import { storecheckins } from '../../services/ProfileListApi'
import NoDataFound from '../Common/NoDataFound'


class MyCheckins extends Component {

    checkinStoreData = {}
    constructor(props) {
        super(props)
        this.checkinStoreData = this.props.navigation.getParam('data')
        this.state = {
            checkinStoreList: [],
            loading: false,
            isDataLoaded: false
        }

    }

    componentDidMount() {

        this.callStorecheckinsDetails()
    }

    callStorecheckinsDetails = async () => {
        this.startLoading();
        let response = await storecheckins();
        if (response.status == 200) {
            let storeCheckinData = response.responseJson;
            let storeCheckinDetails = JSON.parse(storeCheckinData);
            console.log('storeCheckinDetails before', storeCheckinDetails)
            storeCheckinDetails.storeCheckIns = this.calculateAggRating(storeCheckinDetails.storeCheckIns)
            console.log('storeCheckinDetails', storeCheckinDetails)
            let storeCheckinList = storeCheckinDetails.storeCheckIns;
            this.setState({ checkinStoreList: storeCheckinList });
            this.stopLoading();
        } else {
            this.stopLoading();
        }
        this.setState({ isDataLoaded: true })
    }

    startLoading() {
        this.setState({ loading: true });
    }

    stopLoading() {
        this.setState({ loading: false });
    }

    calculateAggRating(checkinData) {
        return checkinData.map((item) => {
            const { storeReviewAnalytics } = item;
            let total, aggStoreRating;
            if (storeReviewAnalytics) {
                total = storeReviewAnalytics.productQualityAverage + storeReviewAnalytics.purchaseExpAverage + storeReviewAnalytics.storeStaffSupportAverage;
                aggStoreRating = (total / 3).toFixed(1);
            }
            return {
                ...item,
                aggStoreRating: aggStoreRating ? aggStoreRating.toString() : ''
            }
        })
    }


    onListItemClicked = (data) => {
        this.props.navigation.navigate('MyCheckinDetails', { storeData: data })
    }


    render() {
        const { isDataLoaded, checkinStoreList, loading } = this.state
        return (
            <View style={styles.container}>
                <Loader
                    loading={loading}
                />
                {isDataLoaded && checkinStoreList.length == 0
                    ? <View style={styles.noDatacontainer}>
                        <NoDataFound message='No Check-in Found' />
                    </View>
                    : <MyCheckinList
                        data={checkinStoreList}
                        onCurrentItemClick={(item) => this.onListItemClicked(item)}
                    />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noDatacontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MyCheckins