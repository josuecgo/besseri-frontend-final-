import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { adjust } from '../../util/Dimentions'
import CommonStyles from '../../util/styles/styles'

export const DetailsProduct = ({label,value}) => {
    
    return (
        <>
            <Text style={[CommonStyles.fontFamily, {marginBottom: 10}]}>
                <Text style={{fontSize: adjust(13)}}>{label}: </Text>
                <Text style={{fontSize: adjust(13)}}>
                {value}
                </Text>
            </Text>
        </>
    )
}

 

const styles = StyleSheet.create({})