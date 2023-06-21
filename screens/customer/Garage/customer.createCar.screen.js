import {  Platform, StyleSheet, Text,  View } from 'react-native'
import React, { useContext, useState } from 'react'

import Colors from '../../../util/styles/colors'
import CommonStyles from '../../../util/styles/styles';
import { adjust, deviceHeight, deviceWidth } from '../../../util/Dimentions';
import { Box, Button,  Heading, Image, Input } from "native-base";
import { ScrollView } from 'native-base';
import { ProductContext } from '../../../util/context/Product/ProductContext';
import { useSearchStore } from '../../../hooks/useSearchStore';
import { getUser, getUserId, saveCarActive } from '../../../util/local-storage/auth_service';
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
  const { address,marcas,marcaValue,modelos,modeloValue,yearValue,years,addresses }  = useSelector(state => state.user);
  const [km, setKm ] = useState('')
  
  console.log({addresses});

  const guardarCar = async () => {
    const user = await getUser();
    if (!marcaValue || !modeloValue || !yearValue ) {

      showToaster('Faltan campos.');
      return
    }
    const newMarca = marcas.find( (el) => el._id === marcaValue);
    const newModel = modelos.find( (el) => el._id === modeloValue);
    if (!user) {
     
  
  
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
    }
    
    try {
     
      const data = {
        userId,
        maker: newMarca,
        model: newModel,
        type: newModel?.type?._id,
        year: yearValue,
        km,
      };
      const apiCall = await axios.post(`${customer_api_urls.create_car}`, data);
      if (apiCall.data.success) {
        await getUserInfo();
        showToaster(apiCall?.data?.message);
      }
      resetFiltros();
      setKm('');
      setShowModal(false);
      setRefreshKey(refreshKey + 1);
    } catch (error) {
      
    }
   
    


    props.navigation.navigate('CustomerHomeStack');
  
  }

  const handleTextChange = text => {
    const regex = /^[0-9]*$/; // Expresión regular que solo permite números
    if (regex.test(text)) {
      setKm(text);
    }
  };

 



 
  return (
    <View style={styles.garage} >

    

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
            value={marcaValue}
          />

          <Heading size="xs" mb="3" color={Colors.white}>Modelo</Heading>
          <SelectDropDownBtn
            items={modelos}
            onChange={handleModel}
            value={modeloValue}
          />

          <Heading size="xs" mb="3" color={Colors.white}>Año</Heading>
          <SelectDropDownBtn
            items={years}
            onChange={handleYear}
            years={true}
            value={yearValue}
          />


            <Heading size="xs" mb="3" color={Colors.white}>kilometraje</Heading>
           
            <Input
              value={km.toString()}
              keyboardType="numeric"
              onChangeText={handleTextChange}
              borderColor={Colors.lightBorder}
              color={Colors.white}
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
   ...CommonStyles.screenY
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