import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet,
	Image,
	ImageBackground,
	Linking,
	TouchableWithoutFeedback,
	Platform
} from 'react-native'
import { Divider, Button } from 'react-native-elements'
import * as Constants from '../../../services/Constants'
import Icon from 'react-native-vector-icons/Entypo';
import { tConvert } from '../../../services/Helper';
import IconComponent from '../../Common/IconComponent';
import { ImageConst } from '../../../services/ImageConstants';
import moment from 'moment';


// -------------------Props---------------------
// onCancelClicked;
// selectedStore

class StoreQuickView extends Component {

	constructor(props) {
		super(props);
		this.onOpenMapHandler = this.onOpenMapHandler.bind(this);
		this.onStoreClickHandler = this.onStoreClickHandler.bind(this);
	}
	state = {
		value: '5.0'
	}

	onOpenMapHandler = () => {
		let latitude = this.props.selectedStore.store.location.coordinates[1];
		let longitude = this.props.selectedStore.store.location.coordinates[0];
		console.log("lat-long>>>", latitude + ">>>>>" + longitude);
		const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
		const latLng = `${latitude},${longitude}`;
		const label = this.props.selectedStore.store.description.trim();
		const url = Platform.select({
			ios: `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`
		});
		Linking.openURL(url);
	}

	onStoreClickHandler = () => {
		this.props.onStoreClick(this.props.selectedStore)
	}

