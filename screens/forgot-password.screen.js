import React, {useState} from 'react';
import {View,StyleSheet} from 'react-native';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import TopCircleComponent from '../components/top-circle/top-circle.component';
import KEYBOARD_TYPES from '../util/keyboard-types';
import InputFieldComponent from '../components/input-field/input-field.component';
import Colors from '../util/styles/colors';
import ButtonComponent from '../components/button/button.component';
import {
  LOGIN_SIGNUP_FORGOT_ROUTES,
  SCREEN_HORIZONTAL_MARGIN,
  SCREEN_HORIZONTAL_MARGIN_FORM,
  showToaster,
} from '../util/constants';
import SideOptionComponent from '../components/top-circle/side-option.component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonStyles from '../util/styles/styles';
import BottomContentComponent from '../components/bottom-content/bottom-content.component';
import axios from 'axios';
import { api_statuses, api_urls } from '../util/api/api_essentials';
import LoaderComponent from '../components/Loader/Loader.component';

const CREDENTIAL_KEYS = {
  EMAIL_ADDRESS: 'Correo electrónico',
  OTP_CODE: 'Código de verificación',
};

const ForgotPasswordScreen = ({navigation}) => {
  const [loading,setLoading] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    [CREDENTIAL_KEYS.EMAIL_ADDRESS]: '',
    [CREDENTIAL_KEYS.OTP_CODE]: '',
  });
  const [recievedOtp,setRecievedOtp] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [email,setEmail] = useState('')

  const onChangeText = (inputText, key) => {
    setUserCredentials({
      [key]: inputText,
    });
  };

  const handleForgotPassword = async() => {
    try {
      setLoading(true);
     const apiCall = await axios.post(api_urls.forget_password,{
       email:email
     });
     setLoading(false);
     if(apiCall.status == api_statuses.success && apiCall?.data?.OTP) {
     setRecievedOtp(apiCall?.data?.OTP)
      setCodeSent(true);
     } else {
       showToaster('Algo salió mal')
     }
    } catch(e) {
      setLoading(false);
      showToaster(e?.response?.data?.message ?  e?.response?.data?.message :'Algo salió mal')
    }
  };
  const verifyOtp = () => {
    if(userCredentials[CREDENTIAL_KEYS.OTP_CODE] == recievedOtp ) {
    console.log(email)
      navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.CHANGE_PASSWORD,{
        email:email,
        isResetPassword:true
      });
    } else {
      showToaster('Invalid Otp');
      return
    }
  }

  return (
    <CustomSafeAreaViewComponent>
      <LoaderComponent isVisible={loading}/>
      <TopCircleComponent
        textHeading="¿Olvidaste tu contraseña?"
      />
      <View
        style={[
          CommonStyles.flexCenter,
          styles.body
        ]}>
          {codeSent ? (
            <InputFieldComponent
              icon={
                <MaterialCommunityIcons
                  color={Colors.dark}
                  size={28}
                  name="key-variant"
                />
              }
              keyboardType={KEYBOARD_TYPES.NUMBER_PAD}
              onChangeText={inputText => {
                onChangeText(inputText, CREDENTIAL_KEYS.OTP_CODE);
              }}
              placeholderText={CREDENTIAL_KEYS.OTP_CODE}
              value={userCredentials[CREDENTIAL_KEYS.OTP_CODE]}
              secureTextEntry={false}
            />
          ) : (
            <InputFieldComponent
              icon={
                <MaterialIcons
                  color={Colors.dark}
                  size={28}
                  name="email"
                />
              }
              keyboardType={KEYBOARD_TYPES.EMAIL_ADDRESS}
              onChangeText={inputText1 => {
                setEmail(inputText1)
              }}
              placeholderText={CREDENTIAL_KEYS.EMAIL_ADDRESS}
              value={email}
              secureTextEntry={false}
            />
          )}
          <View style={{justifyContent: 'flex-end'}}>
            <SideOptionComponent
              text="Iniciar sesión en su cuenta"
              textAlign="right"
              navigation={navigation}
              keyToRoute={LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN}
            />
          </View>
          <BottomContentComponent>
          <ButtonComponent
            colorB={Colors.terciarySolid}
            buttonText={codeSent ? 'Verificar' : 'ENVIAR CÓDIGO'}
            handlePress={codeSent ? verifyOtp : handleForgotPassword}
          />
        </BottomContentComponent>
      </View>
    </CustomSafeAreaViewComponent>
  );
};

export default ForgotPasswordScreen;
const styles = StyleSheet.create({
  body:{
    marginTop: SCREEN_HORIZONTAL_MARGIN,
    backgroundColor:Colors.white,
    paddingVertical:50,
    elevation:2,
    marginHorizontal:SCREEN_HORIZONTAL_MARGIN_FORM
    
  }
})