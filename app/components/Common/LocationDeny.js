import React from 'react';
import {
    StyleSheet,
    View,
    Modal,
    Text
} from 'react-native';
import { Button } from 'react-native-elements';
import * as Constants from '../../services/Constants'

const LocationDeny = props => {

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.visible}
        >
            <View style={{ backgroundColor: 'rgba(52, 52, 52, 0.5)', flex: 0.9 }}>
            </View>
            <View style={{ backgroundColor: 'white', flex: 0.2, justifyContent: 'space-around' }}>
                <View style={{ flexDirection: 'column', }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'black', fontSize: 19, fontFamily: Constants.LIST_FONT_FAMILY }}> Location permission required</Text>
                    </View>
                    <View style={styles.buttonDetails}>
                        <Button
                            title='ALLOW LOCATION'
                            buttonStyle={styles.continueButton}
                            containerStyle={{
                                marginVertical: '5%',
                                borderRadius: 30
                            }}
                            titleStyle={{ fontSize: 14, fontFamily: Constants.LIST_FONT_FAMILY }}
                            onPress={() =>
                                props.onAllowLocationPress()
                            }
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    continueButton: {
        borderRadius: 30,
        backgroundColor: Constants.DOBO_RED_COLOR,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        overflow: 'hidden',
    }
});

export default LocationDeny;