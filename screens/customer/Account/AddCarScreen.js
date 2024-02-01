import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import CommonStyles from '../../../util/styles/styles'
import { Box, Button, Heading, Image, Input, ScrollView, Text } from 'native-base'
import { SelectDropDownBtn } from '../../../components/button/SelectDropDownBtn'
import { useSearchStore } from '../../../hooks/useSearchStore'
import { useDispatch, useSelector } from 'react-redux'
import Colors from '../../../util/styles/colors'
import { adjust, deviceWidth } from '../../../util/Dimentions'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import axios from 'axios'
import { customer_api_urls } from '../../../util/api/api_essentials'
import { showToaster } from '../../../util/constants'
import { getUserId } from '../../../util/local-storage/auth_service'
import { resetFiltros } from '../../../util/ReduxStore/Actions/CustomerActions/UserInfoActions'
import { useInfoUser } from '../../../hooks/useInfoUsers'

export const AddCarScreen = (props) => {
  const {
    handleMarca,
    handleModel,
    handleYear
  } = useSearchStore();
  const dispatch = useDispatch()
  const { address,marcas,marcaValue,modelos,modeloValue,yearValue,years }  = useSelector(state => state.user);
  const [km, setKm ] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const {bottom} = useSafeAreaInsets()
  const { getUserInfo } = useInfoUser()

  
  const guardarCar = async () => {
    
    if (!marcaValue || !modeloValue || !yearValue ) {

      showToaster('Faltan campos.');
      return
    }
    setIsLoading(true)
    const newMarca = marcas.find( (el) => el._id === marcaValue);
    const newModel = modelos.find( (el) => el._id === modeloValue);
    
    const userId = await getUserId()    
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
        props.navigation.goBack();
      }
     
     
      resetInputs()
      setIsLoading(false)
    } catch (error) {
      console.log(error);
      showToaster('No hay conexion con el servidor')
      resetInputs()
      setIsLoading(false)
      props.navigation.goBack();
    }
   
    


    
  
  }

  const handleTextChange = text => {
    const regex = /^[0-9]*$/; // Expresión regular que solo permite números
    if (regex.test(text)) {
      setKm(text);
    }
  };

  const resetInputs = () => {
    dispatch(resetFiltros());
    setKm('')
  }

  return (
    <View style={CommonStyles.screenY} >
       <ScrollView>
        <Box style={styles.contentTitle} >
          <Text style={styles.titulo} >Agrega tu auto</Text>
          
        </Box>

       

        <Box marginX={4} marginTop={10} mb={10} >
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

          {
            modeloValue && (
              <>
                <Heading size="xs" mb="3" color={Colors.white}>Año</Heading>
                <SelectDropDownBtn
                  value={yearValue}
                  items={years}
                  onChange={handleYear}
                  years={true}
                />
              </>
            )
          }


            <Heading size="xs" mb="3" color={Colors.white}>Kilometraje</Heading>
           
            <Input
              value={km.toString()}
              keyboardType="numeric"
              onChangeText={handleTextChange}
              borderColor={Colors.lightBorder}
              color={Colors.white}
              size={'2xl'}
              backgroundColor={Colors.lightBlack}
              placeholder='Kilometraje'
            />
        

         
          
          
        </Box>

        <View style={{alignItems:'center',marginVertical:bottom }} >

          <Button
          backgroundColor={Colors.primaryColor} 
          size={'lg'} 
          onPress={guardarCar} 
          width={'90%' }
          disabled={isLoading}
          >
          {isLoading ? 'Creando...' : 'Crear mi auto'}
          </Button>

          </View>
      </ScrollView>

     
    </View>
  )
}




const styles = StyleSheet.create({

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
    marginVertical: 0
  },
  logo: {
    height: deviceWidth * 0.40,
    width: deviceWidth
  },
})