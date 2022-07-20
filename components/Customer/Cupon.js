import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import InputFieldComponent from '../input-field/input-field.component';
import KEYBOARD_TYPES from '../../util/keyboard-types';
import { Button, Input } from 'native-base';
import { useCompras } from '../../hooks/useCompras';
import { adjust } from '../../util/Dimentions';
import Colors from '../../util/styles/colors';

export const Cupon = ({setCupon}) => {
    const {aplicarCupones,isLoading} = useCompras()
    const [txtCupon, setTxtCupon] = useState('')
    const [aplicado, setAplicado] = useState('')
    const aplicar = async () => {
        const result = await aplicarCupones(txtCupon);
        
        setCupon(result)
        if (result?.status == 200) {
            setAplicado(result?.cupon?.data?.name)
        }
        
    }
  
    return (
    <>
        <View style={styles.body} >

            <Input 
            placeholder="Cupon"  size="xs" w="55%" maxWidth="300px" 
            onChangeText={(txt) => setTxtCupon(txt)}
            />

            <Button size="xs" onPress={aplicar}>Aplicar</Button>

        </View>
        <View style={styles.aplicado} >
            <Text style={styles.cupon} >{aplicado}</Text>
        </View>
        
    </>
   
  )
}



const styles = StyleSheet.create({
    body:{
        marginHorizontal:10,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    aplicado:{
        marginHorizontal:11,
        marginVertical:5
    },
    cupon:{
        fontSize: adjust(10),
        color: Colors.textSecundary
    }
})