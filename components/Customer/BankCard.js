import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { adjust } from '../../util/Dimentions'
import Colors from '../../util/styles/colors';

export const BankCard = ({ data }) => {
    
    let inicio = data?.card_number.length - 4;
    let fin = data?.card_number.length;
    return (
        <View style={styles.cardBank} >
           
            
            <View style={styles.brand} >
                <Text style={styles.bankName} >{data?.bank_name}</Text>
                <Text  style={styles.txt} >{data?.brand}</Text>
            </View>
            <View style={styles.cardContent} >
                <Text style={styles.txt} >{data?.holder_name} </Text>
                
                <Text style={styles.txt} > **** {data?.card_number.slice(inicio, fin)}</Text>
            </View>
            
            
            
        </View>
    )
}



const styles = StyleSheet.create({
    cardBank:{
        marginHorizontal:10,
        backgroundColor:Colors.primarySolid,
        marginVertical:5,
        borderRadius:3,
        padding:10
    },
    bankName:{
        fontSize:adjust(14),
        color:Colors.white,
    },
    cardContent:{
        flexDirection:'row',
        marginBottom:10,
        justifyContent:'space-between'
    },
    txt:{
        color:Colors.white,
        textTransform: 'uppercase'
    },
    brand:{
        flexDirection:'row',
        marginBottom:5,
        justifyContent:'space-between'
    }
})