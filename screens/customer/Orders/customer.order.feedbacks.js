import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import { TotalReviews } from '../../../components/Feedback/TotalReviews'
import Colors from '../../../util/styles/colors'
import { Review } from '../../../components/Feedback/Review'
import { ImagesFeedback } from '../../../components/Feedback/ImagesFeedback'
import { useEffect } from 'react'
import { useState } from 'react'


export const CustomerOrderFeedbacks = ({navigation,route}) => {
  const feedbacks = route.params
  const [total, setTotal] = useState({
    general:0,
    installation:0,
  });
 
  const totalFeedbacks = () => {
    
    let sumatoriaObjeto = feedbacks.reduce(function(acumulador, siguienteValor){
      // console.log(acumulador);
      return {
        general: acumulador.general + siguienteValor.general,
        installation: acumulador.installation + siguienteValor.installation,
        price_quality: acumulador.price_quality + siguienteValor.price_quality,
        durability: acumulador.durability + siguienteValor.durability,
      };
    }, {
      general: 0,
      installation:0,
      durability:0,
      price_quality: 0,
    }); 
    


    let promedioGeneral = sumatoriaObjeto.general / feedbacks.length;
   
    
    setTotal({
      general: promedioGeneral,
      installation: sumatoriaObjeto.installation / feedbacks.length,
      durability: sumatoriaObjeto.durability / feedbacks.length,
      price_quality: sumatoriaObjeto.price_quality / feedbacks.length,
    })

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
      <FlatList
      data={feedbacks}
      renderItem={({item})=> {

        return(
          <>
            <View style={{borderBottomWidth:0.3,borderColor:Colors.bgColor}} >
              <Review review={item} />
              <ImagesFeedback imgs={item?.imgs} />
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