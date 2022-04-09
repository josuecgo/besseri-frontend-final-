import React, {useRef, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View,Alert} from 'react-native';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
import InputFieldComponent from '../components/input-field/input-field.component';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import KEYBOARD_TYPES from '../util/keyboard-types';
import {
  LOGIN_SIGNUP_FORGOT_ROUTES,
  MAIN_ROUTES,
  SCREEN_HORIZONTAL_MARGIN,
  showToaster,
} from '../util/constants';
import ButtonComponent from '../components/button/button.component';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import TopCircleComponent from '../components/top-circle/top-circle.component';
import SideOptionComponent from '../components/top-circle/side-option.component';
import BottomContentComponent from '../components/bottom-content/bottom-content.component';
import {emailValidator, passwordValidator} from '../util/validations';
import { api_statuses, api_urls, rider_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import axios from 'axios';
import Loader from '../components/Loader/Loader.component';
import {saveBusinessProfile, saveBusinessStatus, saveRiderProfile, saveUserData} from '../util/local-storage/auth_service';
import { useDispatch } from 'react-redux';
import * as  BusinessProfileActions from '../util/ReduxStore/Actions/VendorActions/BusinessProfleActions';
const CREDENTIAL_KEYS = {
  EMAIL_ADDRESS: 'Email Address',
  PASSWORD: 'Password',
};

const LoginScreen = ({navigation}) => {
  const {width, height} = useWindowDimensions();

  const [userCredentials, setUserCredentials] = useState({
    [CREDENTIAL_KEYS.EMAIL_ADDRESS]: '',
    [CREDENTIAL_KEYS.PASSWORD]: '',
  });
  const [showLoader,setShowLoader] = useState(false);
  const dispatch = useDispatch();
  const passwordRef = useRef();

  const onChangeText = (inputText, key) => {
    setUserCredentials({
      ...userCredentials,
      [key]: inputText,
    });
  };
  const getBusinessDetails = async(userId,userData) => {
    try {
      setShowLoader(true);
     const url = `${vendor_api_urls.business_profile}/${userId}`;
     const apiCall = await axios.get(url);
     setShowLoader(false);
     if(apiCall.status == api_statuses.success) {
       console.log(apiCall.data);
       await saveBusinessProfile(apiCall.data.data.store[0]);
      //  if(apiCall.data.data.isBlocked) {
        //  showToaster('Your business is blocked.');
        dispatch(BusinessProfileActions.setActionMessage(apiCall.data.data.actions));
        await saveBusinessStatus(true);
        await saveUserData(userData);
        navigation.replace(MAIN_ROUTES.VENDOR_STACK);
        setUserCredentials({
          [CREDENTIAL_KEYS.EMAIL_ADDRESS]:"",
          [CREDENTIAL_KEYS.PASSWORD]:""
        })
       //}
     }
     else {
       Alert.alert('Something went wrong','Sorry for interruption this request was failed -1');
       return;
     }
    } 
    catch(e) {
      setShowLoader(false);
      console.log(e);
      Alert.alert('Something went wrong','Sorry for interruption this request was failed');
    }
  }

  const getRiderDetails = async(userId,userData) => {
    try {
      setShowLoader(true);
     const url = `${rider_api_urls.get_details}/${userId}`;
     const apiCall = await axios.get(url);
     setShowLoader(false);
     if(apiCall.status == api_statuses.success) {
       console.log(apiCall.data);
       await saveRiderProfile(apiCall.data.data);
        //  showToaster('Your profile is blocked.');
        await saveUserData(userData);
        navigation.replace(MAIN_ROUTES.RIDER_STACK);
        setUserCredentials({
          [CREDENTIAL_KEYS.EMAIL_ADDRESS]:"",
          [CREDENTIAL_KEYS.PASSWORD]:""
        })
       
     }
     else {
       console.log('this called')
       Alert.alert('Something went wrong','Sorry for interruption this request was failed -1');
       return;
     }
    } 
    catch(e) {
      setShowLoader(false);
      console.log(e);
      Alert.alert('Somethinxg went wrong','Sorry for interruption this request was failed');
    }
  }

  const handleSignIn = async() => {
    try {
      setShowLoader(true);
    const url = api_urls.login;
    const body = {
      email:userCredentials[CREDENTIAL_KEYS.EMAIL_ADDRESS],
      password:userCredentials[CREDENTIAL_KEYS.PASSWORD]
    }
    console.log(body);
    const apiCall = await axios.post(url,body);
    setShowLoader(false);
    if(apiCall?.status != api_statuses.success) {
      showToaster(apiCall?.data?.info?.message ? apiCall?.data?.info?.message : 'Something went wrong');
      return;
    }
    console.log(apiCall?.status);
    const data = apiCall.data.data[0]
    if(apiCall.status == api_statuses.success) {
      setShowLoader(false);
      if(data.isVendor) {
        await getBusinessDetails(data?._id,data);
      
      }
      if(data.isCommonUser) {
        await saveUserData(data);
        navigation.replace(MAIN_ROUTES.CUSTOMER_STACK);
      }
      if(data.isRider) {
        await getRiderDetails(data?._id,data)
      }
    }
    console.log(apiCall?.status)
    } catch(e) { 
      console.log(e);
      setShowLoader(false);
  
    }
  };

  return (
    <CustomSafeAreaViewComponent>
      <Loader isVisible={showLoader}/>
      <TopCircleComponent
        textHeading="Welcome!"
        subText="Sign in to continue"
      />
      <View
        style={[
          CommonStyles.flexCenter,
          CommonStyles.justifySpaceBetween,
          {marginTop: SCREEN_HORIZONTAL_MARGIN},
        ]}>
        <View style={CommonStyles.flexCenter}>
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
            value={userCredentials[CREDENTIAL_KEYS.EMAIL_ADDRESS]}
            secureTextEntry={false}
            nextFieldRef={passwordRef}
            returnType="next"
            validator={emailValidator}
            hintText="Please enter valid email"
          />
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
            ref={passwordRef}
            returnType="default"
            validator={passwordValidator}
            hintText="Please enter valid password"
          />
          <SideOptionComponent
            text="Forgot Password?"
            textAlign="right"
            navigation={navigation}
            keyToRoute={LOGIN_SIGNUP_FORGOT_ROUTES.FORGOT_PASSWORD}
          />
          <ButtonComponent
          width={160}
            marginTop={20}
            colorB={Colors.primaryColor}
            buttonText="SIGN IN"
            handlePress={handleSignIn}
          />
        </View>
      </View>
      <BottomContentComponent>
        <Text style={[CommonStyles.fontFamily]}>
          <Text>New User? </Text>
          <Text
            onPress={() => {
              navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.SIGN_UP);
            }}
            style={styles.signUpText}>
            SIGN UP
          </Text>
        </Text>
      </BottomContentComponent>
    </CustomSafeAreaViewComponent>
  );
};

const styles = StyleSheet.create({
  topColor: {
    backgroundColor: Colors.primaryColor,
    transform: [{translateY: -150}],
  },
  brandNameTitle: {
    color: Colors.white,
    fontSize: 40,
    transform: [{translateY: 120}],
  },
  forgotPasswordContainer: {
    alignItems: 'flex-start',
  },
  signUpText: {
    color: Colors.primaryColor,
    width: 300,
    paddingLeft: 10,
  },
});

export default LoginScreen;
