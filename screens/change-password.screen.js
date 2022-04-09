import React, {useState} from 'react';
import {View} from 'react-native';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import TopCircleComponent from '../components/top-circle/top-circle.component';
import KEYBOARD_TYPES from '../util/keyboard-types';
import InputFieldComponent from '../components/input-field/input-field.component';
import Colors from '../util/styles/colors';
import ButtonComponent from '../components/button/button.component';
import {
  LOGIN_SIGNUP_FORGOT_ROUTES,
  SCREEN_HORIZONTAL_MARGIN,
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
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const CREDENTIAL_KEYS = {
  NEW_PASSWORD: 'New Password',
  OLD_PASSWORD: 'Old Password',
  CONFIRM_PASSWORD:'Confirm Password'
};

const ChangePasswordScreen = ({navigation}) => {
    const {params} = useRoute();
    console.log(params)
    const isResetPassword = params?.isResetPassword;
  const [loading,setLoading] = useState(false);
  const [oldPassword,setOldPassword] = useState('');
  const [newPassword,setNewPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('');

  const onChangeText = (inputText, key) => {
    setUserCredentials({
      [key]: inputText,
    });
  };

  const handleResetPassword = async() => {
    try {
      if(newPassword != confirmPassword) {
          showToaster('Passwords didnt match');
          return;
      }
      if(confirmPassword?.length < 6) {
          showToaster('Password must be 6 characters long atleast');
          return;
      }
      setLoading(true);
     const apiCall = await axios.post(api_urls.reset_password,{
       email:params?.email,
       newpassword:confirmPassword
     });
     setLoading(false);
     if(apiCall.status == api_statuses.success) {
        showToaster('Password changed successfully');
        navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN);
     } else {
         console.log(e)
       showToaster('Something went wrong')
     }
    } catch(e) {
      console.log(e)
      setLoading(false);
      showToaster(e?.response?.data?.message ?  e?.response?.data?.message :'Something went wrong')
    }
  };
  const handleChangePassword = async() => {
    try {
      setLoading(true);
     const apiCall = await axios.post(api_urls.reset_password,{
       email:userCredentials[CREDENTIAL_KEYS.NEW_PASSWORD],
       newpassword:userCredentials[CREDENTIAL_KEYS.NEW_PASSWORD]
     });
     setLoading(false);
     if(apiCall.status == api_statuses.success && apiCall?.data?.OTP) {
        showToaster('Password changed successfully');
        navigation.navigate(LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN);
     } else {
       showToaster('Something went wrong')
     }
    } catch(e) {
      setLoading(false);
      showToaster(e?.response?.data?.message ?  e?.response?.data?.message :'Something went wrong')
    }
  };

  return (
    <CustomSafeAreaViewComponent>
      <LoaderComponent isVisible={loading}/>
      <TopCircleComponent
        textHeading="Change Your Password"
        subText="Create a secure password"
      />
      <View
        style={[
          CommonStyles.flexCenter,
          {marginTop: SCREEN_HORIZONTAL_MARGIN},
        ]}>
            {
                !isResetPassword ?
                <InputFieldComponent
                icon={
                    <Ionicons
                    color={Colors.dark}
                    size={20}
                    name="lock-closed"
                  />
                }
                keyboardType={KEYBOARD_TYPES.DEFAULT}
                onChangeText={inputText => {
                  setOldPassword(inputText);
                }}
                placeholderText={'Old Password'}
                value={oldPassword}
                secureTextEntry={true}
              />
              :
              null
            }
          <InputFieldComponent
            icon={
                <Ionicons
                color={Colors.dark}
                size={20}
                name="lock-closed"
              />
            }
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={inputText2 => {
              setNewPassword(inputText2)
            }}
            placeholderText={'New Password'}
            value={newPassword}
            secureTextEntry={true}
          />
          <InputFieldComponent
            icon={
              <Ionicons
                color={Colors.dark}
                size={20}
                name="lock-closed"
              />
            }
            keyboardType={KEYBOARD_TYPES.DEFAULT}
            onChangeText={inputText3 => {
              setConfirmPassword(inputText3)
            }}
            placeholderText={'Confirm Password'}
            value={confirmPassword}
            secureTextEntry={true}
          />
       {
           isResetPassword? 
           <View style={{justifyContent: 'flex-end'}}>
           <SideOptionComponent
             text="Sign in to your account"
             textAlign="right"
             navigation={navigation}
             keyToRoute={LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN}
           />
         </View>
         :
         null
       }
      </View>
      <BottomContentComponent>
        <ButtonComponent
          colorB={Colors.primaryColor}
          buttonText={isResetPassword ? 'Reset' : 'Change'}
          handlePress={isResetPassword ? handleResetPassword : handleChangePassword}
        />
      </BottomContentComponent>
    </CustomSafeAreaViewComponent>
  );
};

export default ChangePasswordScreen;
