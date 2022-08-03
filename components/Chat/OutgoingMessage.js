import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { horaMes } from '../../util/helpers/horaMes'
import Colors from '../../util/styles/colors'
import { adjust } from '../../util/Dimentions'

export const OutgoingMessage = ({msg}) => {
    // console.log(props);
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
        alignItems:'flex-end',
        marginVertical:4,
        
    },
    globo:{
        borderRadius:10,
        marginHorizontal:5,
        padding:5,

        backgroundColor: '#7674FE',
    },
    text:{
        color:Colors.white
    },
    time:{
        color: '#747474',
        fontSize:adjust(10)
    }
})