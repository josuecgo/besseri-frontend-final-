import { Alert, StyleSheet, View } from 'react-native'
import React from 'react'
import CommonStyles from '../../../util/styles/styles';
import {  Heading, ScrollView } from 'native-base';
import { ServiceDetail } from '../../../components/Booking/ServiceDetail';
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal';
import Colors from '../../../util/styles/colors';


export const QuoteScreen = ({ booking, comision,onChange }) => {
  const handleAcceptService = async() => {
    
    onChange('customerAccepted')
   
  };

  const handleRejectService = () => {
    onChange('CANCELADO')
   
  };
  return (
    <View style={styles.body} >
      <ScrollView>
        <Heading size={'md'} >Presupuesto</Heading>
        <ServiceDetail booking={booking} comision={comision} />
       
      </ScrollView>
      <BtnPrincipal text={'Aceptar servicio'}  onPress={handleAcceptService} />
      <BtnPrincipal text={'Rechazar servicio'} backgroundColor={Colors.error} onPress={handleRejectService} />
    </View>
  )
}


const styles = StyleSheet.create({
  body: {
    ...CommonStyles.screenY
  }
})