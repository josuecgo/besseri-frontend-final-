// login, sign up, forgot password, stack
import { LOGIN_SIGNUP_FORGOT_ROUTES, ROLES} from '../util/constants';
import LoginScreen from './login.screen';
import SignUpScreen from './sign-up.screen';
import ForgotPasswordScreen from './forgot-password.screen';
import VendorSsSignUpScreen from './vendor-ss-sign-up.screen';
import CustomerSignUpScreen from './customer-sign-up.screen';
import OtpPasswordScreen from './otp-password.screen';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RiderSignup from './rider/rider.signup.screen';
import ChangePasswordScreen from './change-password.screen';
import { HomePageScreen } from './HomePageScreen';
import SignUpScreenCustomer from './sign-up.screen-customer';
import PrivacyPolicy from './privacypolicy.screen';


const Stack = createStackNavigator();



export const LSFS = ({route}) => {


  
  return (
    <Stack.Navigator 
    screenOptions={{headerShown: false}}
    // initialRouteName={initial}
    >

     
      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN}
        component={LoginScreen}
      />

      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.CUSTOMER_SIGN_UP}
        component={CustomerSignUpScreen}
      />



      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.SIGN_UP_CUSTOMER}
        component={SignUpScreenCustomer}
      />
      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.SIGN_UP}
        component={SignUpScreen}
      />
      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.VENDOR_SIGN_UP}
        component={VendorSsSignUpScreen}
        initialParams={{role: ROLES.BUSINESS}}
      />
       <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.RIDER_SIGN_UP}
        component={RiderSignup}
        initialParams={{role: ROLES.BUSINESS}}
      />

      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.OTP_PASSWORD}
        component={OtpPasswordScreen}
      />
      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.CHANGE_PASSWORD}
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.PRIVACY_POLICY}
        component={PrivacyPolicy}
      />
      {/* <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.INICIAR}
        component={iniciar}
      /> */}
    </Stack.Navigator>
  );
};
