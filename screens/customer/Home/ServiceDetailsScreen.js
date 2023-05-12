import { View, StyleSheet} from 'react-native'
import React from 'react'
import CommonStyles from '../../../util/styles/styles'
import { Text, Box, Image, HStack, Heading } from 'native-base'
import { base_url } from '../../../util/api/api_essentials'
import { deviceWidth } from '../../../util/Dimentions'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'

export const ServiceDetailsScreen = ({route}) => {
  console.log(route.params.business_id);
  const {service} = route.params;
  return (
    <View style={styles.container} >
      <Box alignItems={'center'} >
        {/* <AspectRatio w="90%" ratio={16/16} rounded={'lg'} > */}
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
        {/* </AspectRatio> */}
  
      </Box>
      
      <Box marginX={'19px'} mt={4} >
        <Text style={CommonStyles.h1} >Agenda y da seguimiento a tus citas</Text>

        
      </Box>
      <BtnPrincipal
        text={'Agendar servicios'}
      />

      <Box flexDirection={'row'}  space={2} alignItems={'center'} marginX={'19px'} >
        <Image
        source={require('../../../assets/images/13.png')}
        alt='dirrecion'
        style={styles.icon}
        />
       <Box maxWidth={300} flexWrap={'wrap'} flexDirection={'row'}>
          <Text style={CommonStyles.h3}>
            {service?.business_id?.location?.formatted_address}
          </Text>
        </Box>
      </Box>
    </View>
  )
}


const styles = StyleSheet.create({
  container:{
    ...CommonStyles.screenY
  },
  img:{
    width:deviceWidth * 0.9,
    height:deviceWidth * 0.70
  },
  icon:{
    width:30,
    height:30,
    resizeMode:'contain',
    marginRight:5
  }
})
 