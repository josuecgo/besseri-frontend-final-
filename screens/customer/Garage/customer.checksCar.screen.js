import { StyleSheet, View } from 'react-native'
import React from 'react'
import CommonStyles from '../../../util/styles/styles'
import { Box, Center, HStack, Slider, Text } from 'native-base'
import { MyCarActive } from '../../../components/Customer/MyCarActive'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Colors from '../../../util/styles/colors'
import { adjust } from '../../../util/Dimentions'
import { SemaforoChecks } from '../../../components/SemaforoChecks'

export const ChecksCarScreen = ({ route,navigation }) => {
    const checks = route.params;

    // console.log(checks.afinacion);
    console.log(checks.bateria);
    // console.log(checks.frenos);
    // console.log(checks.llantas);
    return (
        <View style={styles.body} >
            <MyCarActive navigation={false} />

            <Box style={styles.section} >
                <HStack>
                    <Text>Afinación</Text>
                </HStack>
                <HStack>
                    <Text>Frenos</Text>
                </HStack>
                <HStack>
                    <Text>Llantas</Text>
                </HStack>
                <HStack justifyContent={'space-between'} alignItems={'center'} >
                    <HStack alignItems={'center'} space={2}>
                    <MaterialCommunityIcons 
                    name='car-battery' 
                    color={Colors.white} 
                    size={adjust(30)}
                    />
                    <Text>Batería</Text>
                    </HStack>

                   <SemaforoChecks value={checks.bateria}/>
                </HStack>
            </Box>
           
        </View>
    )
}



const styles = StyleSheet.create({
    body: {
        ...CommonStyles.screenY,
        
    },
    section:{
        paddingHorizontal:20
    }
})