import { View, Text, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TopHeader from '../../components/Background/TopHeader'
import CommonStyles from '../../util/styles/styles'
import { MenuItem, ThinlineSeparator } from '../../components/CommonComponents'
import Colors from '../../util/styles/colors';
import { getUser, getUserId, logout } from '../../util/local-storage/auth_service';
import { CUSTOMER_HOME_SCREEN_ROUTES, showToaster } from '../../util/constants';
import { NotificationContext } from '../../util/context/NotificationContext';
import { api_urls } from '../../util/api/api_essentials';


export const ProfileScreen = ({navigation}) => {
    const {getNotificaciones} = useContext(NotificationContext);
    const [user, setUser] = useState(false);
    
    useEffect(async() => {
      const result = await getUser()
      
      setUser(result)
    }, [])


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
                await logout()
                getNotificaciones()
                navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS,{reload:true});
                showToaster('Cuenta eliminada')
            
            }

          } catch(e) {
            console.log({delet:e})
            showToaster('No hay conexion con el servidor');
           
          }
       
    }
    
    
    return (
        <View>
            <TopHeader>
                <Text style={CommonStyles.headerTitle} >Mi Perfil</Text>
            </TopHeader>
            <View style={{marginTop:20}} >

                {
                    user && (
                        <>
                            <MenuItem
                            label={ user?.name  }
                            icon={ <MaterialIcons size={25} color={Colors.white} name="account-circle" />}
                            />

                            <ThinlineSeparator margin={5} width={'95%'} />
                            <MenuItem
                            label={ user?.email  }
                            icon={ <MaterialIcons size={25} color={Colors.white} name="email" />}
                            />
                            
                            <ThinlineSeparator margin={5} width={'95%'} />
                        </>
                    )
                }
                
            
                <MenuItem
                onPress={async() =>{
                    await logout()
                    getNotificaciones()
                    navigation.navigate(CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS,{reload:true});
                    showToaster('Cerraste sesión')
                }
                }
                label="Cerrar sesión"
                icon={ <MaterialIcons size={25} color={Colors.white} name="logout" />}
                />
                <ThinlineSeparator margin={5} width={'95%'} />
                <MenuItem
                onPress={eliminarCuenta}
                label="Eliminar cuenta"
                icon={<MaterialIcons name="delete" color={Colors.white} size={25} />}
                logoutBtn={true}
                />
            </View>
            
        </View>
    )
}

