import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import CommonStyles from '../../../util/styles/styles'
import { useInfoUser } from '../../../hooks/useInfoUsers';
import { useSelector } from 'react-redux';
import { ItemPedidos } from '../../../components/ItemPedidos';
import Loading from '../../../components/Loader/Loading';
import { EmptyOrders } from '../../../components/Customer/EmptyOrders';
import { getUserId } from '../../../util/local-storage/auth_service';
import { MAIN_ROUTES, showAlertLogin } from '../../../util/constants';
import { useIsFocused } from '@react-navigation/native';

export const PedidosScreen = ({navigation}) => {
  const {getPedidosUser} = useInfoUser();
  const isFocus = useIsFocused()
  const {orders,isLoading} = useSelector(state => state.pedidos)

 const isLogin = async() => {
  const id = await  getUserId();
  if (!id) {
    showAlertLogin(goLogin,goCancel)
    return 
  }
  getPedidosUser()
 }


 const goLogin = () => {
  navigation.navigate(MAIN_ROUTES.AUTH_STACK)

}

const goCancel = () => {
  navigation.goBack()
}

  useEffect(() => {
    if (isFocus) {
      isLogin()
    }
    
  }, [isFocus]);


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