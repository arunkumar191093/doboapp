import { View } from "react-native";
import React from 'react';
import IconComponent from "./IconComponent";

export function IconWithBadge({ name, size, showBadge }) {
    return (
        <View style={{ width: 24, height: 24, margin: 5 }}>
            <IconComponent name={name} size={size} />
            {showBadge == true && (
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
    );
}