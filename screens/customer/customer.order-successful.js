import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { BackgroundImage } from '../../components/Background/BackgroundImage'
import CommonStyles from '../../util/styles/styles'
import Colors from '../../util/styles/colors'
import { CUSTOMER_HOME_SCREEN_ROUTES } from '../../util/constants'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonComponent from '../../components/button/button.component'

export const OrderSuccessful = (props) => {
    
    

    // useEffect(() => {
    //     deleteCart();
    // }, [])

    // const deleteCart = () => {
    //     for (var a=0;a<productos?.length;a++) {
    //         dispatch(deleteItemFromCart(products[a]?._id,products[a]?.price))
    //     }
    // }
    
    return (
    <>
        <BackgroundImage/>
            <View style={{...CommonStyles.flexOneCenter}}>
               
             <Ionicons
             name='checkmark-circle'
             color={Colors.terciarySolid} 
             size={160}
             />
                <Text style={{fontSize:30,...CommonStyles.fontFamily,color:Colors.white}}>Pedido realizado</Text>
                <Text style={{fontSize:15,fontWeight:'300',width:'75%',alignSelf:'center',textAlign:'center',color:Colors.white}}>
                Tu pedido ha sido realizado con éxito, pronto recibirás tu paquete
                </Text>

            <ButtonComponent
            handlePress={() => {
                props.navigation.replace(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS)
                
            }}
            borderRadius={10}
            colorT={Colors.white}
            buttonText={'Continuar'}
            colorB={Colors.terciarySolid}
            width={200}
            margin={30}
            />
            </View>
    </>
  )
}

