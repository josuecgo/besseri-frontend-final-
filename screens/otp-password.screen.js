import React, {useState} from 'react';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import TopCircleComponent from '../components/top-circle/top-circle.component';
import {useWindowDimensions, View,Text} from 'react-native';
import {INCREMENT_CONSTANT, LOGIN_SIGNUP_FORGOT_ROUTES, MAIN_ROUTES, SCREEN_HORIZONTAL_MARGIN, showToaster} from '../util/constants';
import CommonStyles from '../util/styles/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../util/styles/colors';
import KEYBOARD_TYPES from '../util/keyboard-types';
import InputFieldComponent from '../components/input-field/input-field.component';
import ButtonComponent from '../components/button/button.component';
import { useRoute } from '@react-navigation/core';
import { api_statuses, api_urls, vendor_api_urls } from '../util/api/api_essentials';
import axios from 'axios';
import LoaderComponent from '../components/Loader/Loader.component';
import { deviceWidth } from '../util/Dimentions';

const CREDENTIAL_KEYS = {
  OTP_CODE: 'Código de verificación',
  PASSWORD: 'Contraseña',
};
const OtpPasswordScreen = ({navigation}) => {
  const route = useRoute();
  const mensajero = route.params.body?.msj;
  const logo = route?.params?.logo;
  const correo = route.params.body.email;
  const phone = route.params.body.phone;
  const {width, height} = useWindowDimensions();
  const [isEnteringOTP, setEnteringOTP] = useState(true);
  const [showLoader,setShowLoader] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    [CREDENTIAL_KEYS.OTP_CODE]: '',
    [CREDENTIAL_KEYS.PASSWORD]: '',
  });
 

  const onChangeText = (inputText, key) => {
    setUserCredentials({
      ...userCredentials,
      [key]: inputText,
    });
  };
  
  const uploadLogo = async() => {
    try {
      if(route.params.body.isCommonUser) {
        registerApiCall();
        return
      }
      const imageData = new FormData();
      imageData.append('logo',{
        uri:logo?.path,
        type:logo?.mime,
        name:'logo.jpg'
      })
      
      setShowLoader(true);
      const apiCall = await axios.post(vendor_api_urls?.upload_business_logo,imageData);
      setShowLoader(false);
      if(apiCall?.status == api_statuses?.success) {
        console.log(apiCall?.data)
        registerApiCall(apiCall?.data?.path);
      } else {
        showToaster('Algo salió mal inténtalo de nuevo')
      }
    } catch(e) {
      console.log(e)
      console.log(e?.response?.data)
      setShowLoader(false)
       showToaster('Algo salió mal')
    }
  }
  const registerApiCall = async (path) => {
    try {
      const url = api_urls.registration;
      
      const body = route.params.body;
      // if((route.params?.body?.isRider || route.params?.body?.isVendor || route.params.body.isCommonUser) && path) {
        setShowLoader(true);
        const apiCall = await axios.post(url, {
          ...body,
          ...(route.params?.body?.isVendor ? {logo:path} : {}),
          ...(route.params?.body?.isRider ? {profile:path} : {}),
        });
        
        if (apiCall.status == api_statuses.success) {
          
          console.log(apiCall?.data?.data);
          setShowLoader(false);
          navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN);
        } else {
          alert('error')
          setShowLoader(false)
        }
       
        setShowLoader(false)
      //}
     
      
    } catch (e) {
      setShowLoader(false);
      console.log({e})
    }
    setShowLoader(false);
  }


 

  return (
    <CustomSafeAreaViewComponent>
      <LoaderComponent isVisible={showLoader}/>
      <TopCircleComponent textHeading="Verifique su correo electrónico" />
      <View
        style={[
          {height: height - (width + INCREMENT_CONSTANT * 3),
            marginTop:30,backgroundColor:Colors.white,
            alignItems:'center',
            justifyContent:'center',
            marginHorizontal:10,
            elevation:1
          },
        ]}>
        <View style={[CommonStyles.flexCenter]}>
          {isEnteringOTP ? (
            <>
              <View style={{alignItems:'center',width:deviceWidth,marginVertical:15}} >
                <Text>{ mensajero === 'email' ? 'Se ha enviado un correo a' : mensajero === 'sms' ? 'Se ha enviado un SMS con un codigo a' : 'Se ha enviado un Whatsapp con un codigo a' }  </Text>
                <Text style={{fontWeight:'bold'}} >
                { mensajero === 'email' ? correo : phone}
                </Text>
                { mensajero === 'email' && <Text style={{opacity:0.5}} >Revise su bandeja de correo no deseado</Text> }
              </View>
              
              <InputFieldComponent
                icon={
                  <MaterialCommunityIcons
                    name="key-variant"
                    color={Colors.dark}
                    size={20}
                  />
                }
                keyboardType={KEYBOARD_TYPES.NUMERIC}
                onChangeText={inputText => {
                  onChangeText(inputText, CREDENTIAL_KEYS.OTP_CODE);
                }}
                placeholderText={CREDENTIAL_KEYS.OTP_CODE}
                value={userCredentials[CREDENTIAL_KEYS.OTP_CODE]}
                secureTextEntry={false}
              />
            </>
            
          ) : (
            <>
            <View style={{alignItems:'center'}} >
              <Text>Se ha enviado un codigo a  {correo}</Text>
            </View>
              
              <InputFieldComponent
                icon={
                  <MaterialCommunityIcons
                    name="key-variant"
                    color={Colors.dark}
                    size={20}
                  />
                }
                keyboardType={KEYBOARD_TYPES.DEFAULT}
                onChangeText={inputText => {
                  onChangeText(inputText, CREDENTIAL_KEYS.PASSWORD);
                }}
                placeholderText={CREDENTIAL_KEYS.PASSWORD}
                value={userCredentials[CREDENTIAL_KEYS.PASSWORD]}
                secureTextEntry={true}
              />
            </>
            
          )}
          <ButtonComponent
            marginTop={SCREEN_HORIZONTAL_MARGIN}
            colorB={Colors.terciarySolid}
            buttonText={isEnteringOTP ? 'Verificar' : 'Set Password'}
            handlePress={() => {
              if(userCredentials[CREDENTIAL_KEYS.OTP_CODE] == route.params.otp) {
                if(route?.params?.body?.isVendor || route?.params?.body?.isRider) {
                  uploadLogo()
                } else {
                  registerApiCall()
                }
              } else {
                showToaster('Invalid code');
                return;
              }
            }}
          />
        </View>
      </View>
    </CustomSafeAreaViewComponent>
  );
};

export default OtpPasswordScreen;
