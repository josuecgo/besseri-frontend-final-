import {  Platform, StyleSheet, Text,  View } from 'react-native'
import React, { useContext } from 'react'

import Colors from '../../../util/styles/colors'
import CommonStyles from '../../../util/styles/styles';
import { adjust, deviceHeight, deviceWidth } from '../../../util/Dimentions';
import { Box, Button,  Heading, Image } from "native-base";
import { ScrollView } from 'native-base';
import { ProductContext } from '../../../util/context/Product/ProductContext';
import { useSearchStore } from '../../../hooks/useSearchStore';
import { getUserId, saveCarActive } from '../../../util/local-storage/auth_service';
import { showToaster } from '../../../util/constants';
import { api_statuses, customer_api_urls } from '../../../util/api/api_essentials';
import axios from 'axios';
import { useEffect } from 'react';
import { ItemCar } from '../../../components/ItemCar';
import { ThinlineSeparator } from '../../../components/CommonComponents';
import { HeaderTitle } from '../../../components/Customer/HeaderTitle';
import { SelectDropDownBtn } from '../../../components/button/SelectDropDownBtn';
import { useDispatch, useSelector } from 'react-redux';
import { addCarActiveToUser, addCarsToUser } from '../../../util/ReduxStore/Actions/CustomerActions/UserInfoActions';

export const CreateCarScreen = (props) => {

  const {
    handleMarca,
    handleModel,
    handleYear
  } = useSearchStore();
  const dispatch = useDispatch()
  const { address,marcas,marcaValue,modelos,modeloValue,yearValue,years }  = useSelector(state => state.user);

  

  const guardarCar = async () => {
    if (!marcaValue || !modeloValue || !yearValue ) {

      showToaster('Faltan campos.');
      return
    }
    const newMarca = marcas.find( (el) => el._id === marcaValue);
    const newModel = modelos.find( (el) => el._id === modeloValue);


    await saveCarActive({
      maker: newMarca,
      model:newModel,
      year:yearValue
    })

    dispatch(addCarActiveToUser({
      maker: newMarca,
      model:newModel,
      year:yearValue
    }));

   
    


    props.navigation.navigate('CustomerHomeStack');
  
  }



 



 
  return (
    <View style={styles.garage} >

      <HeaderTitle
        titulo={'Mi auto'}
        nav={props.navigation.goBack}
      />

      <ScrollView>
        <Box style={styles.contentTitle} >
          <Text style={styles.titulo} >Déjanos encargarnos </Text>
          <Text style={styles.subtitulo} >de tu auto</Text>
        </Box>

        <Image
          source={require('../../../assets/images/frontCar.png')}
          alt='logo'
          style={styles.logo}
          resizeMode='cover'
        />

        <Box marginX={4} marginTop={10} >
          <Heading size="xs" mb="3" color={Colors.white}>Marca de vehículo</Heading>
          <SelectDropDownBtn
            items={marcas}
            onChange={handleMarca}
          />

          <Heading size="xs" mb="3" color={Colors.white}>Modelo</Heading>
          <SelectDropDownBtn
            items={modelos}
            onChange={handleModel}
          />

          <Heading size="xs" mb="3" color={Colors.white}>Año</Heading>
          <SelectDropDownBtn
            items={years}
            onChange={handleYear}
            years={true}
          />

          <Heading size="xs" mb="3" color={Colors.white}>Dirección</Heading>
          <Box
            rounded={'lg'}
            borderColor={Colors.lightBorder}
            backgroundColor={Colors.lightBlack}
            paddingX={3}
            paddingY={2}
            mb="3" 
          >
            <Text style={{color:Colors.white}} >{address?.formatted_address}</Text>
          </Box>
          
          
        </Box>
      </ScrollView>

      <View style={{alignItems:'center' }} >

        <Button 
        backgroundColor={Colors.primaryColor} 
        size={'lg'} 
        onPress={guardarCar} 
        width={'90%' }
        >
        Crear mi auto
        </Button>

      </View>
      



    </View>
  )
}





const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: { ...CommonStyles.fontFamily, color: Colors.white, fontSize: 20, position: 'absolute' },
  box: {
    marginHorizontal: 10,
    paddingHorizontal: 5,
    paddingVertical: 5
  },
  garage: {
    backgroundColor: Colors.bgColor,
    flex: 1
  },
  titulo: {
    color: Colors.white,
    fontSize: adjust(18)
  },
  subtitulo: {
    color: Colors.white,
    fontSize: adjust(20),
    fontWeight: 'bold'
  },
  contentTitle: {
    marginHorizontal: 10,
    marginVertical: 15
  },
  logo: {
    height: deviceWidth * 0.50,
    width: deviceWidth
  },
})