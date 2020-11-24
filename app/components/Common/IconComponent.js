import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const IconComponent = props => {
    return (
        <View style={{ ...styles.container, ...props.style }}>
            <Image
                style={{ width: props.size, height: props.size }}
                source={props.name}
                resizeMode={props.resizeMode || 'contain'}
            />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center'
    }
})
export default IconComponent;