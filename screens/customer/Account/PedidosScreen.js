import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import CommonStyles from '../../../util/styles/styles'
import { useInfoUser } from '../../../hooks/useInfoUsers';
import { useSelector } from 'react-redux';
import { ItemPedidos } from '../../../components/ItemPedidos';
import Loading from '../../../components/Loader/Loading';
import { EmptyOrders } from '../../../components/Customer/EmptyOrders';

export const PedidosScreen = ({navigation}) => {
  const {getPedidosUser} = useInfoUser();

  const {orders,isLoading} = useSelector(state => state.pedidos)

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
       
        return (
         <ItemPedidos item={item} navigation={navigation} />
        )
      }}
      key={(item) => item?._id}
      ListEmptyComponent={isLoading ? <Loading/> :<EmptyOrders navigation={navigation} />}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  pedidos:{
    ...CommonStyles.screenY
  }
})