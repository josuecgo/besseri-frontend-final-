import React, {useEffect} from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Platform,
} from 'react-native';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
import CustomSafeAreaViewComponent from '../components/custom-safe-area-view/custom-safe-area-view.component';
import {
  getUserType,
  getUserId,
} from '../util/local-storage/auth_service';
import {MAIN_ROUTES, showToaster, USER_ROLES} from '../util/constants';
import {
  api_urls,
} from '../util/api/api_essentials';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {deviceWidth} from '../util/Dimentions';
import Video from 'react-native-video';


const SplashScreen = ({navigation}) => {
  const {width, height} = useWindowDimensions();
  



  const checkBuildApp = async () => {
    try {
      let version = DeviceInfo.getBuildNumber();
      console.log({version});
      let os = Platform.OS;
      const url = `${api_urls.check_version}`;

      const apiCall = await axios.post(url, {
        os,
        version: parseInt(version),
      });

	  
	  return apiCall?.data?.success
     
    } catch (error) {
     
	  return  false
    }
  };

  const check_auth = async () => {
    let appBuild  =  await checkBuildApp();

    if (!appBuild) {
      return  navigation.replace('UpdateScreen');
    }
    const user_id = await getUserId();
    const userType = await getUserType();
    setTimeout(() => {
      if (user_id && userType) {
     
        if (userType == USER_ROLES.customer) {
          navigation.replace(MAIN_ROUTES.CUSTOMER_STACK);
        } else {
          showToaster('Usuario no encontrado.')
        }
      
      } else {
        // navigation.replace(MAIN_ROUTES.AUTH_STACK);
        navigation.replace(MAIN_ROUTES.CUSTOMER_STACK);
      }
    }, 2200);
    
  };
  useEffect(() => {
    check_auth();
  }, []);

  return (
    <CustomSafeAreaViewComponent>
      <View
        style={[
          styles.splashScreenHome,
          CommonStyles.flexCenter,
          {width: width, height: height},
        ]}>
      
      <Video source={require('../assets/besserLoading.mp4')}   // Can be a URL or a local file.
       ref={(ref) => {
        //  console.log(ref);
       }}                                      // Store reference
       onBuffer={()=>{}}                // Callback when remote video is buffering
       onError={()=>{}}               // Callback when video cannot be loaded
       style={styles.backgroundVideo} 
       repeat={false}
       resizeMode='cover'
       />

      </View>
    </CustomSafeAreaViewComponent>
  );
};

const styles = StyleSheet.create({
  splashScreenHome: {
    backgroundColor: Colors.black,
  },
  backgroundVideo: {
    
    width:deviceWidth ,
    height:'60%'
  },
});

export default SplashScreen;
