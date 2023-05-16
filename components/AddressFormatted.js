import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { Box, Image,Text } from 'native-base'
import CommonStyles from '../util/styles/styles'
import { deviceWidth } from '../util/Dimentions'

const AddressFormatted = ({address}) => {
 
 
  return (
    <Box flexDirection={'row'} space={2} alignItems={'center'}>
          <Image
            source={require('../assets/images/13.png')}
            alt='dirrecion'
            style={styles.icon}
          />
          <Box maxWidth={deviceWidth * 0.8 } flexWrap={'wrap'} flexDirection={'row'}>
            <Text style={CommonStyles.h3}>
              {address}
            </Text>
          </Box>
    </Box>
  )
}

export default AddressFormatted

const styles = StyleSheet.create({
  icon:{
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 5
  }
})