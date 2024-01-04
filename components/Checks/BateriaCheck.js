import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CommonStyles from '../../util/styles/styles'
import { CardCheck } from './CardCheck'





export const BateriaCheck = ({ value }) => {
   
    return (
        <View>
            <Text style={styles.title} >Batería</Text>
                          
           
            <CardCheck
            value={value} 
            label={'Bateria'} 
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