	render() {
		console.log('this.StorDetails.openingTime', this.storeDetails)
		let StartTime = moment(this.props.selectedStore.store.openingTime, "LTS").format('h:mma');
		let EndTime = moment(this.props.selectedStore.store.closingTime, "LTS").format('h:mma');
		let CurrentTime = moment(moment()).format('h:mma');

		let beginningTime = moment(StartTime, 'h:mma');
		let endingTime = moment(EndTime, 'h:mma');
		console.log('beginningTime', StartTime)
		console.log('endingTime', EndTime)
		console.log('openTimeFormat', beginningTime.isBefore(endingTime))
		console.log('closeTimeFormat', endingTime.isBefore(beginningTime))
		let openTimeFormat
		let closeTimeFormat
		if (beginningTime.isBefore(endingTime)) {

			openTimeFormat = 'Open'

		} else {
			// openTimeFormat = moment(this.props.selectedStore.store.openingTime,"LTS").format("HH:mm");
			openTimeFormat = 'Opens' + ' ' + moment(this.props.selectedStore.store.openingTime, "LTS").utcOffset('+05:30').format('LT');
		}

		if (endingTime.isBefore(beginningTime)) {

			closeTimeFormat = 'Closed'

		} else {

			//closeTimeFormat = moment(this.props.selectedStore.store.closingTime,"LTS").format("HH:mm");
			closeTimeFormat = 'Closes' + ' ' + moment(this.props.selectedStore.store.closingTime, "LTS").utcOffset('+05:30').format('LT');
		}
		const { imageURL, retailer, description, address } = this.props.selectedStore.store
		let storeBanner = imageURL && imageURL[0] ? imageURL[0].imageUrl.indexOf('http') > -1 ? imageURL[0].imageUrl : (Constants.imageResBaseUrl + imageURL[0].imageUrl) : Constants.DEFAULT_STORE_IMAGE
		return (

			<View style={styles.container}>

				<View style={styles.storeImageContainer}>
					<ImageBackground
						source={{ uri: storeBanner }}
						style={{
							width: '100%',
							height: Constants.BANNER_HEIGHT,
						}}
						resizeMode='cover'
					>
						<Icon
							name='circle-with-cross'
							color={Constants.DOBO_RED_COLOR}
							size={30}
							style={{ position: 'absolute', right: 0, top: 0, }}
							onPress={this.props.onCancelClicked} />
					</ImageBackground>
				</View>

				<View style={{ flex: 1, backgroundColor: 'white' }}>
					<TouchableWithoutFeedback onPress={this.onStoreClickHandler}>
						<View style={styles.storeInfoContainer}>
							<Image
								source={{ uri: Constants.imageResBaseUrl + retailer.iconURL || Constants.DEFAULT_STORE_ICON }}
								style={{ height: 70, width: 70, borderRadius: 10, marginHorizontal: 5 }}
							/>
							<View style={{ flex: 4, marginHorizontal: '1%' }}>
								<Text numberOfLines={1} style={styles.storeNameText}>
									{description.trim()}
								</Text>
								<Text numberOfLines={3} style={styles.storeInfoText}>
									{(address.address1 || '') + '\n' + (address.address2 || '')}
								</Text>
							</View>
							{/*Commented on DOBO team request*/}
							{/* <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-start' }}>
								<Text style={{ fontSize: 12, fontFamily: Constants.LIST_FONT_FAMILY }}>
									{this.state.value}
								</Text>
								<IconComponent
									style={{ marginHorizontal: '5%' }}
									name={ImageConst["star-rating"]}
									size={12} />
							</View> */}
							<Divider style={{
								width: 1,
								backgroundColor: '#CEDCCE',
								height: '80%',
								marginRight: 5
								//marginVertical: '2%'
							}} />
							<View style={{ flex: 3, marginStart: '1%', }}>
								<View style={{ flex: 1 }}>
									<Text style={styles.storeInfoText1}>
										{openTimeFormat}
									</Text>
									<Text style={styles.storeInfoText1}>
										{closeTimeFormat}
									</Text>
								</View>

								<View style={{ height: 60 }}>
									<Button
										title={Math.round(this.props.selectedStore.distance / 1000) + 'km'}
										onPress={this.onOpenMapHandler}
										buttonStyle={styles.locButton}
										containerStyle={{
											marginEnd: '10%'
										}}
										icon={{
											name: 'map-marker',
											type: 'font-awesome',
											size: 10,
											color: 'white',
										}}
										titleStyle={{ fontSize: 10 }}
									/>
								</View>

							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>

			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		//height: '15%',
		width: Constants.SCREEN_WIDTH,
		flex: 1,
		// backgroundColor: '#fff'
	},
	storeImageContainer: {
		// flex: 3,
		borderTopColor: Constants.DOBO_RED_COLOR,
		borderTopWidth: 2,
		//justifyContent: 'flex-end'
		//marginRight: '5%',
		//marginBottom: '5%'
	},
	storeInfoContainer: {
		flex: 1,
		flexDirection: 'row',
		marginHorizontal: '3%',
		backgroundColor: 'white',
		marginTop: '3%'
	},
	locButton: {
		//justifyContent: 'space-evenly',
		backgroundColor: Constants.DOBO_RED_COLOR,
		borderRadius: 40,
		borderWidth: 1,
		borderColor: '#fff',
		overflow: 'hidden',
		//marginTop: '5%',
		height: Platform.OS === 'ios' ? 30 : '80%'
	},
	storeInfoText: {
		//backgroundColor:'blue',
		fontSize: 10,
		marginTop: '2%',
		fontFamily: Constants.LIST_FONT_FAMILY,
		fontSize: Constants.LIST_FONT_SIZE_ADDRESS,
		color: Constants.BODY_TEXT_COLOR
	},
	storeInfoText1: {
		//backgroundColor:'red',
		fontSize: 10,
		padding: '1%',
		//marginTop: '2%',
		fontFamily: Constants.LIST_FONT_FAMILY,
		fontSize: Constants.LIST_FONT_SIZE_ADDRESS,
		color: Constants.BODY_TEXT_COLOR
	},
	storeNameText: {
		color: Constants.DOBO_GREY_COLOR,
		fontFamily: Constants.LIST_FONT_FAMILY,
		fontSize: Constants.LIST_FONT_HEADER_SIZE,
	}
})

export default StoreQuickView