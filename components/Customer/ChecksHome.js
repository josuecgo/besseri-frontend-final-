import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { HStack, VStack } from 'native-base'
import { adjust } from '../../util/Dimentions'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../util/styles/colors'

const ChecksHome = () => {
  return (
    <View style={{ flex: 1 }} >
      <HStack justifyContent={'center'} space={4} >
        <VStack>
          <View style={styles.check}>
            <View style={styles.checkinter}>
              <MaterialCommunityIcons name={'thermometer'}  size={20} color={Colors.white} />
            </View>
          </View>
          <Text style={{ color: 'white', fontSize: adjust(9) }} >Diagnostico</Text>
        </VStack>
        <VStack alignItems={'center'} justifyContent={'center'} >
          <View
            style={styles.check}
          >
            <View style={styles.checkinter}>
            <Text style={{ color: 'white', fontSize: adjust(9) }} >200,000</Text>
            </View>
          </View>
          <Text style={{ color: 'white', fontSize: adjust(9) }} >Kilometraje</Text>
        </VStack>
      </HStack>
    </View>
  )
}

export default ChecksHome

const styles = StyleSheet.create({
  check: {
    borderRadius: 100,
    borderColor: '#0593E3',
    borderWidth: 0.2,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: "#03263B",
   
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  checkinter:{
    borderRadius: 100,
    borderColor: '#326178',
    borderWidth: 0.1,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    margin:14,

    shadowColor: "#03263B",
   
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  }
})