import React from 'react';
import { FlatList, StyleSheet,  View } from 'react-native';
import { useSelector } from 'react-redux';
import { ItemCar } from '../../../components/ItemCar';
import { CarsEmpty } from '../../../components/Empty/CarsEmpty';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import { getUserId } from '../../../util/local-storage/auth_service';
import { CUSTOMER_HOME_SCREEN_ROUTES, showAlertLogin,  showToaster } from '../../../util/constants';
import CommonStyles from '../../../util/styles/styles';


export const MyCarsScreen = ({ navigation }) => {

  const { cars } = useSelector(state => state.user);

  const crearVehiculo = async () => {
    const id = await getUserId();
  
    if (!id) {
      let goLogin = () => navigation.navigate('AuthStack');
      showAlertLogin(goLogin);
      return;
    }
   
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ADD_MY_CAR)
  };

 
  return (
    <View style={styles.cars}>
      <FlatList
        data={cars}
        renderItem={({ item }) => <ItemCar data={item} />}
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
  label: {
    ...CommonStyles.h2,
  },
});
