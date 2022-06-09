import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TopCircleComponent from '../../components/top-circle/top-circle.component'
import { ModeEnvio } from '../../components/button/ModeEnvio'
import { adjust } from '../../util/Dimentions'
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants'

export const EnvioScreen = (props) => {
  const {navigation,route} = props;
  
  const goOrderFree = () => {
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_SUMMARY_FREE,route?.params)
  }
  
  const goOrder = () => {
    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.ORDER_SUMMARY,route?.params)
  }
  
  return (
    <>
    <TopCircleComponent textHeading={'Envío'} />
    
    <View style={styles.content} > 
      <Text style={styles.titulo} >Elige el modo de envío</Text>
      <View style={styles.card} >
       
        <View style={styles.btn} >
          <ModeEnvio 
          texto={'Recoger en tienda'} 
          iconName={'home'}
          subtitulo='Gratis'
          nav={goOrderFree}
          
          />
          <ModeEnvio 
          texto={' Enviar a domicilio'} 
          iconName={'store'}
          subtitulo='Costo adicional'
          nav={goOrder}
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