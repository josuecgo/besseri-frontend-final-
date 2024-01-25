import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import CommonStyles from '../../../util/styles/styles'
import { Box, HStack, Heading, Image } from 'native-base'
import { MyCarActive } from '../../../components/Customer/MyCarActive'

import { AfinacionCheck } from '../../../components/Checks/AfinacionCheck'
import { BateriaCheck } from '../../../components/Checks/BateriaCheck'
import { FrenosCheck } from '../../../components/Checks/FrenosCheck'
import { LlantasCheck } from '../../../components/Checks/LlantasCheck'
import { base_url } from '../../../util/api/api_essentials'
import Colors from '../../../util/styles/colors'

export const ChecksCarScreen = ({ route }) => {
    const {maker,model,checks} = route.params;


 

    return (
        <View style={styles.body} >
            <HStack alignItems={'center'} >
                <Image
                  source={{ uri: `${base_url}/${maker?.photo}` }}
                  alt='marca'
                  style={{ height: 60, width: 60 }}
                  resizeMode='contain'
                />
                <Heading size={'sm'} color={Colors.white} >{maker?.name} {model?.name}</Heading>
            </HStack>

            <ScrollView>
                <Box style={styles.section} >
                    <AfinacionCheck  value={checks?.afinacion} />


                    <FrenosCheck value={checks?.frenos}  />
                
                    <LlantasCheck value={checks?.llantas} />

                    <BateriaCheck  value={checks?.bateria} />   
                
                </Box>
            </ScrollView>
            
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