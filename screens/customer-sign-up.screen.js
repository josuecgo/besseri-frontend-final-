import React, {useRef, useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import TopCircleComponent from '../components/top-circle/top-circle.component';
import CommonStyles from '../util/styles/styles';
import {
  LOGIN_SIGNUP_FORGOT_ROUTES,
  SCREEN_HORIZONTAL_MARGIN,
} from '../util/constants';
import Colors from '../util/styles/colors';
import KEYBOARD_TYPES from '../util/keyboard-types';
import InputFieldComponent from '../components/input-field/input-field.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ButtonComponent from '../components/button/button.component';
import { api_statuses, api_urls } from '../util/api/api_essentials';
import axios from 'axios';
import LoaderComponent from '../components/Loader/Loader.component';

const CREDENTIAL_KEYS = {
  FULL_NAME: 'Full Name',
  EMAIL_ADDRESS: 'Email Address',
  PHONE_NUMBER: 'Phone Number (+923XXXXXXXXX)',
  PASSWORD: 'Password'
};

const CustomerSignUpScreen = ({navigation}) => {
  const {width, height} = useWindowDimensions();
  
  const [showLoader,setShowLoader] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    [CREDENTIAL_KEYS.FULL_NAME]: '',
    [CREDENTIAL_KEYS.EMAIL_ADDRESS]: '',
    [CREDENTIAL_KEYS.PHONE_NUMBER]: '',
    [CREDENTIAL_KEYS.PASSWORD] : ''
  });

  const emailAddressRef = useRef();
  const phoneNumberRef = useRef();
  const passwordRef = useRef();
  const onChangeText = (inputText, key) => {
    setUserCredentials({
      ...userCredentials,
      [key]: inputText,
    });
  };
  const generateOtp = async () => {
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
        isRider:false
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
  return (
    <CustomSafeAreaViewComponent>
      <LoaderComponent isVisible={showLoader}/>
      <TopCircleComponent
        textHeading="Create Customer Account"
        subText="Want auto parts at your door step or require services, we've got you covered"
      />
      <View
        style={[
          CommonStyles.flexCenter,
          CommonStyles.justifySpaceBetween,
          {marginTop: SCREEN_HORIZONTAL_MARGIN},
        ]}>
        <View style={CommonStyles.flexCenter}>
          <InputFieldComponent
            icon={<Ionicons color={Colors.dark} size={20} name="person" />}
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
            icon={
              <MaterialIcons
                color={Colors.dark}
                size={20}
                name="alternate-email"
              />
            }
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
            icon={<Ionicons color={Colors.dark} size={20} name="person" />}
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
            icon={<Ionicons color={Colors.dark} size={20} name="person" />}
            onChangeText={inputText => {
              onChangeText(inputText, CREDENTIAL_KEYS.PASSWORD);
            }}
            placeholderText={CREDENTIAL_KEYS.PASSWORD}
            secureTextEntry={true}
            value={userCredentials[CREDENTIAL_KEYS.PASSWORD]}
            ref={passwordRef}
          />
          <ButtonComponent
            marginTop={SCREEN_HORIZONTAL_MARGIN}
            colorB={Colors.primaryColor}
            buttonText="CREATE ACCOUNT"
            handlePress={generateOtp}
            width={200}
          />
        </View>
      </View>
    </CustomSafeAreaViewComponent>
  );
};

export default CustomerSignUpScreen;
