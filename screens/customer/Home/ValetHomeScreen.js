import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Center, HStack, Text, VStack } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CommonStyles from '../../../util/styles/styles'
import Colors from '../../../util/styles/colors'
import { deviceWidth } from '../../../util/Dimentions'
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants'

export const ValetHomeScreen = ({navigation,route}) => {
    const { lavado } = route.params
    

    const goLavadoScreen = (type) => {
        if (lavado) {
            navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.LAVADO,type)
        } else {
            navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SERVICES_CATEGORIES,type)
        }
         
    }

    return (
        <View style={styles.body} >
            <Center>
                <Text style={CommonStyles.h4} >El servicio lo desea en:</Text>
            </Center>

            <VStack flex={1} justifyContent={'center'} alignItems={'center'} >
                <HStack space={10} justifyContent={'center'} alignItems={'center'} >
                    <TouchableOpacity 
                    onPress={()=> goLavadoScreen(true) }
                    style={styles.btn} >
                        <MaterialCommunityIcons name='home' size={40} color={Colors.white} />
                        <Text>Mi domicilio</Text>
                    </TouchableOpacity>

                    {
                        lavado ? (
                            <TouchableOpacity 
                    onPress={()=> goLavadoScreen(false) }
                    style={styles.btn}
                    >
                        <MaterialCommunityIcons name='car-wash' size={40} color={Colors.white} />
                        <Text>Lavadora</Text>
                    </TouchableOpacity>
                        ):(
                            <TouchableOpacity 
                    onPress={()=> goLavadoScreen(false) }
                    style={styles.btn}
                    >
                        <MaterialCommunityIcons name='car-cog' size={40} color={Colors.white} />
                        <Text>Taller</Text>
                    </TouchableOpacity>
                        )
                    }

                </HStack>
            </VStack>

            
        </View>
    )
}



const styles = StyleSheet.create({
    body: {
        ...CommonStyles.screenY,
        // justifyContent: 'center',

    },
    btn:{
        justifyContent:'center',
        alignItems:'center',
        borderWidth:0.5,
        borderColor:Colors.white,
        borderRadius:10, 
        paddingVertical:10,
        // paddingHorizontal:10,
        minWidth: deviceWidth * 0.3
    }
})