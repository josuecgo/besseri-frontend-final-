import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { adjust } from '../../util/Dimentions'
import { AirbnbRating } from 'react-native-ratings'
import Colors from '../../util/styles/colors'
import { Box,Text } from 'native-base'

export const TotalServiceReviews = ({ total }) => {
  
  return (
    <>
      <Box>
        <Box  overflow="hidden" borderColor={Colors.bgColor} borderWidth="1" >
          <View style={styles.header} >
            <View style={styles.count} >
              <Text style={styles.total} >{total?.general}</Text>
              <AirbnbRating
                showRating={false}
                count={5}
                defaultRating={total.general}
                size={15}
                starContainerStyle={styles.starContainer}
                onFinishRating={(rating) => { }}
                isDisabled
              />
              <Text style={styles.txt}>General</Text>

          

            </View>
          </View>
         


        </Box>
      </Box>



    </>
  )
}



const styles = StyleSheet.create({
  header: {
   
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingVertical: 4,
 
  },
  count: {
    alignItems: 'center',
  },
  total: {
    fontSize: adjust(19),
    fontWeight: 'bold'
  },
  starContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  txt: {
    color: Colors.textSecundary,
    fontSize: adjust(12),
  }
})