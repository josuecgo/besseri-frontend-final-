import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../../util/styles/colors'
import { useSelector } from 'react-redux'
import { ItemCar } from '../../../components/ItemCar'
import { CarsEmpty } from '../../../components/Empty/CarsEmpty'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import { getUserId } from '../../../util/local-storage/auth_service'
import { showAlertLogin, showAlertMsg, showToaster } from '../../../util/constants'

export const MyCarsScreen = ({navigation}) => {

  const { cars } = useSelector( state => state.user );

 
  const crearVehiculo = async() => {
    const id = await getUserId()
    if (!id) {
      let goLogin = () =>  navigation.navigate('AuthStack')
     

      showAlertLogin(goLogin)
    }
    
  }

  return (
    <View style={styles.cars} >
      <FlatList
      data={cars}
      renderItem={({item}) => <ItemCar data={item} />}
      keyExtractor={item => item._id}
      ListEmptyComponent={<CarsEmpty/>}
      />

      <BtnPrincipal 
      onPress={crearVehiculo}
      text={'Agregar nuevo vehiculo'} 
      />
    </View>
  )
}



const styles = StyleSheet.create({
  cars:{
    backgroundColor:Colors.bgColor,
    flex:1,
    paddingVertical:20
  }
})