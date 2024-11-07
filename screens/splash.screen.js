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
  getUserAddress,
  getCarActive,
} from '../util/local-storage/auth_service';
import {MAIN_ROUTES, showToaster, USER_ROLES} from '../util/constants';
import {
  api_urls,
} from '../util/api/api_essentials';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {deviceWidth} from '../util/Dimentions';
import Video from 'react-native-video';
import { useDispatch } from 'react-redux';
import { addAddressToUser, addCarActiveToUser, addCarsToUser, addToUser } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';
import { getUser } from '../util/local-storage/auth_service';


const SplashScreen = ({navigation,route}) => {
  const {width, height} = useWindowDimensions();
  const dispatch = useDispatch()



  const checkBuildApp = async () => {
    try {
      let version = DeviceInfo.getBuildNumber();
      
      let os = Platform.OS;
     
      const url = `${api_urls.check_version}`;

      const apiCall = await axios.post(url, {
        os,
        version: parseInt(version),
      });

      
	  return apiCall?.data?.success
     
    } catch (error) {
     console.log(error,'errors');
	    return  false
    }
  };

  const check_auth = async () => {
    let appBuild  =  await checkBuildApp();
     
    if (!appBuild) {
      return  navigation.replace('UpdateScreen');
    }
    const user_id = await getUserId();
    const user    = await getUser()
    const userType = await getUserType();
    const addressCustomer = await getUserAddress();
    const carActive = await getCarActive();

    
    if (user) { dispatch(addToUser(user))}

    if (addressCustomer && carActive ) {
        
      await dispatch(addAddressToUser(addressCustomer));
      await dispatch(addCarActiveToUser(carActive));
     
     
    }

  
    
    setTimeout(async() => {
      if (user_id && userType ) {
        
        
        if (userType == USER_ROLES.customer) {
          navigation.replace(MAIN_ROUTES.CUSTOMER_HOME_STACK);
        } else {
          showToaster('Usuario no encontrado.')
        }
      
      } else {
       
        if (addressCustomer && carActive ) {
        
        
         
          navigation.replace(MAIN_ROUTES.CUSTOMER_HOME_STACK);
        }else{
          navigation.replace(MAIN_ROUTES.CUSTOMER_STACK);
        }
       
      }
    }, 2200);
    
  };
 
  useEffect(() => {
    let isMounted = true;
  
    const runCheckAuth = async () => {
      if (isMounted) {
        await check_auth();
      }
    };
  
    runCheckAuth();
  
    return () => {
      isMounted = false;
    };
  }, []);


  
  return (
    <CustomSafeAreaViewComponent>
      <View
        style={[
          styles.splashScreenHome,
          CommonStyles.flexCenter,
          {width: width, height: height,justifyContent: 'center',
          alignItems: 'center',},
        ]}>
      
      <Video source={require('../assets/besserLoading.mp4')}   // Can be a URL or a local file.
       ref={(ref) => {
       
       }}                                    
       onBuffer={()=>{}}           
       onError={()=>{}}          
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
