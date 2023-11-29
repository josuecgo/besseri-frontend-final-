import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Box, HStack, Image, VStack } from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { adjust, deviceWidth } from '../../util/Dimentions'
import Colors from '../../util/styles/colors'

export const AddressHeader = ({navigation}) => {
  
  return (
    <View style={styles.header} >
      <VStack>
        <HStack justifyContent={'space-between'} w={deviceWidth - 30} alignItems={'center'} >
         
            <Image
            source={require('../../assets/images/newLogo.png')}
            alt='logo'
            style={styles.logo}
            resizeMode='contain'
            />


            <TouchableOpacity
            onPress={() => navigation.replace('AuthStack') }
            >
              <MaterialIcons
              name="account"
              color='white'
              size={30}
              />
            </TouchableOpacity>
            
        </HStack>
        
        <Box>
          <Text style={styles.titulo} >Vive la experiencia</Text>
          <Text style={styles.subtitulo} >desde ti casa u oficina</Text>
        </Box>
      </VStack>

    </View>
  )
}



const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    marginHorizontal: 15,
    
  },
  logo: {
    height: 50,
    width: 40
  },
  titulo: {
    color: Colors.white,
    fontSize: adjust(18)
  },
  subtitulo: {
    color: Colors.white,
    fontSize: adjust(20),
    fontWeight: 'bold'
  },
})