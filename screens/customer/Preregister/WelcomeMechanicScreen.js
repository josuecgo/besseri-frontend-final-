import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../../../util/styles/colors';
import { Center } from 'native-base';

export const WelcomeMechanicScreen = ({route}) => {
   
    const data = route.params;

    
    
    
    return (
        <View style={styles.container} >
            <Center mt={5} >
                <Text style={styles.title} >{data?.titulo}</Text>
            </Center>
            <Center  m={5} >
                <Text>
                    {data?.body?.message}
                </Text>
            </Center>
            
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        backgroundColor:Colors.bgColor,
        flex:1,
    },
    title:{
        color:Colors.white,
        fontSize:20,
        fontWeight:'bold'
    }
})