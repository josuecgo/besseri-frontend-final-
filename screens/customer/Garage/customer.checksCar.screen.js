import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import CommonStyles from '../../../util/styles/styles'
import { Box } from 'native-base'
import { MyCarActive } from '../../../components/Customer/MyCarActive'

import { AfinacionCheck } from '../../../components/Checks/AfinacionCheck'
import { BateriaCheck } from '../../../components/Checks/BateriaCheck'
import { FrenosCheck } from '../../../components/Checks/FrenosCheck'
import { LlantasCheck } from '../../../components/Checks/LlantasCheck'

export const ChecksCarScreen = ({ route,navigation }) => {
    const checks = route.params;

    
    return (
        <View style={styles.body} >
           <ScrollView showsVerticalScrollIndicator={false} >
           <MyCarActive navigation={false} />

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