import { View, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CommonStyles from '../../../util/styles/styles'
import { Text, Box, Image, HStack, Heading } from 'native-base'
import { base_url, customer_api_urls } from '../../../util/api/api_essentials'
import { deviceWidth } from '../../../util/Dimentions'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants'
import { ItemServiceDetail } from '../../../components/Services/ItemServiceDetail'
import axios from 'axios'
import { CardServiceFeedback } from '../../../components/Feedback/CardServiceFeedback'

export const ServiceDetailsScreen = ({ route, navigation }) => {
  
  const [feedback, setFeedback] = useState([]);
  const { service, address, car,type } = route.params;

  
  const getFeedbacks = async() => {
    try {
      const apiCall = await axios.get(`${customer_api_urls.get_service_feedback}/${service?._id}`);

       setFeedback(apiCall?.data?.data)
      
     } catch(e) {
        //  showToaster('No se pudo traer informacion del vendedor')
        
         
     }
  }

  const goReviews = () => {
    if (feedback.length === 0) {
      return
    }
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SERVICE_REVIEWS,feedback)
  }

  useEffect(() => {
    getFeedbacks()
  }, [])
  
 
  return (
    <View style={styles.container} >
      <ScrollView showsVerticalScrollIndicator={false} >
        <Box alignItems={'center'} >
         
          <Image
            source={{
              uri: `${base_url}/${service?.business_id.logo}`
            }}
            alt="image"
            rounded={'2xl'}
            // marginTop={3}
            resizeMode='stretch'
            style={styles.img}
          />
        
        </Box>

        <Box marginX={'19px'} mt={4} >
          <Text style={CommonStyles.h1} >Agenda y da seguimiento a tus citas</Text>


        </Box>
        <BtnPrincipal
          text={'Agendar servicios'}

          onPress={() => navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.APPOINTMENT_SERVICES, {
            service: service,
            address,
            car,
            type
          })}
        />

        <Box flexDirection={'row'} space={2} alignItems={'center'} marginX={'19px'} mb={'10px'} >
          <Image
            source={require('../../../assets/images/13.png')}
            alt='dirrecion'
            style={styles.icon}
          />
          <Box maxWidth={295} flexWrap={'wrap'} flexDirection={'row'}>
            <Text style={CommonStyles.h3}>
              {service?.business_id?.location?.formatted_address}
            </Text>
          </Box>
        </Box>

        
        <HStack justifyContent="flex-end" marginX={'19px'} >
          <Text style={CommonStyles.h2} >10 km de tu ubicación</Text>
        </HStack>

      
        <ItemServiceDetail service={service} />


      {
        feedback.length > 0 && (
          <CardServiceFeedback feedback={feedback} onPress={goReviews} />
        )
        
      }
         
        
      </ScrollView>


    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    ...CommonStyles.screenY
  },
  img: {
    width: deviceWidth * 0.9,
    height: deviceWidth * 0.70
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 5
  }
})
