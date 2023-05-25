import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Button, HStack } from 'native-base'
import CommonStyles from '../../util/styles/styles'
import Colors from '../../util/styles/colors'
import { useSelector } from 'react-redux'

export const BtnCantidad = ({increaseQuantity, decreaseQuantity}) => {
  const product = useSelector(state => state.cart.productDetail);
  
  console.log( product?.quantity);
  
  return (
    <HStack alignItems={'center'} style={styles.container} s >
      <Button onPress={decreaseQuantity} variant={'ghost'} _text={{...CommonStyles.h1,color:Colors.black}} >-</Button>
      <Text>{product?.quantity ? product?.quantity : 1 }</Text>
      <Button  onPress={increaseQuantity} variant={'ghost'} _text={{...CommonStyles.h1,color:Colors.black}} >+</Button>
    </HStack>
  )
}



const styles = StyleSheet.create({
  container:{
    backgroundColor:Colors.bgGray,
    borderRadius:10,
    paddingHorizontal:20
  }
})