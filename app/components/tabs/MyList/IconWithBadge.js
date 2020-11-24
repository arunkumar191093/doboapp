import React, { Component } from 'react'
import { View } from "react-native";
import { connect } from 'react-redux';
import IconComponent from '../../Common/IconComponent';


class IconWithBadge extends Component {
    render() {

        return (
            <View style={{ width: 24, height: 24, margin: 5 }}>
                <IconComponent size={this.props.size} name={this.props.name} />
                {this.props.showBadge == true && (
                    <View
                        style={{
                            // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
                            position: 'absolute',
                            right: -6,
                            top: -3,
                            backgroundColor: 'red',
                            borderRadius: 6,
                            width: 12,
                            height: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {/* <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                            {badgeCount}
                        </Text> */}
                    </View>
                )}
            </View>
        )
    }
}
const mapStateToProps = state => ({
    showBadge: state.like.showBadge
});


export default connect(mapStateToProps, null)(IconWithBadge)