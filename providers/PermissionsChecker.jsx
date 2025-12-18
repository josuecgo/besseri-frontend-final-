import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useLocation } from '../hooks/useLocation';

export const PermissionsChecker = ({ children }) => {
  const { locationStatus, locationPermissionGranted} = useSelector((state) => state.user);
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  
  const {
    getLocationHook,
    
    isCheckingPermission,
    checkLocationPermission,
  } = useLocation();


  useEffect(() => {
    const initializePermissions = async () => {
    

    
      if (!locationPermissionGranted) {
        const success = await getLocationHook();
       

       
        if (!success) {
          
          navigation.reset({
            routes: [{ name: 'LocationScreenUpdate' }],
          });
        } else {
         
        }
      } else {
        // console.log('✅ Location permission already granted');
      }
    };

   
    if (!isCheckingPermission) {
      initializePermissions();
    }
  }, [isCheckingPermission]); 


  useEffect(() => {
    const recheckPermissions = async () => {
     
      if (!locationStatus && !locationPermissionGranted) {
        
        
        const hasPermission = await checkLocationPermission();
        
        if (!hasPermission) {
          
          navigation.reset({
            routes: [{ name: 'LocationScreenUpdate' }],
          });
        } else {
         
          await getLocationHook();
        }
      }
    };

    recheckPermissions();
  }, [locationStatus]);

 
 
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
       
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
         

          const hasPermission = await checkLocationPermission();

          if (hasPermission && !locationPermissionGranted) {
            await getLocationHook();
          } else if (!hasPermission) {
           
            navigation.reset({
              routes: [{ name: 'LocationScreenUpdate' }],
            });
          }
        }

        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [locationPermissionGranted]);


  useEffect(() => {
    // console.log('📊 PermissionsChecker State:', {
    //   locationStatus,
    //   locationPermissionGranted,
    //   isCheckingPermission,
    // });
  }, [locationStatus, locationPermissionGranted, isCheckingPermission]);

  return <>{children}</>;
};