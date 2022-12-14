import React, { useEffect } from 'react';
import {
  Image,
  Alert,
  StyleSheet,
  Text,
  ToastAndroid,
  useWindowDimensions,
  View,
  Platform,
} from 'react-native';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import Spinner from 'react-native-spinkit';
import {getUserType, getUserId, saveBusinessProfile, saveBusinessStatus, getBusinessId, getBusinessProfile} from '../util/local-storage/auth_service';
import { MAIN_ROUTES, USER_ROLES } from '../util/constants';
import { api_statuses, api_urls, vendor_api_urls } from '../util/api/api_essentials';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import * as BusinessProfileActions from '../util/ReduxStore/Actions/VendorActions/BusinessProfleActions';
import { getStoreEarnings } from '../util/api/CommonFunctions';
import DeviceInfo from 'react-native-device-info';
import { BackgroundImage } from '../components/Background/BackgroundImage';
import { deviceWidth } from '../util/Dimentions';


const SplashScreen = ({navigation}) => {
  const {width, height} = useWindowDimensions();
  const dispatch = useDispatch();




  const getBusinessDetails = async(userId) => {
    try {
     const url = `${vendor_api_urls.business_profile}/${userId}`;
     const apiCall = await axios.get(url);
     if(apiCall.status == api_statuses.success) {
       dispatch(BusinessProfileActions.setActionMessage(apiCall.data.data.actions));
       await saveBusinessProfile(apiCall.data.data.store[0]);
       if(apiCall.data.data.isBlocked) {
        ToastAndroid.showWithGravity('Tu negocio está bloqueado.',ToastAndroid.LONG,ToastAndroid.CENTER);
        await saveBusinessStatus(true);
       }
     }
     else {
       Alert.alert('Algo salió mal','Lo siento por la interrupción, esta solicitud falló');
       return;
     }
    } 
    catch(e) {
      // console.log(e);
      Alert.alert('Algo salió mal','Lo siento por la interrupción, esta solicitud falló');
    }
  }

  const checkBuildApp = async() => {
    try {
      let version = DeviceInfo.getBuildNumber();
      console.log({version});
      let os = Platform.OS
      const url = `${api_urls.check_version}`;
      const apiCall = await axios.post(url,{
        os,
        version: parseInt(version)
       });

      if (!apiCall?.data?.success) {
        navigation.replace('UpdateScreen');
      }
     
      
    } catch (error) {
      console.log(error);
    }
  }

  const check_auth = async() => {
    const user_id = await getUserId();
    const userType = await getUserType();
     await checkBuildApp()
   
    // if (!appBuild) {
    //   return  navigation.replace('UpdateScreen');
    // }
    if(user_id && userType) {
      if(userType == USER_ROLES.vendor) {
        await getBusinessDetails(user_id);
        const businessId = await getBusinessId();
        const earnings = await getStoreEarnings(businessId);
        // console.log('earnings line 56',earnings)
        dispatch(BusinessProfileActions.setEarnings(earnings));
        navigation.replace(MAIN_ROUTES.VENDOR_STACK);

      } 
      if(userType == USER_ROLES.customer) {
        navigation.replace(MAIN_ROUTES.CUSTOMER_STACK);
      }
      if(userType == USER_ROLES.rider) {
        navigation.replace(MAIN_ROUTES.RIDER_STACK)
      }
    } else {
      // navigation.replace(MAIN_ROUTES.AUTH_STACK);
      navigation.replace(MAIN_ROUTES.CUSTOMER_STACK);

    }
  }
  useEffect(() => {
    check_auth()
  },[]);

  return (
    <CustomSafeAreaViewComponent>
      <View
        style={[
          styles.splashScreenHome,
          CommonStyles.flexCenter,
          {width: width, height: height},
        ]}>
        <BackgroundImage/>
        <Image
            source={require('../assets/images/logo1.png')}
            style={styles.logo}
        />
        <Spinner
        type='Circle'
        color={Colors.terciarySolid}
        size={50}
        />
      </View>
    </CustomSafeAreaViewComponent>
  );
};

const styles = StyleSheet.create({
  splashScreenHome: {
    backgroundColor: Colors.white,
  },
  mainFontStyles: {
    fontSize: 70,
    color: Colors.secondaryColorBlueShade,
  },
  logo:{
    resizeMode:'cover',
    height: 78,
    //   top: 1, 
    width: deviceWidth * 0.70,
  }
});

export default SplashScreen;
