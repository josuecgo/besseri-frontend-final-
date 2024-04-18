import {  StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import Colors from '../../../util/styles/colors';
import ButtonComponent from '../../../components/button/button.component';
import { showToaster } from '../../../util/constants';
import LoaderComponent from '../../../components/Loader/Loader.component';
import { customer_api_urls } from '../../../util/api/api_essentials';
import axios from 'axios';


import { Heading, TextArea } from 'native-base';
import { AirbnbRating } from 'react-native-ratings';


export const ServiceFormFeedback = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false)
  
  const { order,  } = route.params;
  const [valueInputs, setValueInputs] = useState({
    rating: 3,
    comments: ''
  })









  const enviarValoracion = async () => {
    try {
      setIsLoading(true)
      await axios.post(`${customer_api_urls.create_service_feedback}/${order.serviceId._id}`,
        { 
          ...valueInputs,
          bussinesId:order.businessId._id,
          customer:order.booked_by_id
        }
      );


      closeRating()
     
      setIsLoading(false)

      await navigation.goBack()
      navigation.goBack()

    } catch (error) {
      
      setIsLoading(false)
      showToaster('No hay conexion con el servidor.')
    }

  }

  const closeRating = async() => {
    try {
      
      await axios.post(`${customer_api_urls.close_service_feedback}/${order._id}`);
   
    } catch (error) {
      console.log(error,'error close rating');
    }
  }





  return (
<View style={styles.body}>
  <HeaderTitle
    nav={() => navigation.goBack()}
    titulo={'Califica el servicio'}
  />

  <View style={{ flex: 1 }}>
    <View style={styles.cardCenter}>
      <Heading mt={5} size="xs">Califica el servicio:</Heading>
      <AirbnbRating
        showRating={false}
        count={5}
        defaultRating={valueInputs.rating}
        starContainerStyle={styles.starContainer}
        onFinishRating={(rating) => setValueInputs({
          ...valueInputs,
          rating
        })}
        size={20}
      />

      <Heading mt={5} size="xs">Comentarios</Heading>
      <TextArea
        placeholder='Coméntanos tu experiencia del servicio.'
        onChangeText={(text) =>  setValueInputs({
          ...valueInputs,
          comments:text
        })}
      />
    </View>

    <View style={styles.buttonContainer}>
      <ButtonComponent
        handlePress={enviarValoracion}
        borderRadius={100}
        buttonText={'Enviar valoración'}
        colorB={Colors.terciarySolid}
        margin={10}
        padding={5}
        disabled={isLoading}
      />
    </View>
  </View>

  <LoaderComponent isVisible={isLoading} />
</View>

  )
}



const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: Colors.bgColor
  },
  starContainer: {
    alignSelf: "flex-start",
    marginHorizontal: 3,
    marginVertical: 5,
  },
  cardCenter: {
    marginVertical: 10,
    justifyContent: 'space-around'
  },
  buttonContainer: {
    flex:1,
    alignSelf: 'stretch', // Para que el contenedor del botón se extienda horizontalmente
    justifyContent: 'flex-end', // Para alinear el botón al fondo
    marginHorizontal: 10, // Si necesitas margen horizontal
    marginBottom: 10, // Si necesitas margen inferior
  },
})