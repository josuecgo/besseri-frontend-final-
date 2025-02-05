import { StyleSheet, Text, View,Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import AddressFormatted from '../AddressFormatted'
import { Divider, HStack, VStack,Center } from 'native-base'
import CommonStyles from '../../util/styles/styles'
import moment from 'moment'
import { aplicarDescuento, comisionFormatted, comisionMoneda, moneda } from '../../util/Moneda'
import OrderProductItemComponent from '../vendor-shared/order-product-item.component'
import { ProductContext } from '../../util/context/Product/ProductContext'
import { useContext } from 'react'
import Colors from '../../util/styles/colors'

const CardServicio = ({data}) => {
  const {comision} = useContext(ProductContext)
  
 
  
  const openMapsApp = (latitude, longitude) => {

    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${data?.store?.location.latitude},${data?.store?.location?.longitude}`,
      android: `http://maps.google.com/maps?q=${data?.store?.location.latitude},${data?.store?.location?.longitude}`,
    });
    Linking.openURL(url);

  };

 
  
 
  if(data.type === 'refaccion') return (
    <>
    <AddressFormatted address={data?.store?.location?.formatted_address} />
    <VStack  space={3} marginTop={'10px'} >
      <HStack alignItems={'center'} space={3} >
        <Text style={{ ...CommonStyles.h2 }} >Servicio:</Text>
        <Text style={{ ...CommonStyles.h3,textTransform:'uppercase' }} >{data.type}</Text>
      </HStack>
      


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

     
      <Text style={{...CommonStyles.h2}}> {data.storePickup ? 'Recoger en' : 'Servicio de VALET incluido'  } </Text>
      {
        data.storePickup ? (
          <TouchableOpacity onPress={openMapsApp} >
             <AddressFormatted address={data?.store?.location?.formatted_address}   />
          </TouchableOpacity>
           
        ): ( 
          <AddressFormatted address={data?.delivery_address?.formatted_address} />
        )
      }
     

      
      
      <HStack alignItems={'center'} justifyContent={'space-between'} >
        <Text style={{...CommonStyles.h2}} >{data.chargeId === 'cash' ? 'Total a pagar' :'Total:'}</Text>
        <Text style={{...CommonStyles.h2}} >{comisionMoneda(data?.total_amount,comision)} MXN</Text>
      </HStack>
    </VStack>
    </>
  )

  let total = comisionFormatted(data?.total_amount, 0) + data?.pieceCost;
  
  return (
    <>
       <AddressFormatted address={data?.businessId?.location?.formatted_address} />
        <VStack  space={1} marginTop={'10px'} >
          <Text style={{ ...CommonStyles.h2 }} >Servicio:</Text>
          <HStack justifyContent={'space-between'} alignItems={'center'}>
            <Text style={{ ...CommonStyles.h2 }} >{data?.serviceId?.type_services?.name}  {data?.serviceId?.type_services?.type}</Text>
            <Center backgroundColor={Colors.white} rounded={'full'} alignItems={'center'} justifyContent={'center'} p={1} >
              <Text style={{ ...CommonStyles.h3,textTransform:'uppercase',color:Colors.bgColor,fontWeight:'bold'}}  
              >{data.serviceId.is_home ? 'Domicilio' : 'Valet'}  </Text>

            </Center>
            
          </HStack>

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

          {
            !data.serviceId.is_home &&  (
              <>
               <Text style={{...CommonStyles.h2}} >{data.chargeId === 'noDate' ? '' : 'Servicio de VALET incluido'}</Text>
              <Text style={{...CommonStyles.h3}} >{data?.address?.formatted_address}</Text>
              </>
            )
          }
         

          <HStack alignItems={'center'} justifyContent={'space-between'} >
            <Text style={{...CommonStyles.h2}} >Código:</Text>
            <Text style={{...CommonStyles.h2}} >{data?.delivery_security_code}</Text>
          </HStack>

          <HStack alignItems={'center'} justifyContent={'space-between'} >
            {
              !data?.coupon ? (
                <>
                  <Text style={{...CommonStyles.h2}} >Total servicio:</Text>
                  <Text style={{...CommonStyles.h2}} >{total} MXN</Text>
                </>
              ):(
                
                <>
                <VStack>
                  <Text style={{...CommonStyles.h2}} >Costo del servicio:</Text>
                  <Text style={{...CommonStyles.h2}} >Descuento:</Text>
                  <Text style={{...CommonStyles.h2}} >Total servicio:</Text>
                 </VStack>
                <VStack>
                  <Text style={{...CommonStyles.h2}} >{comisionMoneda(data?.serviceId?.price, comision)} MXN</Text>
                  <Text style={{...CommonStyles.h2}} >{data?.coupon.discount}%</Text>
                  <Text style={{...CommonStyles.h2,color:Colors.succes}} >{moneda(aplicarDescuento(total,data?.coupon?.discount))}</Text>
                </VStack>
                </>
            
              )
            }
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