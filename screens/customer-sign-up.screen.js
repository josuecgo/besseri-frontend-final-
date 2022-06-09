import React, {useRef, useState} from 'react';
import {StyleSheet, View,Text,Alert} from 'react-native';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import TopCircleComponent from '../components/top-circle/top-circle.component';
import CommonStyles from '../util/styles/styles';
import {
  LOGIN_SIGNUP_FORGOT_ROUTES,
  SCREEN_HORIZONTAL_MARGIN,
  SCREEN_HORIZONTAL_MARGIN_FORM,
  showToaster,
} from '../util/constants';
import Colors from '../util/styles/colors';
import KEYBOARD_TYPES from '../util/keyboard-types';
import InputFieldComponent from '../components/input-field/input-field.component';

import ButtonComponent from '../components/button/button.component';
import { api_statuses, api_urls } from '../util/api/api_essentials';
import axios from 'axios';
import LoaderComponent from '../components/Loader/Loader.component';
import { deviceHeight } from '../util/Dimentions';
import { ButtonIconoInput } from '../components/button/ButtonIconoInput';
import { comparaText } from '../util/helpers/StatusText';

import CheckboxTerms from '../components/button/CheckboxTerms';



const CREDENTIAL_KEYS = {
  FULL_NAME: 'Nombre completo',
  EMAIL_ADDRESS: 'Dirección de correo electrónico',
  PHONE_NUMBER: 'Número de teléfono',
  PASSWORD: 'Contraseña',
  PASSWORDCONFIRM: 'Confirmar contraseña'
};

