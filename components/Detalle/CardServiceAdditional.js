import { Pressable, StyleSheet, View } from 'react-native'
import React from 'react'
import AddressFormatted from '../AddressFormatted'
import { Box, Divider, HStack, Text, VStack } from 'native-base'
import CommonStyles from '../../util/styles/styles'
import moment from 'moment'
import { comisionMoneda, moneda } from '../../util/Moneda'
import OrderProductItemComponent from '../vendor-shared/order-product-item.component'
import { ProductContext } from '../../util/context/Product/ProductContext'
import { useContext } from 'react'
import Colors from '../../util/styles/colors'
import { deviceWidth } from '../../util/Dimentions'




const CardServiceAdditional = ({ data, comision, aceptedAdditional }) => {



  if (data?.additionalServices?.length === 0) return null


  if (data.type === 'refaccion') return null






  return (
    <>
      <Box my={5} rounded={'lg'} borderWidth={'1px'} borderColor={Colors.white} padding={'10px'}>
        <Text>Servicios adicionales</Text>
        {
          data?.additionalServices?.map(item => {

            const { serviceId } = item;

            return (
              <VStack key={item._id} >
                <Text bold isTruncated numberOfLines={1} >{serviceId?.type_services?.name}</Text>
                 
                <HStack
                  justifyContent={'space-between'}
                  alignItems={'baseline'}
                >
                 <Text bold >{comisionMoneda(serviceId?.price, comision)}</Text>


                 {
                  item.status_code === 'EN_PROCESO' ? (
                    <HStack  space={8}>
                      <Pressable onPress={() => aceptedAdditional(item,'RECHAZADO')} >
                        <Text color={Colors.alertRed} bold >Rechazar</Text>
                      </Pressable>
                      <Pressable onPress={() => aceptedAdditional(item,'ACEPTADO')} >
                        <Text color={Colors.primaryColor} bold >Aceptar</Text>
                      </Pressable>
                    </HStack>
                  ) : (
                    <Text bold >Aceptado</Text>
                  )
                }

                </HStack>
                
              </VStack>



            )
          })
        }
      </Box>
    </>
  )
}

export default CardServiceAdditional

const styles = StyleSheet.create({
  txt: {
    fontWeight: 'bold',
    ...CommonStyles.h2
  }
})