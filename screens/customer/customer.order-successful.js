import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import CommonStyles from '../../util/styles/styles'
import Colors from '../../util/styles/colors'
import { BOTTOM_TAB_CUSTOMER_ROUTES, CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants'
import ModalChildren from '../../components/ModalChildren'
import { Box, Center, Image, VStack } from 'native-base'
import { BtnPrincipal } from '../../components/Customer/BtnPrincipal'

export const OrderSuccessful = (props) => {
    
   

    return (
    <View style={CommonStyles.screenY} >
      
            <View style={{...CommonStyles.flexOneCenter}}>
               
            <ModalChildren showModal={true} handleModal={(e) => {}} >
            <Box style={CommonStyles.modal}  >
              <TouchableOpacity style={styles.btnClose} 
              onPress={() => setShowModal(false)}
              >
                <Image
                source={require('../../assets/images/close.png')}
                style={styles.close}
                alt='close'
                />
              </TouchableOpacity>
              <VStack space={4} >
                <Center mb={10}>
                  <Text style={[CommonStyles.h1,{fontWeight:'bold',marginBottom:10}]} >PAGO REALIZADO</Text>
                  <Text style={CommonStyles.h2} >Tu pago ha sido realizado con éxito.
Revisa en tu zona de pedidos </Text>
                </Center>
                
                  
            
              
                

                <BtnPrincipal
                text={'Aceptar'}
                marginHorizontal={0}
                onPress={() => { props.navigation.replace('CustomerHomeStack',{screen:BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT}) }}
                />
              </VStack>
              
            </Box>
          </ModalChildren>
            </View>
    </View>
  )
}

const styles = StyleSheet.create({
  close:{
    width:30,
    height:30
  },
  btnClose:{
    position:'absolute',
    right:10,
    top:5
  }
})