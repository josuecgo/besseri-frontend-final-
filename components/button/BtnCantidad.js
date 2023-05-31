import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Button, HStack } from 'native-base'
import CommonStyles from '../../util/styles/styles'
import Colors from '../../util/styles/colors'
import { useSelector } from 'react-redux'
import { showToaster } from '../../util/constants'

export const BtnCantidad = ({increaseQuantity, decreaseQuantity,onRemoveFromCart,product}) => {
  
  const quitarProducto = () => {
   
    if (product?.quantity === 1) {
      onRemoveFromCart();
      showToaster('Producto eliminado del carrito')
     return
    }
    decreaseQuantity()
  }
  
  return (
    <HStack alignItems={'center'} style={styles.container} s >
      <Button onPress={quitarProducto} variant={'ghost'} _text={{...CommonStyles.h1,color:Colors.black}} >-</Button>
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