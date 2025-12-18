import { useEffect, useState } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request, check, RESULTS, openSettings } from 'react-native-permissions';
import axios from 'axios';
import { showToaster } from '../util/constants';
import Geocoder from 'react-native-geocoding';
import { customer_api_urls, rider_api_urls } from '../util/api/api_essentials';
import { getRiderId, getUserId, saveAdressCustomer } from '../util/local-storage/auth_service';
import { useDispatch } from 'react-redux';
import { addUserLocation, addAddressToUser, addDefaultAddressToUser, setPermissionLocation } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';


const GOOGLE_API_KEY =  'AIzaSyAjyGdmeJ8fyRP7eKPJ2ODtF0JEbqEbw8o';



export const useLocation = () => {
  const [user, setUser] = useState([]);
  const [hasLocation, setHasLocation] = useState(false);
  const [routeLines, setRouteLines] = useState([]);
  const [direccion, setDireccion] = useState([]);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);

  const dispatch = useDispatch();

  const [initialPosition, setInitialPosition] = useState({
    longitude: -99.22777616792496,
    latitude: 19.485297844903283
  });

  const [userLocation, setUserLocation] = useState({
    longitude: -99.22777616792496,
    latitude: 19.485297844903283
  });

  // Inicializar Geocoder una sola vez
  useEffect(() => {
    Geocoder.init(GOOGLE_API_KEY);
  }, []);


  const checkLocationPermission = async () => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      });

      if (!permission) {
        console.error('Platform not supported');
        return false;
      }

      const result = await check(permission);
      // console.log('Permission check result:', result);

      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      });

      if (!permission) {
        console.error('Platform not supported');
        return false;
      }

      // Primero verificar el estado actual
      const currentStatus = await check(permission);
      console.log('Current permission status:', currentStatus);

      // Si ya está granted, retornar true
      if (currentStatus === RESULTS.GRANTED) {
        return true;
      }

      // Si está bloqueado, mostrar alerta para ir a configuración
      if (currentStatus === RESULTS.BLOCKED) {
        Alert.alert(
          'Permiso Bloqueado',
          'Los permisos de ubicación están bloqueados. Debes habilitarlos en la configuración de la aplicación.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Configuración', onPress: () => openSettings() }
          ]
        );
        return false;
      }

      // Solicitar permiso
      const result = await request(permission);
      console.log('Permission request result:', result);

      if (result === RESULTS.GRANTED) {
        return true;
      }

      // Si fue denegado, mostrar alerta
      if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permiso Denegado',
          'Necesitamos acceso a tu ubicación para usar la aplicación. ¿Deseas habilitarlo?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir Configuración', onPress: () => openSettings() }
          ]
        );
        return false;
      }

      return false;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 10000,
          forceRequestLocation: true,
          showLocationDialog: true,
        }
      );
    });
  };

  
  const getLocationHook = async () => {
    try {
      // PASO 1: Verificar si ya tenemos permiso
      let hasPermission = await checkLocationPermission();

      // PASO 2: Si no tenemos permiso, solicitarlo
      if (!hasPermission) {
        hasPermission = await requestLocationPermission();
      }
      
      
      // PASO 3: Si no se otorgó permiso, salir
      if (!hasPermission) {
      
        await dispatch(setPermissionLocation(false))
        return false;
      }

   
      await dispatch(setPermissionLocation(true))
      // PASO 4: Pequeño delay para Android (importante)
      await new Promise(resolve => setTimeout(resolve, 100));

      // PASO 5: Obtener ubicación actual
      const location = await getCurrentLocation();


      // PASO 6: Actualizar estados
      setUserLocation(location);
      setHasLocation(true);

      // PASO 7: Actualizar Redux
      dispatch(addUserLocation({
        latitude: location.latitude,
        longitude: location.longitude
      }));

      // PASO 8: Geocodificar la ubicación
      await onMovePositionMaker(location);

      return true;
    } catch (error) {
      console.error('Error in getLocationHook:', error);
      showToaster('No se pudo obtener la ubicación actual.');
      return false;
    }
  };

  // ============================================
  // VERIFICAR PERMISOS AL INICIAR
  // ============================================
  useEffect(() => {
    const initializeLocation = async () => {
      setIsCheckingPermission(true);
      const hasPermission = await checkLocationPermission();
      // setLocationPermissionGranted(hasPermission);
      dispatch(setPermissionLocation(hasPermission))
      setIsCheckingPermission(false);

      // Si ya tiene permiso, obtener ubicación automáticamente
      if (hasPermission) {
        await getLocationHook();
      }
    };

    initializeLocation();
  }, []);

  // ============================================
  // OBTENER DIRECCIONES
  // ============================================
  const getAddresses = async () => {
    try {
      const apiCall = await axios.get(`${customer_api_urls.get_addresses}/${user?._id}`);

      if (apiCall.status === 200) {
        setDireccion(apiCall.data.data);
      } else {
        showToaster('Something went wrong please try again :/');
      }
    } catch (e) {
      console.error('Error getting addresses:', e);
      showToaster('Something went wrong please try again :/');
    }
  };

  // ============================================
  // ACTUALIZAR UBICACIÓN DEL RIDER
  // ============================================
  const updateUbication = async () => {
    try {
      const riderId = await getRiderId();

      // Si no hay ubicación válida, obtenerla primero
      if (userLocation.latitude === 0 || userLocation.longitude === 0) {
        const success = await getLocationHook();
        if (!success) {
          return;
        }
      }

      await axios.put(`${rider_api_urls.update_coords}`, {
        lat: userLocation.latitude,
        lng: userLocation.longitude,
        riderId
      });
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  // ============================================
  // GEOCODIFICAR POSICIÓN
  // ============================================
  const onMovePositionMaker = async (loc) => {
    try {
      
      
      const apiCall = await axios.post(`${customer_api_urls.geocode_addresses}`, loc);

      if (apiCall?.data.success) {
        const { address_components, formatted_address, geometry, place_id } = apiCall.data.data;

       

        await setUpLocation({
          address_components,
          formatted_address,
          latitude: geometry.location.lat,
          longitude: geometry.location.lng,
          place_id,
        });
      }
    } catch (error) {
      console.error('Error in onMovePositionMaker:', error);
    }
  };

  // ============================================
  // GUARDAR UBICACIÓN
  // ============================================
  const setUpLocation = async (data) => {
    try {
      const userId = await getUserId();
      
      if (!userId) {
        await saveAdressCustomer({
          ...data,
          _id: 1
        });

        dispatch(addDefaultAddressToUser(1));
        dispatch(addAddressToUser([{
          ...data,
          _id: 1
        }]));
      }
    } catch (e) {
      console.error('Error in setUpLocation:', e);
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo - Address');
    }
  };

  return {
    hasLocation,
    initialPosition,
    getCurrentLocation,
    userLocation,
    routeLines,
    direccion,
    user,
    getAddresses,
    getLocationHook,
    updateUbication,
    // locationPermissionGranted,
    isCheckingPermission,
    requestLocationPermission,
    checkLocationPermission,
 
        
    
  };
};

// import { useEffect, useState, useRef } from 'react';
// import {  Platform,  PermissionsAndroid, Alert, Linking } from 'react-native';

// import Geolocation from '@react-native-community/geolocation';
// import axios from 'axios';
// import { showToaster } from '../util/constants';
// import Geocoder from 'react-native-geocoding';
// import { customer_api_urls, rider_api_urls } from '../util/api/api_essentials';
// import { getRiderId, getUserId, saveAdressCustomer } from '../util/local-storage/auth_service';
// import { useDispatch } from 'react-redux';
// import { addUserLocation,addAddressToUser, addDefaultAddressToUser } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';


// export const useLocation = () => {
//     const [user, setUser] = useState([])
//     Geocoder.init('AIzaSyAjyGdmeJ8fyRP7eKPJ2ODtF0JEbqEbw8o');
//     const dispatch = useDispatch();
    
   
//     const [ hasLocation, setHasLocation ] = useState(false);
//     const [ routeLines, setRouteLines ] = useState([])
//     const [direccion, setDireccion] = useState([])
//     const [ initialPosition, setInitialPosition ] = useState({
//         longitude: -99.22777616792496,
//         latitude: 19.485297844903283
//     });

//     const [ userLocation, setUserLocation] = useState({
//         longitude: -99.22777616792496,
//         latitude: 19.485297844903283 
//     });


//     const getCurrentLocation = () => {
//         return new Promise( (resolve, reject) => {
//             Geolocation.getCurrentPosition(
//                 ({ coords }) => {
                    
//                     resolve({
//                         latitude: coords.latitude,
//                         longitude: coords.longitude
//                     });
    
//                 },
//                 (err) => reject({ err }), { enableHighAccuracy: true }
//             );
//         });
//     }



//     const getAddresses = async() => {
//         try {
       
//          const apiCall = await axios.get(`${customer_api_urls.get_addresses}/${user?._id}`);
        
//          if(apiCall.status == api_statuses.success) {
//             setDireccion(apiCall.data.data);
//          } else {
//              showToaster('Something went wrong please try again :/')
//          }
//         } catch(e) 
//         { 
           
            
//             showToaster('Something went wrong please try again :/')
//         }
//     }

//     const getLocationHook = async() => {
      
       
//         if (Platform.OS === 'ios') {
//             try {
//                 Geolocation.getCurrentPosition(
//                     (position) => {
//                         const currentLatitude = JSON.stringify(position.coords.latitude);
//                         const currentLongitude = JSON.stringify(position.coords.longitude);

//                         dispatch(addUserLocation({
//                           latitude:position?.coords?.latitude,
//                           longitude:position?.coords?.longitude
//                         }))
      
//                       onMovePositionMaker({
//                           latitude:position?.coords?.latitude,
//                           longitude:position?.coords?.longitude
//                       })

//                         return setUserLocation({
//                                 latitude:currentLatitude,
//                                 longitude:currentLongitude
//                         })
//                         }
//                     );
//             } catch (error) {   
//                Alert.alert(
//                             "Permiso Denegado",
//                             "Debes permitir el acceso a la ubicación para usar la aplicación. ¿Abrir Configuración?",
//                             [
//                               { text: "Cancelar", style: "cancel" },
//                               { text: "Abrir Configuración", onPress: () => Linking.openSettings() }
//                             ]
//                           );
//               return false;
//             }
           
 
              
//         }else{
//             try {
//             const granted = await PermissionsAndroid.request(
//               PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//               {
//                 'title': 'Permiso de ubicacións',
//                 'message': 'Esta aplicación necesita acceso a tu ubicación ' +
//                            'para que sepamos donde estas.'
//               }
//             )

           
            
//             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
             
              
//               await Geolocation.getCurrentPosition(res => {
               
                
//                 dispatch(addUserLocation({
//                     latitude:res?.coords?.latitude,
//                     longitude:res?.coords?.longitude
//                   }))

//                 onMovePositionMaker({
//                     latitude:res?.coords?.latitude,
//                     longitude:res?.coords?.longitude
//                 })
//                 return setUserLocation({
//                   latitude:res?.coords?.latitude,
//                   longitude:res?.coords?.longitude
//                 });
//               });
//             } else {
//                Alert.alert(
//                             "Permiso Denegado",
//                             "Debes permitir el acceso a la ubicación para usar la aplicación. ¿Abrir Configuración?",
//                             [
//                               { text: "Cancelar", style: "cancel" },
//                               { text: "Abrir Configuración", onPress: () => Linking.openSettings() }
//                             ]
//                           );
//                return false
//             }
        
//           } catch(e) {
//             // //console.log(e)
//            showToaster('No se pudo obtener la ubicación actual.')
//             Alert.alert(
//               "Permiso Denegado",
//               "Debes permitir el acceso a la ubicación para usar la aplicación. ¿Abrir Configuración?",
//               [
//                 { text: "Cancelar", style: "cancel" },
//                 { text: "Abrir Configuración", onPress: () => Linking.openSettings() }
//               ]
//             );
//            return false
//           }
//         }
        
//     }

//     const updateUbication = async () => {
    
//         try {
//             const riderId = await getRiderId();
           
//             if (userLocation.latitude == 0 || userLocation.longitude == 0) {
//                 await getLocationHook()
              
//             }
//             await axios.put(`${rider_api_urls.update_coords}`, {
//                 lat: userLocation?.latitude,
//                 lng: userLocation?.longitude,
//                 riderId
//              });
    
         
    
//         } catch (error) {
        
//         }
//     }


//     const onMovePositionMaker = async (loc) => {
//         try {
        
           
            
//             const apiCall = await axios.post(`${customer_api_urls.geocode_addresses}`, loc);
    
    
//           if (apiCall?.data.success) {
    
//             const { address_components, formatted_address, geometry, place_id } = apiCall?.data?.data

//             setUpLocation({
//                 address_components,
//                 formatted_address,
//                 latitude: geometry.location.lat,
//                 longitude: geometry.location.lng,
//                 place_id,
      
//               })
          
//           } 
    
    
          

    
//         } catch (error) {
//             console.log(error,'error move position');
            
//         }
    
//     }

//     const setUpLocation = async(data) => {
//         try {
         
          
//           const userId = await getUserId();
//           if (userId) {
//             // const apiCall = await axios.post(customer_api_urls.create_address,{
//             //     latitude:latitude,
//             //     longitude:longitude,
//             //     address_components,
//             //     formatted_address,
//             //     place_id,
//             //     userId,
//             // });
          
//           } else{
    
           
//             await saveAdressCustomer({
//               ...data,
//               _id:1
//             })

            
//             dispatch(addDefaultAddressToUser(1));
//             dispatch(addAddressToUser([{
//                 ...data,
//                 _id:1
//             }]));
         
//           }
         
      
//         } catch(e) {
         
                    
//           showToaster('Algo salió mal. Por favor, vuelva a intentarlo - Address');
//         //  //console.log(e?.response?.data)
//         }
//     }
   



    
    

//     return {
        // hasLocation,
        // initialPosition,
        // getCurrentLocation,
        // userLocation,
        // routeLines,
        // direccion,
        // user,
        // getAddresses,
        // getLocationHook,
        // updateUbication
//     }
// }
