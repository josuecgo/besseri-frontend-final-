import { StyleSheet, View } from 'react-native'
import React from 'react'
import {  Text } from 'native-base'
import CommonStyles from '../../util/styles/styles'

import { CardCheck } from './CardCheck'

export const FrenosCheck = ({ value }) => {

    const { delanteros, traseros } = value;

 
    
    return (
        <View>
            <Text style={styles.title} >Frenos delanteros</Text>
                          
            <CardCheck 
            value={delanteros?.balatas} 
            label={'Balatas'} 
            />

            <CardCheck 
            value={delanteros?.discos} 
            label={'Discos'} 
            />

            <CardCheck 
            value={delanteros?.mangueras} 
            label={'Mangueras'} 
            />


                        <Text style={styles.title} >Frenos traseros</Text>
                          
                          <CardCheck 
                          value={traseros?.balatas} 
                          label={'Balatas'} 
                          />
              
                          <CardCheck 
                          value={traseros?.discos} 
                          label={'Discos'} 
                          />
              
                          <CardCheck 
                          value={traseros?.mangueras} 
                          label={'Mangueras'} 
                          />
            
           

        </View>
    )
}


const styles = StyleSheet.create({
    title: {
        ...CommonStyles.headerTitle,
        marginVertical:5
    },
    
})