import React, {useState} from 'react';
import {View,StyleSheet, Alert} from 'react-native';
import KEYBOARD_TYPES from '../util/keyboard-types';
import InputFieldComponent from '../components/input-field/input-field.component';
import Colors from '../util/styles/colors';
import ButtonComponent from '../components/button/button.component';
import {
  LOGIN_SIGNUP_FORGOT_ROUTES,
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
import { Text } from 'native-base';

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
    
      navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.CHANGE_PASSWORD,{
        email:email,
        isResetPassword:true
      });
    } else {
      showToaster('Invalid Otp');
      return
    }
  }


  const sendCode = async (msj) => {


    try {
      setLoading(true);
      const url = api_urls.regenerate_otp;
      const body = {
        email: email,
        msj: msj
      }

      
      const apiCall = await axios.post(url, body);

      
      if (apiCall.status == api_statuses.success && apiCall.data.success == true) {
        setLoading(false);

        navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.RECOVERY_OTP_PASSWORD, {
          otp: apiCall.data.otp,
          body: body
        });
      }
    } catch (e) {
     
      console.log(e);
      showToaster(e?.response?.data?.message)
      setLoading(false);
    }
  }

  const generateOtp = async () => {
   

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


  }

  return (
    <View style={styles.body} >
      <LoaderComponent isVisible={loading}/>
    
      <View
        style={[
          CommonStyles.flexCenter,
          styles.body
        ]}>
         
          
            <InputFieldComponent
              icon={
                <MaterialIcons
                  color={Colors.white}
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
         
         
          <BottomContentComponent>
          <ButtonComponent
            colorB={Colors.terciarySolid}
            buttonText={codeSent ? 'Verificar' : 'ENVIAR CÓDIGO'}
            handlePress={codeSent ? verifyOtp : generateOtp}
          />
        </BottomContentComponent>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;



const styles = StyleSheet.create({
  body:{
    ...CommonStyles.screenY,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  }
})