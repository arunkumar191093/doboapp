import React, { Component } from 'react'
import { View,Text } from 'react-native';
import { connect } from 'react-redux';

function VoucherBadge (props) {
    console.log('props.item',props.giftCount)
    return (
      props.giftCount > 0 ?
      <View style={{ position: 'absolute', top: 4, backgroundColor: 'red', borderRadius: 9, width: 19, height: 18, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white',fontSize:12 }}>{props.giftCount}</Text>
      </View> 
      :null
    )
  }

const mapStateToProps = state => ({
  giftCount: state.countGift.giftCount,
});

export default connect(mapStateToProps)(VoucherBadge)