const CustomerSignUpScreen = ({navigation}) => {
  

  const [showLoader,setShowLoader] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    [CREDENTIAL_KEYS.FULL_NAME]: '',
    [CREDENTIAL_KEYS.EMAIL_ADDRESS]: '',
    [CREDENTIAL_KEYS.PHONE_NUMBER]: '',
    [CREDENTIAL_KEYS.PASSWORD] : '',
    [CREDENTIAL_KEYS.CONFIRMPASSWORD] : '',
  });
  const [isSelected, setIsSelected] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [showPass2, setShowPass2] = useState(true);
  const emailAddressRef = useRef();
  const phoneNumberRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const onChangeText = (inputText, key) => {
    setUserCredentials({
      ...userCredentials,
      [key]: inputText,
    });
  };
  



  const sendCode = async(msj) => {
    

    try {
      setShowLoader(true);
      const url = api_urls.generate_otp;
      const body = {
        email: userCredentials[CREDENTIAL_KEYS.EMAIL_ADDRESS],
        name: userCredentials[CREDENTIAL_KEYS.FULL_NAME],
        phone: userCredentials[CREDENTIAL_KEYS.PHONE_NUMBER],
        password: userCredentials[CREDENTIAL_KEYS.PASSWORD],
        isCommonUser:true,
        isVendor:false,
        isRider:false,
        msj:msj
      }
      const apiCall = await axios.post(url,body);
      if (apiCall.status == api_statuses.success && apiCall.data.success == true) {
        setShowLoader(false);
        console.log(apiCall.data)
        navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.OTP_PASSWORD, {
          otp: apiCall.data.otp,
          body:body
        });
      }
    } catch (e) {
      console.log(e)
      console.log(e.response.data)
      alert(e.response.data.message)
      setShowLoader(false);
    }
  }

  const generateOtp = async () => {
    if (comparaText(userCredentials[CREDENTIAL_KEYS.CONFIRMPASSWORD],userCredentials[CREDENTIAL_KEYS.PASSWORD]) && userCredentials[CREDENTIAL_KEYS.PASSWORD].length > 0) {
      if (isSelected) {
        Alert.alert(
          "Código de verificación",
          "¿Porque medio desea recibir su código de verificación?",
          [
            {
              text: "Correo",
              onPress: () => sendCode('email')
            },
            {
              text: "SMS",
              onPress: () => sendCode('sms'),
              
            },
            // { text: "Whatsapp", onPress: () => sendCode('whatsapp') }
          ]
        );
      } else {
        showToaster('Acepta términos y condiciones de uso')
      }
    }else{
      showToaster('Contraseñas no coinciden')
    }
    
    
  }
  

  const handlePress = () => {
    
    setIsSelected(!isSelected)
    

  };

  return (
    <CustomSafeAreaViewComponent>
      <LoaderComponent isVisible={showLoader}/>
      <TopCircleComponent
        textHeading="Crear cuenta de cliente"
      />
      


      <View
        style={[
          CommonStyles.flexCenter,
          CommonStyles.justifySpaceBetween,
          styles.body,
        ]}>
        <View style={CommonStyles.flexCenter}>
          <InputFieldComponent
            // icon={<Ionicons color={Colors.dark} size={20} name="person" />}
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={inputText => {
              onChangeText(inputText, CREDENTIAL_KEYS.FULL_NAME);
            }}
            placeholderText={CREDENTIAL_KEYS.FULL_NAME}
            secureTextEntry={false}
            value={userCredentials[CREDENTIAL_KEYS.FULL_NAME]}
            nextFieldRef={emailAddressRef}
            returnType="next"
          />
          <InputFieldComponent
            
            keyboardType={KEYBOARD_TYPES.EMAIL_ADDRESS}
            onChangeText={inputText => {
              onChangeText(inputText, CREDENTIAL_KEYS.EMAIL_ADDRESS);
            }}
            placeholderText={CREDENTIAL_KEYS.EMAIL_ADDRESS}
            secureTextEntry={false}
            value={userCredentials[CREDENTIAL_KEYS.EMAIL_ADDRESS]}
            ref={emailAddressRef}
            nextFieldRef={phoneNumberRef}
            returnType="next"
          />
          <InputFieldComponent
           
            keyboardType={KEYBOARD_TYPES.PHONE_PAD}
            onChangeText={inputText => {
              onChangeText(inputText, CREDENTIAL_KEYS.PHONE_NUMBER);
            }}
            placeholderText={CREDENTIAL_KEYS.PHONE_NUMBER}
            secureTextEntry={false}
            value={userCredentials[CREDENTIAL_KEYS.PHONE_NUMBER]}
            ref={phoneNumberRef}
          />
          
          <InputFieldComponent
            
            onChangeText={inputText => {
              onChangeText(inputText, CREDENTIAL_KEYS.PASSWORD);
            }}
            placeholderText={CREDENTIAL_KEYS.PASSWORD}
            secureTextEntry={showPass}
            value={userCredentials[CREDENTIAL_KEYS.PASSWORD]}
            ref={passwordRef}
            showPass={
              <ButtonIconoInput name={showPass ?'eye-slash' : 'eye'} size={16} onPress={() => setShowPass(!showPass) } />
            }
          />

          <InputFieldComponent
            
            onChangeText={inputText => {
              onChangeText(inputText, CREDENTIAL_KEYS.CONFIRMPASSWORD);
            }}
            placeholderText={'Confirmar contraseña'}
            secureTextEntry={showPass2}
            value={userCredentials[CREDENTIAL_KEYS.CONFIRMPASSWORD]}
            ref={passwordConfirmRef}
            showPass={
              <ButtonIconoInput name={showPass2 ? 'eye-slash' : 'eye'} size={16} onPress={() => setShowPass2(!showPass2) } />
            }
          />

          <CheckboxTerms 
          isSelected={isSelected}
          roleName={'terminos'} 
          text={'He leído y acepto los términos y condiciones de uso'} 
          txtColor='black' 
          handlePress={handlePress} 
          
          />
         

          <ButtonComponent
            marginTop={SCREEN_HORIZONTAL_MARGIN}
            colorB={Colors.terciarySolid}
            buttonText="CREAR CUENTA"
            handlePress={generateOtp}
            width={200}
          />
        </View>
      </View>
    </CustomSafeAreaViewComponent>
  );
};

export default CustomerSignUpScreen;

const styles = StyleSheet.create({
  body:{
    marginTop: deviceHeight * 0.15,
    backgroundColor:Colors.white,
    paddingVertical: deviceHeight * 0.10,
    marginHorizontal: SCREEN_HORIZONTAL_MARGIN_FORM,
    elevation:1
  }
})