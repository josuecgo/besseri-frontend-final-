import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomSafeAreaViewComponent from '../../../components/custom-safe-area-view/custom-safe-area-view.component'
import { HeaderTitle } from '../../../components/Customer/HeaderTitle'
import { InputTxt } from '../../../components/Customer/InputTxt'
import { CREDENTIAL_KEYS } from '../../vendor/vendor-addservice.screen'
import { Box, Heading } from 'native-base'
import { BtnPrincipal } from '../../../components/Customer/BtnPrincipal'
import axios from 'axios'
import { api_urls, customer_api_urls } from '../../../util/api/api_essentials'
import { MAIN_ROUTES, showToaster } from '../../../util/constants'
import { saveCarActive, saveUserData, saveUserId, saveUserType } from '../../../util/local-storage/auth_service'
import { addDefaultAddressToUser, addToUser } from '../../../util/ReduxStore/Actions/CustomerActions/UserInfoActions'
import { useDispatch } from 'react-redux'
import { useInfoUser } from '../../../hooks/useInfoUsers'
import LoaderComponent from '../../../components/Loader/Loader.component'

export const UserRegisterScreen = ({route,navigation}) => {
    const data = route.params
    const [userCredentials, setUserCredentials] = useState({
        password: '',
        repeatPassword: '',
    });
    const { getUserInfo, getPedidosUser } = useInfoUser()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)

    const onChangeText = (inputText, key) => {
    
        setUserCredentials({
          ...userCredentials,
          [key]: inputText,
        });
      };
      
   
     
      const changePassword = async() => {
        try {
            if (userCredentials.password.length <= 0) {
                showToaster('Ingrese una contraseñas');
            }

            if(userCredentials.password !== userCredentials.repeatPassword) {
                showToaster('Las contraseñas no coinciden');
                return;
            }
            setIsLoading(true)

            const values = {
                email:data?.email,
                oldpassword:userCredentials.password,
                newpassword:userCredentials.repeatPassword
            }
            const apiCall2 = await axios.post(customer_api_urls.changepassword,values);

            const url = api_urls.login;
            const body = {
              email: data?.email,
              password:userCredentials.password
            }
      
            const apiCall = await axios.post(url, body);
            const { user } = apiCall?.data?.data;
            await saveUserId(user?._id);
            await saveUserType(user)
            await saveUserData(user);
            dispatch(addToUser(user))
            if (user?.carActive) {
                await saveCarActive(user?.isCarActive);


            }
            const userInfo = await getUserInfo(user[0])
            dispatch(addDefaultAddressToUser(userInfo[0]?._id))
            await getPedidosUser()

            setIsLoading(false)
            navigation.replace(MAIN_ROUTES.CUSTOMER_HOME_STACK);

        } catch (error) {
            console.log(error,'error');
            setIsLoading(false)
        }
      }
    
    return (
        <CustomSafeAreaViewComponent>
            <HeaderTitle titulo={'Termina tu registro'} />
            <LoaderComponent isVisible={isLoading} />
            <ScrollView contentContainerStyle={styles.content} >
                <Heading size='md' >Cambia tu contraseña</Heading>
                <InputTxt
                    label={'Contraseña'}
                    onChangeText={inputText => {
                    onChangeText(inputText, 'password');
                    }}
                    placeholderText={CREDENTIAL_KEYS.PASSWORD}
                  
                    value={userCredentials.password}
               
                />

                <InputTxt
                    label={'Repetir Contraseña'}
                    onChangeText={inputText => {
                    onChangeText(inputText, 'repeatPassword');
                    }}
                    placeholderText={CREDENTIAL_KEYS.REPEAT_PASSWORD}
                    value={userCredentials.repeatPassword}
                />
            </ScrollView>
            <BtnPrincipal text={'Actualizar'} onPress={changePassword} />
        </CustomSafeAreaViewComponent>
    )
}

 

const styles = StyleSheet.create({
    content:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})