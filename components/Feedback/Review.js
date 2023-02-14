import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../util/styles/colors';
import { adjust } from '../../util/Dimentions';
import { dateFeedback } from '../../util/helpers/horaMes';
import { HStack } from 'native-base';
import { AirbnbRating, Rating } from 'react-native-ratings';

export const Review = ({review}) => {
  
  const {customer} = review;

  

  console.log(review.general);
  return (
    <View style={styles.content} >
        

        
      <HStack justifyContent={'space-between'} marginX={'1'} >
        <Text style={styles.name} >{customer?.name}</Text>
        <Text style={styles.name} >{ dateFeedback(review.updatedAt) }</Text>
      </HStack>
      
      <AirbnbRating
          showRating={false}
          count={5}
          defaultRating={review.general}
          size={15}
          starContainerStyle={styles.starContainer}
          onFinishRating={(rating) => {}}
          isDisabled
        />

      <HStack justifyContent={'space-between'} marginX={'1'} >
        <Text style={styles.txtFeedback} >{review?.comments}</Text>
      </HStack>
      
      
    </View>
  )
}



const styles = StyleSheet.create({
  content:{
    // backgroundColor:'red',
    borderWidth:0.2,
    padding:5,
    borderColor:Colors.bgColor,
    borderRadius:5
  },
  name:{
    color:Colors.textSecundary,
    fontSize:adjust(10),
    fontWeight:'bold'
  },
  txtFeedback:{
    fontSize:adjust(10)
  },
  starContainer:{
    alignSelf: "flex-start",
    paddingHorizontal:0,
    marginHorizontal:0,
    
  }
})