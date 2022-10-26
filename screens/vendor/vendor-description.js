import { View, StyleSheet, Text, ScrollView } from 'react-native'
import React from 'react'
import { HeaderTitle } from '../../components/Customer/HeaderTitle'
import { DescriptionOrder } from '../../components/Vendor/DescriptionOrder';
import Colors from '../../util/styles/colors';
import { ListProducts } from '../../components/Vendor/ListProducts';

export const VendorDescription = ({route}) => {
   
    const {chargeId,storePickup,products,user} = route.params?.order;
    const order =  route.params.order;
   
    return (
        <View style={styles.container} >
            <HeaderTitle 
            iconName='keyboard-backspace' 
            titulo={'Detalles de pedido'}
            />
            <ScrollView>
                <View
                style={styles.card}
                >
                    <DescriptionOrder 
                    tipo="Nombre:"
                    value={user.name}  
                    />  

                    <DescriptionOrder 
                    tipo="Correo:"
                    value={user.email}  
                    />
                    <DescriptionOrder 
                    tipo="Telefono:"
                    value={order?.delivery_address ? order?.delivery_address?.phone : user?.phone}  
                    />
                    <DescriptionOrder 
                    tipo="Tipo de pago:"
                    value={chargeId === 'cash' ? 'Efectivo' : 'Tarjeta'}  
                    />  

                    <DescriptionOrder 
                    tipo="Tipo de entrega:"
                    value={storePickup ? 'Entregar en tienda' : 'Entregar a domicilio'}  
                    />  
                </View>
                <View style={styles.card} >
                    
                    <ListProducts  products={products}/>
                </View>
            </ScrollView>




            

            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:Colors.bgColor,
        flex:1
    },
    card:{
        backgroundColor:Colors.white,
        marginVertical:10,
        marginHorizontal:5,
        borderRadius:5,
        // paddingVertical:5
    }
})
