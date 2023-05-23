import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Box, Center, HStack, Image, Slider, VStack } from 'native-base';
import { adjust, deviceHeight, deviceWidth } from '../../../util/Dimentions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../util/styles/colors';
import { BookingsStatusCode, ORDER_STATUSES } from '../../../util/constants';
import CommonStyles from '../../../util/styles/styles';

export const SeguimientoScreen = ({ route }) => {
 
  const progress = route.params;
 
  const steps = progress.type == 'servicio' ? [
    {
      name: "Servicio aceptado"
    },
    {
      name: "Rider en camino"
    },
    {
      name: "Entregado a valet"
    },
    {
      name: "Recepcionado por taller"
    },
    {
      name:
        "Vehículo en revisión"
    },
    {
      name: "Servicio concluido "
    },
    {
      name: "Taller entregado a valet"
    },
    {
      name: "Vehiculo entregado a cliente"
    },
    {
      name: "Cierre de servicio"
    },
  ] : progress.type == 'refaccion' ? [ {
    name: "Procesando pedido"
  },    {
    name: "Repartidor asignado"
  },
  {
    name: "Entregado a valet"
  },
  {
    name: "Recepcionado por taller"
  },
  {
    name:
      "Vehículo en revisión"
  },
  {
    name: "Servicio concluido "
  },
  {
    name: "Taller entregado a valet"
  },
  {
    name: "Vehiculo entregado a cliente"
  },
  {
    name: "Cierre de servicio"
  } ] : [
    {
      name: "Lavado aceptada"
    },    {
      name: "Rider en camino"
    },
    {
      name: "Entregado a valet"
    },
    {
      name: "Recepcionado por taller"
    },
    {
      name:
        "Vehículo en revisión"
    },
    {
      name: "Servicio concluido "
    },
    {
      name: "Taller entregado a valet"
    },
    {
      name: "Vehiculo entregado a cliente"
    },
    {
      name: "Cierre de servicio"
    }
  ]

  const positionStep = () => {
    //?  ORDERS
  //   OUT_FOR_DELIVERY:'Fuera para entrega',
  // PARCEL_PICKED:'Pedido recogido',
  // PARCEL_DELIVERED:'Paquete entregado',
  // RIDER_ASSIGNED:'Repartidor asignado',
  // PROCESSING:'Procesando',
  // PACKED:'Paquete listo'
    // OUT_FOR_DELIVERY:'Fuera para entrega',
    // PARCEL_PICKED:'Pedido recogido',
    // PARCEL_DELIVERED:'Paquete entregado',
    // RIDER_ASSIGNED:'Repartidor asignado',
    // PROCESSING:'Procesando',
    // PACKED:'Paquete listo'
    // PENDING:'PENDING',
    // PROCESSING: 'PROCESSING',
    // PACKED: 'PACKED',
    // DELIVERY: 'OUT_FOR_DELIVERY',
    // CANCELLED: 'CANCELLED',
    // COMPLETED:'PARCEL_DELIVERED',
    // ON_GOING:'ON_GOING',
    // PARCEL_DELIVERED:'PARCEL DELIVERED'
    if (progress.type === 'refaccion') {
      switch (progress.status) {
        case BookingsStatusCode.EN_PROCESO:
  
          return 0;
        case BookingsStatusCode.ESPERANDO_RIDER:
          return 1;
  
        case BookingsStatusCode.RIDER_EN_CAMINO_A_CUSTOMER:
        
          return 2;
        case BookingsStatusCode.CUSTOMER_ENTREGADO_A_RIDER:
            return 3;
        case BookingsStatusCode.ENTREGADO_A_TALLER:
          return 4; 
        case BookingsStatusCode.REVISANDO:
            return 5; 
        case BookingsStatusCode.SERVICIO_CONCLUIDO:
          return 6;
        case BookingsStatusCode.TALLER_ENTREGADO_A_RIDER:
          return 7;
        case BookingsStatusCode.ENTREGADO_A_CUSTOMER:
       
            return 9;
        default:
          return 9;
      }

      return
    }
    //  ?Servicios
    // EN_PROCESO:'En proceso',
    // RIDER_EN_CAMINO_A_CUSTOMER:'Rider en camino',
    // CUSTOMER_ENTREGADO_A_RIDER:'Entregado a rider',
    // ENTREGADO_A_TALLER:'Recepcionado por taller',
    // REVISANDO:'Revisando',
    // SERVICIO_CONCLUIDO:'Servicio concluido',
    // TALLER_ENTREGADO_A_RIDER:'Entregado a rider',
    // ENTREGADO_A_CUSTOMER:'Vehiculo entregado',
    // console.log(progress.status);
    switch (progress.status) {
      case BookingsStatusCode.EN_PROCESO:

        return 0;
      case BookingsStatusCode.ESPERANDO_RIDER:
        return 1;

      case BookingsStatusCode.RIDER_EN_CAMINO_A_CUSTOMER:
      
        return 2;
      case BookingsStatusCode.CUSTOMER_ENTREGADO_A_RIDER:
          return 3;
      case BookingsStatusCode.ENTREGADO_A_TALLER:
        return 4; 
      case BookingsStatusCode.REVISANDO:
          return 5; 
      case BookingsStatusCode.SERVICIO_CONCLUIDO:
        return 6;
      case BookingsStatusCode.TALLER_ENTREGADO_A_RIDER:
        return 7;
      case BookingsStatusCode.ENTREGADO_A_CUSTOMER:
     
          return 9;
      default:
        return 9;
    }
  }


  return (
    <View style={{ ...CommonStyles.screenY }} >


      <View
        style={{
          flexDirection: "row",
        }}
      >



        {/* the column for the steps */}
        <View
          style={{
            flex: 1,
            gap: 8,
          }}
        >
          {steps.map((step, i) => (
            <View key={i}>

              {
                i !== 0 && (
                <View
                style={{
                  width: 1,
                  height: deviceHeight * 0.06,
                  // backgroundColor: "#636363",
                  zIndex: 0,
                  borderWidth: 2,
                  borderColor:  positionStep() > i ? '#5B21FF' : Colors.textSecundary ,
                  position:'absolute',
                  left:12,
                  top:-36
              
                }}
                />
                )
              }

{
               ( i + 1) === positionStep() && (
                  <View
                  style={{
                    width: deviceWidth,
                    height: deviceHeight * 0.042,
                    // backgroundColor: "#636363",
                    zIndex: 0,
                    borderBottomWidth: 4,
                    borderColor:  positionStep() > i ? '#5B21FF' : Colors.textSecundary ,
                    position:'absolute',
                    left:12,
                    // top:
                    // bottom:-8
                
                  }}
                  />
                )
              }
             
              <HStack space={12} >
                <VStack>
                  {
                    positionStep() == (i + 1) ? (
                      <View style={styles.contentImg} >
                        <MaterialCommunityIcons name='check' color={Colors.white} size={20} />
                      </View>
                    ) : (
                      <View style={{
                        // backgroundColor:Colors.textSecundary,
                        // borderWidth: 3,
                        // borderColor: positionStep() > i ? '#5B21FF' : Colors.textSecundary,
                        backgroundColor: positionStep() > i ? '#5B21FF' : Colors.textSecundary,
                     
                        width: 28,
                        height: 28,
                        borderRadius:100
                      }} />
                    )
                  }
                </VStack>
                  
              
                <View style={styles.step}>
                  <Text style={styles.name} >{step.name}</Text>
                </View>
              </HStack>
              {/* <View style={styles.stepContainer}>


                <View style={styles.stepIndicator}>

                  {
                    positionStep() == (i + 1) ? (
                      <View style={styles.contentImg} >
                        <MaterialCommunityIcons name='check' color={Colors.white} size={20} />
                      </View>
                    ) : (
                      <View style={[styles.stepIndicatorText, {
                        backgroundColor: positionStep() > i ? Colors.primaryColor : Colors.textSecundary,
                      }]} />
                    )
                  }
                </View>
                <View style={styles.step}>
                  <Text style={styles.name} >{step.name}</Text>
                </View>
              </View>


              {
                positionStep() == (i + 1) && (
                  <View
                    style={styles.borderBottom }
                  />
                )
              } */}

            </View>

          ))}

        </View>
      </View>

    </View>
  )
}



