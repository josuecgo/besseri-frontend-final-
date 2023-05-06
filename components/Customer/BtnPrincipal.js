import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from 'native-base'
import Colors from '../../util/styles/colors'
import CommonStyles from '../../util/styles/styles'

export const BtnPrincipal = ({text,onPress}) => {
  return (
    <View style={styles.principal} >
      <Button 
      onPress={onPress}
      size={'lg'} 
      backgroundColor={Colors.primaryColor} 
      _text={{
        // fontWeight:'semibold'
        ...CommonStyles.h4
      }}
      >
        {text}
      </Button>
    </View>
  )
}



const styles = StyleSheet.create({
  principal:{
    marginVertical:10,
    marginHorizontal:20
  },
  btn:{
    color:'red'
  }
})