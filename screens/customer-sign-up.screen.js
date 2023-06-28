import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, Alert, Linking, ImageBackground } from 'react-native';
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
import { adjust, deviceHeight, deviceWidth } from '../util/Dimentions';
import { ButtonIconoInput } from '../components/button/ButtonIconoInput';
import { comparaText } from '../util/helpers/StatusText';

import CheckboxTerms from '../components/button/CheckboxTerms';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderTitle } from '../components/Customer/HeaderTitle';
import { NewLogo } from '../components/NewLogo';
import { BtnPrincipal } from '../components/Customer/BtnPrincipal';
import { InputTxt } from '../components/Customer/InputTxt';
import { Center, HStack, VStack } from 'native-base';



const CREDENTIAL_KEYS = {
  FULL_NAME: 'Nombre',
  LASTNAME: 'Apellidos',
  EMAIL_ADDRESS: 'Email',
  PHONE_NUMBER: 'Número de teléfono',
  PASSWORD: 'Contraseña',
  PASSWORDCONFIRM: 'Confirmar contraseña'
};

const CustomerSignUpScreen = ({ navigation }) => {


  const [showLoader, setShowLoader] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    [CREDENTIAL_KEYS.FULL_NAME]: '',
    [CREDENTIAL_KEYS.LASTNAME]: '',
    [CREDENTIAL_KEYS.EMAIL_ADDRESS]: '',
    [CREDENTIAL_KEYS.PHONE_NUMBER]: '',
    [CREDENTIAL_KEYS.PASSWORD]: '',
    [CREDENTIAL_KEYS.CONFIRMPASSWORD]: '',
  });
  const [isSelected, setIsSelected] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const phoneNumberRef = useRef();


  const onChangeText = (inputText, key) => {
    setUserCredentials({
      ...userCredentials,
      [key]: inputText,
    });
  };




  const sendCode = async (msj) => {


    try {
      setShowLoader(true);
      const url = api_urls.generate_otp;
      const body = {
        email: userCredentials[CREDENTIAL_KEYS.EMAIL_ADDRESS],
        name: userCredentials[CREDENTIAL_KEYS.FULL_NAME],
        lastname:userCredentials[CREDENTIAL_KEYS.LASTNAME],
        phone: userCredentials[CREDENTIAL_KEYS.PHONE_NUMBER],
        password: userCredentials[CREDENTIAL_KEYS.PASSWORD],
        isCommonUser: true,
        isVendor: false,
        isRider: false,
        msj: msj
      }
      const apiCall = await axios.post(url, body);
      if (apiCall.status == api_statuses.success && apiCall.data.success == true) {
        setShowLoader(false);

        navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.OTP_PASSWORD, {
          otp: apiCall.data.otp,
          body: body
        });
      }
    } catch (e) {
      // //console.log(e)
      // //console.log(e.response.data)

      showToaster(e.response.data.message)
      setShowLoader(false);
    }
  }

  const generateOtp = async () => {
    let validPhone = userCredentials[CREDENTIAL_KEYS.PHONE_NUMBER].length > 9
    // let validName = userCredentials[CREDENTIAL_KEYS.FULL_NAME].length > 0 && userCredentials[CREDENTIAL_KEYS.LASTNAME].length > 0
    // let valid = comparaText(userCredentials[CREDENTIAL_KEYS.CONFIRMPASSWORD], userCredentials[CREDENTIAL_KEYS.PASSWORD]) && userCredentials[CREDENTIAL_KEYS.PASSWORD].length > 0;


    if (!validPhone) {
      showToaster('Introduce un numero correcto');
      return
    }

    if (true) {
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
    } else {
      showToaster('Contraseñas no coinciden')
    }


  }


  const handlePress = () => {

    if (isSelected) {
      setIsSelected(!isSelected)
    } else {
      Alert.alert(
        "",
        "Aceptar terminos y condiciones",
        [
          {
            text: "Leer terminos y condiciones",
            onPress: () => navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.PRIVACY_POLICY),

          },
          { text: "Si acepto", onPress: () => setIsSelected(!isSelected) }
        ]
      );
    }


  };

  const goPoliticas = async () => {

    await Linking.openURL('https://besserimx.com/');

  }

  return (

    <CustomSafeAreaViewComponent>
      {/* <HeaderTitle titulo={'Registrarse'} nav={() => navigation.goBack()} /> */}
      <ImageBackground
        source={require('../assets/images/car_fondo.png')}
        style={[styles.content]}
      >
        <VStack space={12}  >
          <LoaderComponent isVisible={showLoader} />

          <View style={styles.logoContent} >
            <NewLogo width={deviceWidth * 0.3} height={deviceWidth * 0.12} />
          </View>


          <View style={[styles.body]}>

            <VStack mx={3} >
              <HStack justifyContent={'space-between'} >
              <InputTxt
                label={'Nombre'}
                // placeholderText={'Email'}
                keyboardType={KEYBOARD_TYPES.DEFAULT}
                onChangeText={inputText => {
                  onChangeText(inputText, CREDENTIAL_KEYS.FULL_NAME);
                }}
                placeholderText={CREDENTIAL_KEYS.FULL_NAME}
                secureTextEntry={false}
                value={userCredentials[CREDENTIAL_KEYS.FULL_NAME]}
                // ref={emailAddressRef}
                returnType="next"
                double={true}
              />
              <InputTxt
                label={'Apellidos'}
                // placeholderText={'Email'}
                keyboardType={KEYBOARD_TYPES.EMAIL_ADDRESS}
                onChangeText={inputText => {
                  onChangeText(inputText, CREDENTIAL_KEYS.LASTNAME);
                }}
                placeholderText={CREDENTIAL_KEYS.LASTNAME}
                secureTextEntry={false}
                value={userCredentials[CREDENTIAL_KEYS.LASTNAME]}
                
                returnType="next"
                double={true}

              />
              </HStack>
              <InputTxt
                label={'Email'}
                // placeholderText={'Email'}
                keyboardType={KEYBOARD_TYPES.EMAIL_ADDRESS}
                onChangeText={inputText => {
                  onChangeText(inputText, CREDENTIAL_KEYS.EMAIL_ADDRESS);
                }}
                placeholderText={CREDENTIAL_KEYS.EMAIL_ADDRESS}
                secureTextEntry={false}
                value={userCredentials[CREDENTIAL_KEYS.EMAIL_ADDRESS]}
                // ref={emailAddressRef}
                nextFieldRef={phoneNumberRef}
                returnType="next"
              />
              <InputTxt
                label={'Contraseña'}
                onChangeText={inputText => {
                  onChangeText(inputText, CREDENTIAL_KEYS.PASSWORD);
                }}
                placeholderText={CREDENTIAL_KEYS.PASSWORD}
                secureTextEntry={showPass}
                value={userCredentials[CREDENTIAL_KEYS.PASSWORD]}
              // ref={passwordRef}
              />
              <InputTxt
                label={CREDENTIAL_KEYS.PHONE_NUMBER}

                keyboardType={KEYBOARD_TYPES.PHONE_PAD}
                onChangeText={inputText => {
                  onChangeText(inputText, CREDENTIAL_KEYS.PHONE_NUMBER);
                }}
                placeholderText={CREDENTIAL_KEYS.PHONE_NUMBER}
                secureTextEntry={false}
                value={userCredentials[CREDENTIAL_KEYS.PHONE_NUMBER]}
              // ref={phoneNumberRef}

              />
            </VStack>

            <Center>
              <TouchableOpacity onPress={goPoliticas} >


              </TouchableOpacity>
              <CheckboxTerms
                isSelected={isSelected}
                roleName={'terminos'}
                text={'He leído y acepto los términos y condiciones de uso'}
                txtColor={Colors.white}
                handlePress={handlePress}

              />
              <TouchableOpacity onPress={goPoliticas} >
                <Text style={{ ...CommonStyles.h2 }} >Politicas de privacidad</Text>
              </TouchableOpacity>

            </Center>
            {/* <ButtonComponent
    marginTop={SCREEN_HORIZONTAL_MARGIN}
    colorB={Colors.terciarySolid}
    buttonText="CREAR CUENTA"
    handlePress={generateOtp}
    width={200}
  />  */}


          </View>

          <View>
            <TouchableOpacity onPress={() => navigation.goBack()} >
              <HStack justifyContent={'center'} >
                <Text style={{ ...CommonStyles.h2 }} >¿Ya tienes una cuenta? {' '}</Text>
                <Text style={[CommonStyles.h2, { color: Colors.primaryColor }]}>INGRESA</Text>
              </HStack>

            </TouchableOpacity>

            <BtnPrincipal
              text={'Crear perfil'}
              onPress={generateOtp}
            />
          </View>
        </VStack>

      </ImageBackground>

    </CustomSafeAreaViewComponent>

  );
};

export default CustomerSignUpScreen;

const styles = StyleSheet.create({
  body: {

    // justifyContent:'space-around',
    flex: 1,

  },
  logoContent: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 0,
    marginTop: 5
    // marginTop: 15
  },
  content: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'space-around',
    // borderWidth:3,borderColor:'red',
    // height:deviceHeight * 0.9
  },
})