import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../util/styles/colors';
import { horaMes } from '../../util/helpers/horaMes';
import { adjust } from '../../util/Dimentions';

export const IncomingMessage = ({msg}) => {

    // console.log(msg);
    return (
        <View style={styles.content} >
            <View style={styles.globo} >
                <Text style={styles.text} >{msg?.mensaje}</Text>
                <Text style={styles.time} >
                    { horaMes( msg.createdAt ) }
                </Text>
            </View>
            
        </View>
    )
}



const styles = StyleSheet.create({
    content:{
        alignItems:'flex-start',
        marginVertical:4,
        
    },
    globo:{
        borderRadius:10,
        marginHorizontal:5,
        padding:5,

        backgroundColor:'#ebebeb',
    },
    text:{
        // color:Colors.white
    },
    time:{
        color: '#747474',
        fontSize:adjust(10)
    }
})