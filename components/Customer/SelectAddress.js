import { StyleSheet,  View } from 'react-native'
import React, { useState } from 'react'
import { Box, Button,Text } from 'native-base'
import * as UserInfoActions from '../../util/ReduxStore/Actions/CustomerActions/UserInfoActions';

import { customer_api_urls } from '../../util/api/api_essentials'
import { getUserId, saveAdressCustomer } from '../../util/local-storage/auth_service'
import axios from 'axios'
import { showToaster } from '../../util/constants'
import { useDispatch } from 'react-redux'
import Colors from '../../util/styles/colors';
import CommonStyles from '../../util/styles/styles';
import { useInfoUser } from '../../hooks/useInfoUsers';
import LoaderComponent from '../Loader/Loader.component';

export const SelectAddress = ({address,navigation}) => {
  const {latitude,longitude,address_components,formatted_address,place_id} = address;
  const dispatch = useDispatch()
  const {getUserInfo} = useInfoUser()
  const [isLoading, setIsLoading] = useState(false)

  const setUpLocation = async() => {
    try {
     
      setIsLoading(true)
      const userId = await getUserId();
      if (userId) {
        const apiCall = await axios.post(customer_api_urls.create_address,{
            latitude:latitude,
            longitude:longitude,
            address_components,
            formatted_address,
            place_id,
            userId,
        });
        await getUserInfo()
        navigation.pop();
      } else{

       
        await saveAdressCustomer({
          latitude:latitude,
          longitude:longitude,
          address_components,
          formatted_address,
          place_id,
          userId,
          _id:1
        })

        dispatch(UserInfoActions.addAddressToUser([{
          latitude:latitude,
          longitude:longitude,
          address_components,
          formatted_address,
          place_id,
          userId,
          _id:1
        }]));
        
        setIsLoading(false)

        navigation.goBack();
      }
     
  
    } catch(e) {
      setIsLoading(false)
      
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo - Address');
    //  //console.log(e?.response?.data)
    }
  }
  return (
    <View style={styles.body} >
      <LoaderComponent isVisible={isLoading} />
      <Text>Mi direccion:</Text>
     
      <Box 
      // maxW={deviceWidth * 0.9} 
      rounded="lg" 
      overflow="hidden" 
      borderColor="coolGray.200" 
      borderWidth="1" 
      padding={1}
      marginBottom={2}
      _dark={{
      borderColor: "coolGray.600",
      backgroundColor: Colors.darker
      }}
      _light={{
        backgroundColor: "gray.50"
      }}
      >
        <Text style={{...CommonStyles.h3}} >{address.formatted_address}</Text>
      </Box>


      
      <View style={{alignItems:'center' }} >

        <Button 
        backgroundColor={Colors.primaryColor} 
        size={'lg'} 
        onPress={setUpLocation} 
        width={'100%' }
        >
        Confirmar dirección
        </Button>

      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  body:{
    
    margin:10,
   
  }
})