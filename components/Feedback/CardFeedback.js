import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { adjust, deviceWidth } from '../../util/Dimentions'
import CommonStyles from '../../util/styles/styles'
import Colors from '../../util/styles/colors'
import { ImagesFeedback } from './ImagesFeedback'
import { Button, ThreeDotsIcon } from 'native-base'
import { Review } from './Review'

export const CardFeedback = ({feedback}) => {
  
  return (
    <View style={styles.card} >

      <Text
        style={styles.cardTitle}>
        Valoraciones
      </Text>

      <View style={styles.imgs}  >
        {
          feedback.map((item) => (
            <View key={item._id} >
              <ImagesFeedback imgs={item?.imgs} />
            </View>
          ))
        }
        <TouchableOpacity
        style={styles.vermas}
        >
          <ThreeDotsIcon />
        </TouchableOpacity>
      </View>

      <View>
        {
          feedback.map((item) => (
            <View key={item._id} >
              <Review review={item} />
            </View>
          ))
        }
        <Button variant={'ghost'} >
          Ver todo
        </Button>
      </View>
      
      
    </View>
  )
}


const styles = StyleSheet.create({
  card:{ 
    backgroundColor: Colors.white, 
    elevation: 1, 
    marginHorizontal: 10, 
    marginTop: 10, 
    padding: 10 
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
    backgroundColor:Colors.bgColor,
    justifyContent:'center',
    alignItems:'center'
  }
})