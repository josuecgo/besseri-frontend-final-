import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { adjust } from '../../util/Dimentions';
import Colors from '../../util/styles/colors';

export const DescriptionOrder = ({tipo,value,fd='column'}) => {
    
    return (
        <View style={[styles.main,{flexDirection:fd}]} >
            <Text style={styles.titulo} >{tipo}</Text>
            <Text style={styles.valor} > {value}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    main:{
        alignItems:'center',
        // justifyContent:'space-between',
        margin:5,
       
    },
    titulo:{
        fontSize:adjust(15),
        fontWeight:'bold',
        // color:Colors.textPrimary
    },
    valor:{
        fontSize:adjust(13),
        // fontWeight:'bold' 
        color:Colors.textSecundary
    }
})
