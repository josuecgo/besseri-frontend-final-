import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import CommonStyles from '../../../util/styles/styles'
import { useInfoUser } from '../../../hooks/useInfoUsers';
import { useSelector } from 'react-redux';

export const PedidosScreen = () => {
  const {getPedidosUser} = useInfoUser();

  const {orders} = useSelector(state => state.pedidos)

  // console.log(orders);

  useEffect(() => {
    getPedidosUser()
  }, []);


  return (
    <View style={styles.pedidos} >
      <Text>PedidosScreen</Text>
      <FlatList
      data={orders}
      renderItem={({item}) => {
        console.log(item);
        return (
          <Text style={{...CommonStyles.h1}} >{item.status}</Text>
        )
      }}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  pedidos:{
    ...CommonStyles.screenY
  }
})