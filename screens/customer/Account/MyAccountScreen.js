import { Alert, StyleSheet,  View } from 'react-native'
import React from 'react'

import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonStyles from '../../../util/styles/styles'
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../../util/constants'
import { Box, HStack, Pressable, Text } from 'native-base'
import { getUserId, logout } from '../../../util/local-storage/auth_service';
import axios from 'axios';
import { useInfoUser } from '../../../hooks/useInfoUsers';
import { useDispatch } from 'react-redux';
import { deleteToUser } from '../../../util/ReduxStore/Actions/CustomerActions/UserInfoActions';
import { api_urls } from '../../../util/api/api_essentials';
import Colors from '../../../util/styles/colors';


export const MyAccountScreen = (props) => {
    const {getNotificaciones} = useInfoUser();
    const dispatch = useDispatch()
    const menu = [
        {
            name:'Mis autos',
            nav:CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_CARS
        },
        {
            name:'Mis direcciones',
            nav:CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_ADDRESS
        },
        {
            name:'Políticas de privacidad',
            nav:CUSTOMER_HOME_SCREEN_ROUTES.PRIVACY_POLICY
        }
    ]


    const eliminarCuenta = () => {
        Alert.alert(
            "¿Eliminar cuenta?",
            "Se eliminara su cuenta permanentemente",
            [
              {
                text: "No",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "Si", onPress: eliminarUsuario
            }
            ]
          );
    }

    const eliminarUsuario = async() => {
        try {
            const id = await getUserId();
            const apiCall = await axios.delete(`${api_urls.delete_user}/${id}`);
            if (apiCall?.status === 200) {
                await logout();
                dispatch(deleteToUser())
                getNotificaciones()
              
                navigation.replace('Splash',{reload:true});
                showToaster('Cuenta eliminada')
            
            }

          } catch(e) {
            
            showToaster('No hay conexion con el servidor');
           
          }
       
    }


    return (
        <View style={styles.container} >
            <Box>
                {
                    menu.map((item,i) => {

                        return (
                            <HStack key={i} justifyContent={'space-between'} alignItems={'center'} marginY={'10px'} >
                                <Text style={CommonStyles.h4} >
                                    {item.name}
                                </Text>
                                <Pressable
                                onPress={() => props.navigation.navigate(item.nav) }
                                >
                                    <MaterialIcons name='arrow-right-circle'  size={30} color={'#868686'} />
                                </Pressable>
                               
                            </HStack>
                        )
                    })
                }

                            <HStack  justifyContent={'space-between'} alignItems={'center'} marginY={'10px'} >
                                <Text style={[CommonStyles.h4,{color:Colors.alertRed}]} >
                                Eliminar cuenta
                                </Text>
                                <Pressable
                                onPress={() => eliminarCuenta() }
                                >
                                    <MaterialIcons name='arrow-right-circle'  size={30} color={'#868686'} />
                                </Pressable>
                               
                            </HStack>

              
            </Box>
        </View>
    )
}

 

const styles = StyleSheet.create({
    container:{
        ...CommonStyles.screenY
    }
})