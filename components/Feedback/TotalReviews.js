import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { adjust } from '../../util/Dimentions'
import { AirbnbRating } from 'react-native-ratings'
import Colors from '../../util/styles/colors'
import { Box } from 'native-base'

export const TotalReviews = ({ total }) => {
  // console.log( total );
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
              size={10}
              starContainerStyle={styles.starContainer}
              onFinishRating={(rating) => { }}
              isDisabled
            />
            <Text style={styles.txt}>General</Text>

            <Text style={styles.total} >{total?.installation}</Text>
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
            <Text style={styles.total} >{total?.durability}</Text>
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

            <Text style={styles.total} >{total?.price_quality}</Text>
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
    // backgroundColor:Colors.white,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingVertical: 4,
    // borderBottomWidth: 0.3,
    // borderColor: Colors.textSecundary,
    // shadowColor: Colors.textSecundary,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.9,
    // shadowRadius: 2.62,

    // elevation: 4,
  },
  count: {
    alignItems: 'center',
  },
  total: {
    fontSize: adjust(22),
    fontWeight: 'bold'
  },
  starContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  txt: {
    color: Colors.textSecundary
  }
})