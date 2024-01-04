import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';


export const SemaforoChecks = ({ value }) => {
    const redOn = value === 'malo';
    const yellowOn = value === 'regular';
    const greenOn = value === 'bueno';



    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.light,
                    {
                        backgroundColor: redOn ? '#FF0000' : 'rgba(255, 0, 0, 0.1)',
                        shadowColor: redOn ? '#FF0000' : "rgba(255, 0, 0, 0.2)", 
                        borderColor : redOn ? '#FF0000' : "rgba(255, 0, 0, 0.2)", 
                    },
                ]}
            />
            <View
                style={[
                    styles.light,
                    {
                        backgroundColor: yellowOn ? '#FFFF00' : 'rgba(255, 255, 0, 0.1)',
                        shadowColor: yellowOn ? '#FFFF00' : "rgba(255, 255, 0, 0.2)",
                        borderColor: yellowOn ? '#FFFF00' : "rgba(255, 255, 0, 0.2)",

                    },
                ]}
            />
            <View
                style={[
                    styles.light,
                    { 
                        backgroundColor: greenOn ? '#00FF00' : 'rgba(0, 255, 0, 0.1)',
                        shadowColor: greenOn ? '#33FF66' : "rgba(0, 255, 0, 0.2)",
                        borderColor:  greenOn ? '#33FF66' : "rgba(0, 255, 0, 0.2)",
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#424242',
        borderRadius:10
    },
    light: {
        width: 22,
        height: 22,
        margin: 5,
        borderRadius: 15,
        borderWidth:0.5,
       
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        
        elevation: 6,
    },
    

});
