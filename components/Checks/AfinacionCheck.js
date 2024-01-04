import { StyleSheet, View } from 'react-native'
import React from 'react'
import {  Text } from 'native-base'
import CommonStyles from '../../util/styles/styles'

import { CardCheck } from './CardCheck'

export const AfinacionCheck = ({ value }) => {




    return (
        <View>
            <Text style={styles.title} >Afinación</Text>
                          
           
            <CardCheck 
            value={value?.aceiteMotor} 
            label={'Aceite de Motor'} 
            />
            <CardCheck 
            value={value?.aceiteTransmision} 
            label={'Aceite de transmisión'} 
            />
            <CardCheck 
            value={value?.anticongelante} 
            label={'Anticongelante'} 
            />

            <CardCheck 
            value={value?.liquidoFrenos} 
            label={'Liquido de frenos'} 
            />

            <CardCheck 
            value={value?.limpiaparabrisas} 
            label={'Limpiaparabrisas'} 
            />
           

        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        ...CommonStyles.headerTitle,
        marginVertical:5
    }
})