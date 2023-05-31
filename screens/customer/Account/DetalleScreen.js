import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MyCarActive } from '../../../components/Customer/MyCarActive';
import { deviceHeight, deviceWidth } from '../../../util/Dimentions';
import Colors from '../../../util/styles/colors';
import { Box, Center, HStack, Image, VStack } from 'native-base';
import AddressFormatted from '../../../components/AddressFormatted';
import CommonStyles from '../../../util/styles/styles';
import moment from 'moment';
import { moneda } from '../../../util/Moneda';
import { CardService } from '../../../components/Services/CardService';
import CardServicio from '../../../components/Detalle/CardServicio';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants';

export const DetalleScreen = ({ route,navigation }) => {

  const data = route.params;

  console.log(data);
  const goSeguimiento = () => {
    // 
    let status;
    switch (data.type) {
      case 'refaccion':
        status = {
          status : data.order_status,
          status_code : data.order_status_code,
          type:data.type
        }
        break;       
      default:
        status = {
          status : data.status,
          status_code : data.status_code,
          type:data.type
        }
        break;
    }
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SEGUIMIENTO,status )
  }

  return (
    <ScrollView contentContainerStyle={styles.container} >
      <MyCarActive />
      <Center>
        <Image
          source={require('../../../assets/images/car_home.png')}
          alt='car'
          style={styles.img}
        />
      </Center>

      <Box rounded={'lg'} borderWidth={'1px'} borderColor={Colors.white} padding={'10px'}>
        <CardServicio data={data} />
      </Box>

      <BtnPrincipal 
      text={'Ver seguimiento'}
      onPress={goSeguimiento} 
      backgroundColor={Colors.seguimiento} 
      />

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: deviceHeight,
    backgroundColor: Colors.bgColor,
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  img: {
    height: deviceWidth * 0.45,
    width: deviceWidth * 0.70,
    resizeMode: 'cover'
  },
 
})