import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { adjust, deviceWidth } from '../../util/Dimentions'
import CommonStyles from '../../util/styles/styles'

import { Button, Text } from 'native-base'

import { ServiceReview } from './ServiceReview'
import Colors from '../../util/styles/colors'

export const CardServiceFeedback = ({feedback,onPress}) => {
  if(!feedback) return


  return (
    <View style={styles.card} >

      <Text
        style={styles.cardTitle}>
        Valoraciones
      </Text>

     

      <View>
        {
          feedback.map((item,i) => {
            if(i >= 3 ) return null;
            return (
            <View key={item._id} >
              <ServiceReview review={item} />
            </View>
          )})
        }
        <Button 
        variant={'ghost'} 
        onPress={onPress}
        >
          Ver todo
        </Button>
      </View>
      
      
    </View>
  )
}


const styles = StyleSheet.create({
  card:{ 
    // backgroundColor: Colors.white, 
    elevation: 1, 
    marginHorizontal: 10, 
    marginTop: 10, 
    padding: 10 ,
    // borderTopWidth:0.5,
    // borderColor:Colors.white
  },
  imgs:{
    flexDirection:'row',
    justifyContent: 'space-between'
  },
  cardTitle:{
    ...CommonStyles.fontFamily,
    fontSize: adjust(15),
    fontWeight:'bold',
    flex:1
  },
  vermas:{
    marginVertical:10,
    width: deviceWidth * 0.18,
    height: deviceWidth * 0.18,
    borderRadius: 10,
    marginHorizontal: 5,
    // backgroundColor:Colors.bgColor,
    justifyContent:'center',
    alignItems:'center'
  }
})