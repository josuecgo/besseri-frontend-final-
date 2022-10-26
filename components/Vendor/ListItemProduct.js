import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { Avatar, Divider } from 'native-base'
import { base_url } from '../../util/api/api_essentials'
import { DescriptionOrder } from './DescriptionOrder'

export const ListItemProduct = (props) => {
    
    const {
        quantity,name,price,
        description,productImg,brand,
        estimatedDelivery,condition,
        category,subCategory,maker,model
    } = props?.item;
    
    return (
        <View style={styles.contain} >
            <View style={styles.header} >
                <Avatar bg="indigo.500"
                source={{
                    uri:`${base_url}/${productImg}`
                }}
                mx={'1.5'}
                >
                JB
                </Avatar>
                <DescriptionOrder 
                tipo={name}
                value={''}  fd='row'
                />
               
            </View>
            <Divider/>
            <View style={styles.middle} >
                <DescriptionOrder 
                tipo="Cantidad:"
                value={quantity}  
                fd='row'
                />
                <DescriptionOrder 
                tipo="Precio:"
                value={'$'+price}  
                fd='row'
                />
            </View>
            <View style={styles.middle} >
                <DescriptionOrder 
                tipo="Marca:"
                value={brand?.name}  
                fd='row'
                />
                
            </View>
            <View style={styles.middle} >
                <DescriptionOrder 
                tipo="Auto:"
                value={maker?.name}  
                
                />
                <DescriptionOrder 
                tipo="Modelo:"
                value={model?.name}  
                
                />
            </View>
            <DescriptionOrder 
                tipo="Fecha de entrega:"
                value={estimatedDelivery}  
            />
            <DescriptionOrder 
                tipo="Condicion:"
                value={condition}  
                
            />
            <View style={styles.middle} >
                <DescriptionOrder 
                    tipo="Categoria:"
                    value={category?.name}  
                    
                />
                <DescriptionOrder 
                    tipo="SubCategoria:"
                    value={subCategory?.name}  
                    
                />
            </View>
           
            <DescriptionOrder 
            tipo="Descripcion:"
            value={description}  
            />
            
            
            <Divider/>
            
        </View>
    )
}

 const styles = StyleSheet.create({
    contain:{
        paddingVertical:5
    },
    header:{
        flexDirection:'row',
        alignItems:'center',
        marginVertical:2
    },
    middle:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    }
 })