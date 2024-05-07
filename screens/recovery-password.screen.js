import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import CommonStyles from '../util/styles/styles'
import { Box, Text, VStack } from 'native-base'
import BtnCode from '../components/button/BtnCode'
import { CREDENTIAL_KEYS } from './vendor/vendor-addservice.screen'
import { LOGIN_SIGNUP_FORGOT_ROUTES, showToaster } from '../util/constants'
import { BtnPrincipal } from '../components/Customer/BtnPrincipal'
import { InputTxt } from '../components/Customer/InputTxt'
import axios from 'axios'
import { customer_api_urls } from '../util/api/api_essentials'
import LoaderComponent from '../components/Loader/Loader.component'

const RecoveryPasswordScreen = ({route,navigation}) => {
  const [userCredentials, setUserCredentials] = useState({
    [CREDENTIAL_KEYS.OTP_CODE]: '',
    [CREDENTIAL_KEYS.PASSWORD]: '',
    [CREDENTIAL_KEYS.REPEAT_PASSWORD]: '',
  });
  const [showPass, setShowPass] = useState(true);
  const email = route.params?.body?.email
  const onChangeText = (inputText, key) => {

    setUserCredentials({
      ...userCredentials,
      [key]: inputText,
    });


  };
  const [loader, setLoader] = useState(false)

  

  const conChangePassword = async() => {
    if (!userCredentials[CREDENTIAL_KEYS.OTP_CODE] || !userCredentials[CREDENTIAL_KEYS.PASSWORD]) {
      showToaster('Por favor, completa todos los campos');
      return;
    }

    if (userCredentials[CREDENTIAL_KEYS.REPEAT_PASSWORD] !== userCredentials[CREDENTIAL_KEYS.PASSWORD] ) {
      showToaster('Contraseñas no coinciden');
      return
    }
    if (userCredentials[CREDENTIAL_KEYS.OTP_CODE] === route.params.otp.toString()) {
      setLoader(true)
      await sendRecoveryPassword()
      setLoader(false)

    }else{
      showToaster('Código no valido')
    }
  }

  const sendRecoveryPassword = async() => {
    try {
      const apiCall =  await axios.post(customer_api_urls.changepassword,{
        email:email,
        oldpassword:userCredentials[CREDENTIAL_KEYS.REPEAT_PASSWORD],
        newpassword:userCredentials[CREDENTIAL_KEYS.PASSWORD]
      });

    
      showToaster(apiCall.data?.message);

      navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN)

    } catch (error) {
        console.log(error,'sendRecoveryPassword');
        showToaster('No se pudo cambiar la contraseña');
    }
  }

  return (
    <View style={styles.body} >
      <LoaderComponent isVisible={loader} />
       <Text>Ingresa la nueva contraseña y el código que recibiste</Text>
      <VStack space={3} py={5}>
       
        <Text>Código que recibiste</Text>
        <BtnCode
          onChangeText={onChangeText}
        />

        <InputTxt
          label={'Nueva Contraseña'}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.PASSWORD);
          }}
          placeholderText={CREDENTIAL_KEYS.PASSWORD}
          secureTextEntry={showPass}
          value={userCredentials[CREDENTIAL_KEYS.PASSWORD]}
       
        />

        <InputTxt
          label={'Repetir Contraseña'}
          onChangeText={inputText => {
            onChangeText(inputText, CREDENTIAL_KEYS.REPEAT_PASSWORD);
          }}
          placeholderText={CREDENTIAL_KEYS.REPEAT_PASSWORD}
          secureTextEntry={showPass}
          value={userCredentials[CREDENTIAL_KEYS.REPEAT_PASSWORD]}
       
        />

       
      </VStack>
      <BtnPrincipal text={'Cambiar contraseña'} onPress={conChangePassword} />
    </View>
  )
}

export default RecoveryPasswordScreen

const styles = StyleSheet.create({
  body: {
    ...CommonStyles.screenY,
    paddingHorizontal:10
  }
})