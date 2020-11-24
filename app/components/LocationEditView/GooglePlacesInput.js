import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Constants from '../../services/Constants'
import { Icon } from 'react-native-elements'
import { View } from 'react-native';

class GooglePlacesInput extends React.Component {

    _renderRightButton() {
        return (
            <View style={{ justifyContent: 'center' }}>
                <Icon name="cancel" size={20} color="black" type='material-icons'
                    onPress={console.log('cancel clicked')} />
            </View>
        );
    }

    render() {
        return (

            <GooglePlacesAutocomplete
                placeholder='Search for your locality/city'
                minLength={2} // minimum length of text to search
                autoFocus={true}
                returnKeyType={'search'} // Can be left out for default return key 
                listViewDisplayed={false}    // true/false/undefined
                fetchDetails={true}
                textInputProps={{ clearButtonMode: 'while-editing' }}
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    // console.log(data)
                    // console.log('Details>>>', JSON.stringify(details))
                    this.props.notifyChange(details);
                }
                }
                styles={{
                    container: {
                        zIndex: 10,
                        overflow: 'visible',
                        height: 50,
                        flexGrow: 1,
                        flexShrink: 0,
                        marginTop: 10,
                        marginHorizontal: '5%'
                    },
                    textInputContainer: {
                        borderTopWidth: 0,
                        borderBottomWidth: 1,
                        overflow: 'visible',
                        backgroundColor: 'white',
                        borderColor: 'black',
                        borderRadius: 0,
                    },
                    textInput: {
                        backgroundColor: 'transparent',
                        fontSize: 15,
                        lineHeight: 22.5,
                        paddingBottom: 0,
                        flex: 1
                    },

                }}
                query={{
                    key: Constants.MAPS_API_CALL_KEY,
                    language: 'en',
                    //types: '(address)',
                    components: 'country:in'
                }}

                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={300}
            //renderRightButton={this._renderRightButton}
            //currentLocation={true}
            />
        );
    }
}
export default GooglePlacesInput;