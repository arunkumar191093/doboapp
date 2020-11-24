import React, { useRef, useEffect } from "react";
import { Animated, Text, View, StyleSheet } from 'react-native';
import * as Constants from '../../services/Constants';
import IconComponent from '../Common/IconComponent';
import { ImageConst } from '../../services/ImageConstants';

const FlashMessage = ({
  heading = '',
  content = '',
  timeOut = 5000,
  duration = 500,
  onAnimateComplete = () => { }
}) => {
  const fadeAnim = new Animated.Value(0)

  useEffect(() => {
    fadeIn();
    //this is to fadeout the message after defined time
    setTimeout(() => fadeOut(), timeOut)
  }, [])

  const fadeIn = () => {
    // Will change fadeAnim value to 1
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: duration
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: duration
    }).start(onAnimateComplete);
  };


  return (
    <View style={styles.container}>
      <View style={styles.overlay}></View>
      <Animated.View
        style={[
          styles.fadingContainer
        ]}
      >
        <View style={styles.logoContainer}>
          <IconComponent size={60} name={ImageConst['home-active']} />
        </View>
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.content}>{content}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    color: '#fff',
    fontFamily: Constants.SEMI_BOLD_FONT_FAMILY,
    textAlign: 'center',
    marginTop: 12
  },
  content: {
    fontSize: 12,
    color: '#fff',
    fontFamily: Constants.LIST_FONT_FAMILY,
    textAlign: 'center'
  },
  logoContainer: {
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 50,
    padding: 4,
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: '100%',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 10
  },
  fadingContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default FlashMessage;
