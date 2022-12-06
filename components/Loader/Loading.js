import { StyleSheet,  View } from 'react-native'
import React from 'react'
import SpinKit from 'react-native-spinkit';
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';


export default function Loading() {
  return (
    <View style={CommonStyles.flexOneCenter} >
      <SpinKit
        type="FadingCircleAlt"
        isVisible={true}
        color={Colors.primarySolid}
        size={40}
        />
    </View>
  )
}

const styles = StyleSheet.create({})