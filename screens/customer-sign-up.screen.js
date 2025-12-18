import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, Alert, Linking, ImageBackground, Pressable } from 'react-native';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import CommonStyles from '../util/styles/styles';
import {
  LOGIN_SIGNUP_FORGOT_ROUTES,

  showToaster,
} from '../util/constants';
import Colors from '../util/styles/colors';
import KEYBOARD_TYPES from '../util/keyboard-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { api_statuses, api_urls } from '../util/api/api_essentials';
import axios from 'axios';
import LoaderComponent from '../components/Loader/Loader.component';
import {  deviceWidth } from '../util/Dimentions';
import { comparaText } from '../util/helpers/StatusText';

import CheckboxTerms from '../components/button/CheckboxTerms';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderTitle } from '../components/Customer/HeaderTitle';
import { NewLogo } from '../components/NewLogo';
import { BtnPrincipal } from '../components/Customer/BtnPrincipal';
import { InputTxt } from '../components/Customer/InputTxt';
import { Center, HStack, Input, Radio, VStack } from 'native-base';



const CREDENTIAL_KEYS = {
  FULL_NAME: 'Nombre',
  LASTNAME: 'Apellidos',
  EMAIL_ADDRESS: 'Email',
  CONFIRM_EMAIL_ADDRESS: 'Confirmar Email',
  PHONE_NUMBER: 'Número de teléfono',
  IS_MECHANIC: '¿Buscas servicios para tu auto o eres un PRO de la mecanica?',
  PASSWORD: 'Contraseña',
  CONFIRMPASSWORD: 'Confirmar contraseña'
};

const CustomerSignUpScreen = ({ navigation }) => {


  const [showLoader, setShowLoader] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    [CREDENTIAL_KEYS.FULL_NAME]: '',
    [CREDENTIAL_KEYS.LASTNAME]: '',
    [CREDENTIAL_KEYS.EMAIL_ADDRESS]: '',
    [CREDENTIAL_KEYS.CONFIRM_EMAIL_ADDRESS]: '',
    [CREDENTIAL_KEYS.PHONE_NUMBER]: '',
    [CREDENTIAL_KEYS.PASSWORD]: '',
    [CREDENTIAL_KEYS.CONFIRMPASSWORD]: '',
  });
  const [isSelected, setIsSelected] = useState(false);
  const [show, setShow] = useState(false)
  const [showPass, setShowPass] = useState(false);
  const phoneNumberRef = useRef();
  const [value, setValue] = React.useState("client");




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
        msj: msj,
        role:value
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
    let valid = 
    comparaText(userCredentials[CREDENTIAL_KEYS.CONFIRMPASSWORD], 
      userCredentials[CREDENTIAL_KEYS.PASSWORD]) && 
      userCredentials[CREDENTIAL_KEYS.PASSWORD].length > 0;

    let emailValid = 
    comparaText(userCredentials[CREDENTIAL_KEYS.EMAIL_ADDRESS], 
      userCredentials[CREDENTIAL_KEYS.CONFIRM_EMAIL_ADDRESS]) && 
      userCredentials[CREDENTIAL_KEYS.EMAIL_ADDRESS].length > 0;

    if (!validPhone) {
      showToaster('Introduce un numero correcto');
      return
    }
  
    
    if (!emailValid) {
      showToaster('Verifica el correo, no coinciden');
      return
    }

    
    if (valid) {
      if (isSelected) {
        Alert.alert(
          "Código de verificación",
          "¿Porque medio desea recibir su código de verificación?",
          [
            // {
            //   text: "Correo",
            //   onPress: () => sendCode('email')
            // },
             {
              text: "Cancelar",
              onPress: () => {}
            },
            {
              text: "Enviar SMS",
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
                keyboardType={KEYBOARD_TYPES.DEFAULT}
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
                autoCapitalize='none'
                returnType="next"
              />


              <InputTxt
                label={'Confirmar Email'}
                keyboardType={KEYBOARD_TYPES.EMAIL_ADDRESS}
                onChangeText={inputText => {
                  onChangeText(inputText, CREDENTIAL_KEYS.CONFIRM_EMAIL_ADDRESS);
                }}
                placeholderText={CREDENTIAL_KEYS.CONFIRM_EMAIL_ADDRESS}
                secureTextEntry={false}
                value={userCredentials[CREDENTIAL_KEYS.CONFIRM_EMAIL_ADDRESS]}
                // ref={emailAddressRef}
                nextFieldRef={phoneNumberRef}
                returnType="next"
                autoCapitalize='none'

              />

              <Text style={{ ...CommonStyles.h2,marginTop:5 }} >{CREDENTIAL_KEYS.IS_MECHANIC}</Text>
              <Radio.Group 
              name="myRadioGroup" 
              accessibilityLabel="favorite number" 
              value={value} 
              onChange={nextValue => {setValue(nextValue)}}
            
              >
                <HStack justifyContent={'space-around'} width={'100%'} my={3} >
                  <Radio value="client" my={1}>
                    Consumidor
                  </Radio>
                  <Radio value="mechanic" my={1}>
                    Mecánico
                  </Radio>
                </HStack>
                
              </Radio.Group>

              <Text style={{ ...CommonStyles.h2 }} >{CREDENTIAL_KEYS.PASSWORD}</Text>

              <Input
              backgroundColor={Colors.bgInput}
              borderColor={Colors.darker}
              borderWidth={'1px'}
              borderRadius={'10px'}
              onChangeText={inputText => {
                onChangeText(inputText, CREDENTIAL_KEYS.PASSWORD);
              }}
              color={Colors.white}
              placeholder={CREDENTIAL_KEYS.PASSWORD}
              value={userCredentials[CREDENTIAL_KEYS.PASSWORD]}
              mt={'13px'}
              size={Platform.OS === 'ios' ? '2xl' : 'lg'}
              type={show ? "text" : "password"}
              InputRightElement={<Pressable onPress={() => setShow(!show)}
              style={{padding:10}}
              >
                <MaterialIcons name={show ? "visibility" : "visibility-off"}
                  size={25}
                  color={Colors.white}
                />
              </Pressable>}

            />
              
              

              <Input
                 backgroundColor={Colors.bgInput}
              borderColor={Colors.darker}
              borderWidth={'1px'}
              borderRadius={'10px'}
              onChangeText={inputText => {
                  onChangeText(inputText, CREDENTIAL_KEYS.CONFIRMPASSWORD);
                }}
                 color={Colors.white}
              placeholder={CREDENTIAL_KEYS.CONFIRMPASSWORD}
              value={userCredentials[CREDENTIAL_KEYS.CONFIRMPASSWORD]}
              mt={'13px'}
              size={Platform.OS === 'ios' ? '2xl' : 'lg'}
              type={showPass ? "text" : "password"}
              InputRightElement={<Pressable onPress={() => setShowPass(!showPass)}
              style={{padding:10}}
              >
                <MaterialIcons name={showPass ? "visibility" : "visibility-off"}
                  size={25}
                  color={Colors.white}
                />
              </Pressable>}
         
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
              <TouchableOpacity onPress={handlePress} >


             
              <CheckboxTerms
                isSelected={isSelected}
                roleName={'terminos'}
                text={'He leído y acepto los términos y condiciones de uso'}
                txtColor={Colors.white}
                handlePress={handlePress}

              />
               </TouchableOpacity>
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