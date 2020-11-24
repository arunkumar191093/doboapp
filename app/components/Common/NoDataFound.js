import React from 'react'
import { StyleSheet, Text } from 'react-native';
import * as Constants from '../../services/Constants';

const NoDataFound = ({ message }) => (
    <Text style={styles.message}>
        {message}
    </Text>
)

const styles = StyleSheet.create({
    message: {
        fontSize: 20,
        fontFamily: Constants.BOLD_FONT_FAMILY
    }
});

export default NoDataFound

