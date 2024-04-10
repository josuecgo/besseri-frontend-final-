import { FlatList, StyleSheet,  View } from 'react-native'
import React from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import { TotalReviews } from '../../../components/Feedback/TotalReviews'
import Colors from '../../../util/styles/colors'
import { Review } from '../../../components/Feedback/Review'
import { ImagesFeedback } from '../../../components/Feedback/ImagesFeedback'
import { useEffect } from 'react'
import { useState } from 'react'
import { HStack,Divider } from 'native-base';

export const CustomerOrderFeedbacks = ({navigation,route}) => {
  const feedbacks = route.params
  const [total, setTotal] = useState({
    general: 0,
    installation: 0,
    durability: 0,
    price_quality: 0,
  });
 
  const totalFeedbacks = () => {
    let sumatoriaObjeto = feedbacks.reduce(function(acumulador, siguienteValor) {
      return {
        general: acumulador.general + siguienteValor.general,
        installation: acumulador.installation + siguienteValor.installation,
        price_quality: acumulador.price_quality + siguienteValor.price_quality,
        durability: acumulador.durability + siguienteValor.durability,
      };
    }, {
      general: 0,
      installation: 0,
      durability: 0,
      price_quality: 0,
    }); 
  
    // Calcular el promedio de cada valor y aplicar redondeo
    let promedioGeneral = Math.round((sumatoriaObjeto.general / feedbacks.length) * 10) / 10;
    let promedioInstallation = Math.round((sumatoriaObjeto.installation / feedbacks.length) * 10) / 10;
    let promedioDurability = Math.round((sumatoriaObjeto.durability / feedbacks.length) * 10) / 10;
    let promedioPriceQuality = Math.round((sumatoriaObjeto.price_quality / feedbacks.length) * 10) / 10;
  
    // Asignar los valores redondeados al estado total
    setTotal({
      general: Math.round(promedioGeneral),
      installation: Math.round(promedioInstallation),
      durability: Math.round(promedioDurability),
      price_quality:Math.round(promedioPriceQuality) ,
    });
  }
  

  useEffect(() => {
    totalFeedbacks();
  }, [])
  
  
  return (
    <View style={styles.body} >
      <HeaderTitle 
      titulo={'Valoraciones'} nav={() => navigation.goBack()}    
      iconName='keyboard-backspace' 
      />
      <TotalReviews total={total} reviews={feedbacks.length} />
      <Divider/>
      <FlatList
      data={feedbacks}
      renderItem={({item})=> {

        return(
          <>
            <View style={{borderBottomWidth:0.3,borderColor:Colors.bgColor}} >
              <ImagesFeedback imgs={item?.imgs} />
              <Review review={item} />
              <Divider/>
            </View>

           
          </>
          
        )

      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{marginHorizontal:4}}
      key={(item) => item._id}
      />

    </View>
  )
}



const styles = StyleSheet.create({
  body:{
    backgroundColor:Colors.white,
    flex:1,
   
  }
})