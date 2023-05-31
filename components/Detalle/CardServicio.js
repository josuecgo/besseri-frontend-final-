import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AddressFormatted from '../AddressFormatted'
import { Divider, HStack, VStack } from 'native-base'
import CommonStyles from '../../util/styles/styles'
import moment from 'moment'
import { moneda } from '../../util/Moneda'
import OrderProductItemComponent from '../vendor-shared/order-product-item.component'
import { ProductContext } from '../../util/context/Product/ProductContext'
import { useContext } from 'react'

const CardServicio = ({data}) => {
  const {
    comision
} = useContext(ProductContext)
  if(data.type === 'refaccion') return (
    <>
    <AddressFormatted address={data.store.location.formatted_address} />
    <VStack  space={3} marginTop={'10px'} >
      <Text style={{ ...CommonStyles.h2 }} >Servicio:</Text>
      <Text style={{ ...CommonStyles.h3,textTransform:'uppercase' }} >{data.type}</Text>


      <HStack alignItems={'center'} justifyContent={'space-between'} >
        <Text style={{...CommonStyles.h2}} >Productos:</Text>
        <Text style={{...CommonStyles.h2}} >Cantidad</Text>
        <Text style={{...CommonStyles.h2}} >Precio</Text>
        
      </HStack>

    
          {
                data?.products.map((item) => (
                  <View key={item._id} >
                    <OrderProductItemComponent
                      productName={item?.name}
                      productPrice={item?.price}
                      qtyOrdered={item?.quantity}
                      img={item?.productImg}
                      comision={comision}
                    />
                
                    <Divider/>
                  </View>
                  
                ))
              }
        
     

      <HStack alignItems={'center'} justifyContent={'space-between'} >
        <Text style={{...CommonStyles.h2}} >Código:</Text>
        <Text style={{...CommonStyles.h2}} >{data?.delivery_security_code}</Text>
      </HStack>
      <Text style={{...CommonStyles.h2}}> {data.storePickup ? 'Servicio de VALET incluido' : 'Recoger en' } </Text>
      <AddressFormatted address={data.store.location.formatted_address} />
      <HStack alignItems={'center'} justifyContent={'space-between'} >
        <Text style={{...CommonStyles.h2}} >Total:</Text>
        <Text style={{...CommonStyles.h2}} >{moneda(data?.total_amount)} MXN</Text>
      </HStack>
    </VStack>
    </>
  )
  return (
    <>
       <AddressFormatted address={data?.businessId?.location?.formatted_address} />
        <VStack  space={3} marginTop={'10px'} >
          <Text style={{ ...CommonStyles.h2 }} >Servicio:</Text>
          <Text style={{ ...CommonStyles.h3 }} >{data?.serviceId?.type_services?.name}  {data?.serviceId?.type_services?.type}</Text>

          <HStack space={12} marginY={'10px'} >
            <VStack>
              <Text style={styles.txt} >Dia:</Text>
              <Text style={styles.txt}>Hora:</Text>
            </VStack>
            <VStack>

              <Text style={styles.txt}>{moment(data.startDate).format('DD')} de {moment(data.startDate).format('MMMM')} del {moment(data.startDate).format('YYYY')} </Text>
              <Text style={styles.txt}>{moment(data.startDate).format('HH:mm')}</Text>
            </VStack>

          </HStack>
          <Text style={{...CommonStyles.h2}} >Servicio de VALET incluido</Text>
          <Text style={{...CommonStyles.h3}} >{data?.address?.formatted_address}</Text>

          <HStack alignItems={'center'} justifyContent={'space-between'} >
            <Text style={{...CommonStyles.h2}} >Código:</Text>
            <Text style={{...CommonStyles.h2}} >{data?.delivery_security_code}</Text>
          </HStack>

          <HStack alignItems={'center'} justifyContent={'space-between'} >
            <Text style={{...CommonStyles.h2}} >Total servicio:</Text>
            <Text style={{...CommonStyles.h2}} >{moneda(data?.serviceId?.price)} MXN</Text>
          </HStack>
        </VStack>
    </>
  )
}

export default CardServicio

const styles = StyleSheet.create({
  txt: {
    fontWeight: 'bold',
    ...CommonStyles.h2
  }
})