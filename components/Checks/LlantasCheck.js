import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Text } from 'native-base'
import CommonStyles from '../../util/styles/styles'

import { CardCheck } from './CardCheck'

export const LlantasCheck = ({ value }) => {

    const {
        delanteraIzquierda,
        delanteraDerecha,
        traseraIzquierda,
        traseraDerecha
    } = value;



    return (
        <View>
            <Text style={styles.title} >Llantas</Text>

            <CardCheck
                value={delanteraIzquierda}
                label={'Delantera Izquierda'}
            />

            <CardCheck
                value={delanteraDerecha}
                label={'Delantera Derecha'}
            />

            <CardCheck
                value={traseraIzquierda}
                label={'Trasera Izquierda'}
            />

            <CardCheck
                value={traseraDerecha}
                label={'Trasera Derecha'}
            />







        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        ...CommonStyles.headerTitle,
        marginVertical: 5
    },

})