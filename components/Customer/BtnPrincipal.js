import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from 'native-base'
import Colors from '../../util/styles/colors'
import CommonStyles from '../../util/styles/styles'
import { adjust } from '../../util/Dimentions'

export const BtnPrincipal = ({ text, onPress, backgroundColor = Colors.primaryColor }) => {

  return (
    <View style={styles.principal} >
      <Button
        onPress={onPress}
        // size={'md'} 
        backgroundColor={backgroundColor}
        _text={{
          fontWeight: '700',
          fontSize: '18px',
          color: Colors.white,
          // fontFamily:'Arial',
          fontStyle:'normal'
        }}

      >
        {text}
      </Button>
    </View>
  )
}



const styles = StyleSheet.create({
  principal: {
    marginVertical: 10,
    marginHorizontal: 20
  },
  btn: {
    color: 'red'
  }
})