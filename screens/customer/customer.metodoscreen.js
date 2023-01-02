import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TopCircleComponent from '../../components/top-circle/top-circle.component'
import { ModeEnvio } from '../../components/button/ModeEnvio'
import { adjust } from '../../util/Dimentions'
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants'

export const MetodoScreen = (props) => {
  const {navigation,route} = props;
  const {pickup,totalAmount,descuento} = route?.params;
  const mayorMil = totalAmount - descuento;
 
  
  const goOrderFree = (pago) => {
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_SUMMARY_FREE,{
      ...route?.params,
      pago
    })
  }
  
  const goOrder = (pago) => {
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_SUMMARY,{
      ...route?.params,
      pago
    })
  }

  const metodoPago = (pago) => { 
    if (pickup) {
      goOrderFree(pago);
    }else{
      goOrder(pago);
    }

    
  }
  
  return (
    <>
      <TopCircleComponent textHeading={'Método de pago'} />
      
      <View style={styles.content} > 
        <Text style={styles.titulo} >Elige el método de pago</Text>
        <View style={styles.card} >
        
          <View style={styles.btn} >
            {
              (mayorMil <= 500) && (
                <ModeEnvio 
                texto={'Pago en efectivo'} 
                iconName={'local-atm'}
                subtitulo='Paga al recibir el producto'
                nav={()=> metodoPago('cash')}
                
                />
              )
            }
            
            <ModeEnvio 
            texto={'Pago con tarjeta'} 
            iconName={'credit-card'}
            subtitulo='Paga con tarjeta de debito/credito'
            nav={()=> metodoPago('card')}
            />
        
          </View>
          
        </View>
      </View>
    </>
    
  )
}

 

const styles = StyleSheet.create({
  content:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  card:{
    // borderWidth:1,
    alignItems:'center',
    marginHorizontal:10,
    borderRadius:2,
    marginVertical:30
    
  },
  titulo:{
    fontSize:adjust(14),
    fontWeight:'bold',
    color:'#383838'
  },
  btn:{
    flexDirection:'row',
    justifyContent:'center',
    // marginTop:50
  }
})