const styles = StyleSheet.create({
  borderBottom:{
    borderBottomWidth:3,
    borderBottomColor:'#5B21FF',
  
    zIndex:1,
    width:deviceWidth,
    position:'absolute',
    // bottom:0,
    left:-25,
    top:39
   },
  stepLineContainer: {

    width: 50,
    alignItems: "center",
    paddingVertical: 25
  },
  stepContainer: {
    flexDirection: "row",
    minHeight: 40,
    position: "relative"
  },
  stepLine: {
    width: 1,
    height: deviceHeight * 0.077,
    // backgroundColor: "#636363",
    zIndex: 1,
    borderWidth: 2,
    borderColor: Colors.textSecundary,

  },
  stepIndicator: {
    width: 50,
    alignItems: "center",
    position: "absolute",
    top: 12.5,
    left: -50,
    zIndex: 99,


  },
  contentImg: {

    borderWidth: 3,
    borderColor: '#5B21FF',
    backgroundColor: 'black',
    width: 30,
    height: 30,
    borderRadius: 115,
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: 10,

    zIndex: 2

  },
  stepIndicatorText: {
    width: 19,
    height: 19,
    borderRadius: 115,

    // marginRight: 10,

    zIndex: 2
  },
  step: {
    flex: 1,
    // minHeight:  deviceHeight / 7,
    height: deviceHeight * 0.09,
    // paddingVertical: 12,
    paddingHorizontal: 20,
    // alignItems: 'center'
    // backgroundColor: "lightgray",
    // justifyContent: "center",
    // marginVertical:25
  },
  name: {
    ...CommonStyles.h2
  }
})