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
                <View style={styles.first} >
                    <Text style={styles.txt} >Solo primera compra: </Text>
                    <View style={ {
                        backgroundColor: data?.first ? Colors.terciarySolid : Colors.alertRed,
                        borderRadius:5,
                        padding:4
                    }}>
                    <Text style={[
                        styles.txtFirst,
                        {color:data?.first ? 'white' : Colors.black}
                    ]} > 
                        { data?.first ? 'Si' : 'No' } 
                    </Text>
                    </View>
                   
                </View>
                <View style={styles.first} >
                    <Text style={styles.txt} >Mínimo de compra: </Text>
                    <View style={ {
                        backgroundColor: data?.first ? Colors.terciarySolid : Colors.alertRed,
                        borderRadius:5,
                        padding:4
                    }}>
                    <Text style={[
                        styles.txtFirst,
                        
                    ]} > 
                        { data?.minCompra ? moneda(data?.minCompra) : '$0.00' } 
                    </Text>
                    </View>
                   
                </View>

                <View style={styles.first} >
                    {
                        data?.type === '%' ? (
                            <Text style={styles.txt} >{data?.descuento}{data?.type} de descuento. </Text>
                        ) : (
                            <Text style={styles.txt} >{moneda(data?.descuento)} pesos de descuento.  </Text>
                        )
                    }  
                </View>
                
                


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
        padding: 3,
        elevation: 1,
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center'
    },
    name:{
        fontSize: adjust(15)
    },
    first:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:2
    },
    txtFirst:{
        fontSize: adjust(9),
    },
    txt: {
        fontSize: adjust(12),
        color:Colors.textPrimary
    }
})