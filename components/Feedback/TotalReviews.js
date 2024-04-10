import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { adjust } from '../../util/Dimentions'
import { AirbnbRating } from 'react-native-ratings'
import Colors from '../../util/styles/colors'
import { Box,Text } from 'native-base'

export const TotalReviews = ({ total }) => {
  
  return (
    <>
      <Box>
        <Box  overflow="hidden" borderColor={Colors.bgColor} borderWidth="1" >
          <View style={styles.header} >
             <View style={styles.count} >
            <Text style={styles.total} >{total?.general.toFixed(0)}</Text>
            <AirbnbRating
              showRating={false}
              count={5}
              defaultRating={total.general}
              size={10}
              starContainerStyle={styles.starContainer}
              onFinishRating={(rating) => { }}
              isDisabled
            />
            <Text style={styles.txt}>General</Text>

            <Text style={styles.total} >{total?.installation.toFixed(0)}</Text>
            <AirbnbRating
              showRating={false}
              count={5}
              defaultRating={total.installation}
              size={10}
              starContainerStyle={styles.starContainer}
              onFinishRating={(rating) => { }}
              isDisabled
            />
            <Text style={styles.txt} >Instalación</Text>

          </View>
          <View style={styles.count} >
            <Text style={styles.total} >{total?.durability.toFixed(0)}</Text>
            <AirbnbRating
              showRating={false}
              count={5}
              defaultRating={total.durability}
              size={10}
              starContainerStyle={styles.starContainer}
              onFinishRating={(rating) => { }}
              isDisabled
            />
            <Text style={styles.txt} >Durabilidad</Text>

            <Text style={styles.total} >{total?.price_quality.toFixed(0)}</Text>
            <AirbnbRating
              showRating={false}
              count={5}
              defaultRating={total.price_quality}
              size={10}
              starContainerStyle={styles.starContainer}
              onFinishRating={(rating) => { }}
              isDisabled
            />
            <Text style={styles.txt} >Relacion calidad precio</Text>

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