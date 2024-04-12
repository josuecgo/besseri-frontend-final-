import { FlatList, StyleSheet,  View } from 'react-native'
import React from 'react'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import Colors from '../../../util/styles/colors'

import { useEffect } from 'react'
import { useState } from 'react'
import { Divider } from 'native-base';
import { ServiceReview } from '../../../components/Feedback/ServiceReview'
import { TotalServiceReviews } from '../../../components/Feedback/TotalServiceReviews'

export const CustomerServiceFeedbacks = ({navigation,route}) => {
  const feedbacks = route.params
  const [total, setTotal] = useState({
    rating: 0,
   
  });
 
 
  const totalFeedbacks = () => {
    const sumaCalificaciones = feedbacks.reduce((total, comentario) => {
        return total + comentario.rating;
    }, 0);

    // Calculamos el promedio dividiendo la suma por el número total de calificaciones
    const promedio = sumaCalificaciones / feedbacks.length;

   
    setTotal({
      general: Math.round(promedio),
  
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
      <TotalServiceReviews total={total} reviews={feedbacks.length} />
      <Divider/>
      <FlatList
      data={feedbacks}
      renderItem={({item})=> {

        return(
          <>
            <View style={{borderBottomWidth:0.3,borderColor:Colors.bgColor}} >
             
              <ServiceReview review={item} />
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