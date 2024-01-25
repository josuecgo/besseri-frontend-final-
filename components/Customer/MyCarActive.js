import { TouchableOpacity, View } from 'react-native'
import React from 'react'
import { HStack, Heading, Image, VStack } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux'
import Colors from '../../util/styles/colors'


import { base_url } from '../../util/api/api_essentials'
import { adjust } from '../../util/Dimentions'
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants'

export const MyCarActive = ({navigation}) => {
  const { carActive } = useSelector(state => state.user);


  

  return (
    <View style={{ top: -10 }} >
      <HStack justifyContent={'space-between'} alignItems={'center'} mx={4} >

        {
          carActive ? (
            <>
              <HStack alignItems={'center'} >
                <Image
                  source={{ uri: `${base_url}/${carActive?.maker.photo}` }}
                  alt='marca'
                  style={{ height: 60, width: 60 }}
                  resizeMode='contain'
                />
                <Heading size={'sm'} color={Colors.white} >{carActive?.maker?.name} {carActive?.model?.name}</Heading>
              </HStack>

                {
                  carActive.checks && navigation && (
                    <TouchableOpacity
                    onPress={() => navigation.navigate(
                      CUSTOMER_HOME_SCREEN_ROUTES.CHECK_STACK,
                      { checks: carActive }
                    )}
                    >
                      <MaterialCommunityIcons
                        name='engine'
                        color={'white'}
                        size={adjust(30)}
                      />
                    </TouchableOpacity>
                )
              }
              
            </>
          ) : (
            <VStack justifyContent={'center'} alignItems={'center'} width={'100%'} >

            </VStack>
          )
        }

      </HStack>


    </View>
  )
}


