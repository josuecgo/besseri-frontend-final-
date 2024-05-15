import React from 'react';
import { FlatList, StyleSheet,  View } from 'react-native';
import { useSelector } from 'react-redux';
import { ItemCar } from '../../../components/ItemCar';
import { CarsEmpty } from '../../../components/Empty/CarsEmpty';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import { getUserId } from '../../../util/local-storage/auth_service';
import { CUSTOMER_HOME_SCREEN_ROUTES, showAlertLogin,  showToaster } from '../../../util/constants';
import CommonStyles from '../../../util/styles/styles';
import { Text } from 'native-base';
import { adjust } from '../../../util/Dimentions';


export const MyCarsScreen = ({ navigation }) => {

  const { cars,carActive } = useSelector(state => state.user);
 

  

  const crearVehiculo = async () => {
    const id = await getUserId();
  
    if (!id) {
      let goLogin = () => navigation.navigate('AuthStack');
      showAlertLogin(goLogin);
      return;
    }
   
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ADD_MY_CAR)
  };

  const sortedCars = [carActive, ...cars.filter(car => car._id !== carActive._id)];

 
  return (
    <View style={styles.cars}>
      <Text style={styles.txt} >Mantén presionado el vehículo que deseas establecer como activo.</Text>
      <FlatList
        data={sortedCars}
        renderItem={({ item }) => <ItemCar data={item} carActive={carActive} />}
        keyExtractor={item => item._id}
        ListEmptyComponent={<CarsEmpty />}
        showsVerticalScrollIndicator={false}
       
      />

      <BtnPrincipal onPress={crearVehiculo} text={'Agregar nuevo vehiculo'} />

      <View style={{ width: 10, height: 15 }} />
    </View>
  );
};


const styles = StyleSheet.create({
  cars: {
    ...CommonStyles.screenY,
   
  },
  txt:{
    fontSize:adjust(10),
    textAlign:'center'
  },
  label: {
    ...CommonStyles.h2,
  },
});
