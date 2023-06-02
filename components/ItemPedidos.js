import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Box, HStack, VStack } from 'native-base';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
import { adjust } from '../util/Dimentions';
import AddressFormatted from './AddressFormatted';
import moment from 'moment';
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../util/constants';

export const ItemPedidos = ({ item,navigation }) => {

  // if (item.type === 'refaccion') {
  //   console.log(item.ordered_on);
  // }
  const goDetalle = (data) => {
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.DETALLE,data)
  }

  
  return (
    <Box backgroundColor={Colors.white} style={styles.card} rounded={'lg'} >
      <TouchableOpacity
      onPress={()=> goDetalle(item)}
      >
        {
          item.type === 'refaccion' && (
            <VStack space={2} >
              <HStack justifyContent={'space-between'} >
                <Box backgroundColor={Colors.bgColor} rounded={'lg'} py={'8px'} px={'5px'} width={'40%'} alignItems={'center'} >
                  <Text style={styles.type} >{item.type}</Text>
                </Box>

                <Text style={styles.plan} >Productos</Text>
              </HStack>
              <AddressFormatted address={item?.store?.location?.formatted_address} color={Colors.bgColor} />

              <HStack space={12} >
                <VStack>
                  <Text style={styles.txt} >Dia:</Text>
                  <Text style={styles.txt}>Hora:</Text>
                </VStack>
                <VStack>

                  <Text style={styles.txt}>{moment(item.ordered_on).format('DD')} de {moment(item.ordered_on).format('MMMM')} del {moment(item.ordered_on).format('YYYY')} </Text>
                  <Text style={styles.txt}>{moment(item.ordered_on).format('HH:mm')}</Text>
                </VStack>

              </HStack>
            </VStack>

          )
        }
        {
          item.type === 'servicio' && (
            <VStack space={2} >
              <HStack justifyContent={'space-between'} >
                <Box backgroundColor={Colors.bgColor} rounded={'lg'} py={'8px'} px={'5px'} width={'40%'} alignItems={'center'} >
                  <Text style={styles.type} >{item.type}</Text>
                </Box>

                <Text style={styles.plan} >{item?.serviceId?.type_services?.name} </Text>
              </HStack>
              <AddressFormatted address={item?.businessId?.location?.formatted_address} color={Colors.bgColor} />
              <HStack space={12} >
                <VStack>
                  <Text style={styles.txt} >Dia:</Text>
                  <Text style={styles.txt}>Hora:</Text>
                </VStack>
                <VStack>

                  <Text style={styles.txt}>{moment(item.startDate).format('DD')} de {moment(item.startDate).format('MMMM')} del {moment(item.startDate).format('YYYY')} </Text>
                  <Text style={styles.txt}>{moment(item.startDate).format('HH:mm')}</Text>
                </VStack>

              </HStack>



            </VStack>
          )
        }
        {
          item.type === 'lavado' && (
            <VStack space={2} >
            <HStack justifyContent={'space-between'} >
              <Box backgroundColor={Colors.bgColor} rounded={'lg'} py={'8px'} px={'5px'} width={'40%'} alignItems={'center'} >
                <Text style={styles.type} >{item.type}</Text>
              </Box>

              <Text style={styles.plan} >{item?.serviceId?.type_services?.name} </Text>
            </HStack>
            <AddressFormatted address={item?.businessId?.location?.formatted_address} color={Colors.bgColor} />
            <HStack space={12} >
              <VStack>
                <Text style={styles.txt} >Dia:</Text>
                <Text style={styles.txt}>Hora:</Text>
              </VStack>
              <VStack>

                <Text style={styles.txt}>{moment(item.startDate).format('DD')} de {moment(item.startDate).format('MMMM')} del {moment(item.startDate).format('YYYY')} </Text>
                <Text style={styles.txt}>{moment(item.startDate).format('HH:mm')}</Text>
              </VStack>

            </HStack>



          </VStack>
          )
        }
      </TouchableOpacity>



    </Box>
  )
}



const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10
  },
  type: {
    textTransform: 'uppercase',
    fontFamily: 'Good Times',
    ...CommonStyles.h2
  },
  plan: { fontSize: adjust(18), color: Colors.bgColor, fontWeight: 'bold' },
  txt: {
    fontWeight: 'bold'
  }
})