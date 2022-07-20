import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Menu, Pressable } from 'native-base';
import Colors from '../../util/styles/colors';
import { adjust } from '../../util/Dimentions';
import { moneda } from '../../util/Moneda';

export const CuponCard = ({ data,editarCupon,eliminarCupon }) => {


    return (
        <View style={styles.container} >

            <View>
                <Text style={styles.name} >Cupón: {data?.name}</Text>
                {
                    data?.type === '%' ? (
                        <Text style={styles.txt} >{data?.descuento}{data?.type} de descuento </Text>
                    ) : (
                        <Text style={styles.txt} >{moneda(data?.descuento)} pesos de descuento  </Text>
                    )
                }


            </View>
            <View>
            <Menu shadow={2} w="180" trigger={triggerProps => {
            return <Pressable accessibilityLabel="More options menu" {...triggerProps} >
                        <MaterialIcons name={'more-vert'}  size={25} color={Colors.textSecundary}/> 
                    </Pressable>;
            }}>

                {/* <Menu.Item onPress={() => editarCupon(data)} >
                    Editar
                </Menu.Item> */}
                <Menu.Item onPress={()=> eliminarCupon(data)} >
                    Eliminar
                </Menu.Item>
              
            </Menu>
                
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        marginHorizontal: 10,
        padding: 5,
        elevation: 1,
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center'
    },
    name:{
        fontSize: adjust(15)
    },
    txt: {
        fontSize: adjust(12)
    }
})