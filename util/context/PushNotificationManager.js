import React from 'react'
import {View} from 'react-native'



export default class PushNotificationManager extends React.Component {


             
    render() {
        const {children} = this.props;

        return <View style={{flex:1}}>{children}</View>
    }
}