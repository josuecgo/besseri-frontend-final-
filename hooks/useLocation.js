import { useEffect, useState, useRef } from 'react';
import {  Platform,  PermissionsAndroid } from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { showToaster } from '../util/constants';
import Geocoder from 'react-native-geocoding';
import { customer_api_urls, rider_api_urls } from '../util/api/api_essentials';
import { getRiderId, getUserId, saveAdressCustomer } from '../util/local-storage/auth_service';
import { useDispatch } from 'react-redux';
import { addUserLocation,addAddressToUser, addDefaultAddressToUser } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';


export const useLocation = () => {
    const [user, setUser] = useState([])
    Geocoder.init('AIzaSyAjyGdmeJ8fyRP7eKPJ2ODtF0JEbqEbw8o');
    const dispatch = useDispatch();
    
   
    const [ hasLocation, setHasLocation ] = useState(false);
    const [ routeLines, setRouteLines ] = useState([])
    const [direccion, setDireccion] = useState([])
    const [ initialPosition, setInitialPosition ] = useState({
        longitude: -99.22777616792496,
        latitude: 19.485297844903283
    });

    const [ userLocation, setUserLocation] = useState({
        longitude: -99.22777616792496,
        latitude: 19.485297844903283 
    });


    const getCurrentLocation = () => {
        return new Promise( (resolve, reject) => {
            Geolocation.getCurrentPosition(
                ({ coords }) => {
                    
                    resolve({
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    });
    
                },
                (err) => reject({ err }), { enableHighAccuracy: true }
            );
        });
    }



    const getAddresses = async() => {
        try {
       
         const apiCall = await axios.get(`${customer_api_urls.get_addresses}/${user?._id}`);
        
         if(apiCall.status == api_statuses.success) {
            setDireccion(apiCall.data.data);
         } else {
             showToaster('Something went wrong please try again :/')
         }
        } catch(e) 
        { 
           
            
            showToaster('Something went wrong please try again :/')
        }
    }

    const getLocationHook = async() => {
      
       
        if (Platform.OS === 'ios') {
            try {
                Geolocation.getCurrentPosition(
                    (position) => {
                        const currentLatitude = JSON.stringify(position.coords.latitude);
                        const currentLongitude = JSON.stringify(position.coords.longitude);

                        dispatch(addUserLocation({
                          latitude:position?.coords?.latitude,
                          longitude:position?.coords?.longitude
                        }))
      
                      onMovePositionMaker({
                          latitude:position?.coords?.latitude,
                          longitude:position?.coords?.longitude
                      })

                        return setUserLocation({
                                latitude:currentLatitude,
                                longitude:currentLongitude
                        })
                        }
                    );
            } catch (error) {   
              console.log(error,'getLocationHook ios');
              
            }
           
 
              
        }else{
            try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                'title': 'Permiso de ubicación',
                'message': 'Esta aplicación necesita acceso a tu ubicación ' +
                           'para que sepamos donde estas.'
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
             
              
              await Geolocation.getCurrentPosition(res => {
               
                
                dispatch(addUserLocation({
                    latitude:res?.coords?.latitude,
                    longitude:res?.coords?.longitude
                  }))

                onMovePositionMaker({
                    latitude:res?.coords?.latitude,
                    longitude:res?.coords?.longitude
                })
                return setUserLocation({
                  latitude:res?.coords?.latitude,
                  longitude:res?.coords?.longitude
                });
              });
            } else {
              console.log('else get location hook');
              
            }
        
          } catch(e) {
            // //console.log(e)
           showToaster('No se pudo obtener la ubicación actual.')
          }
        }
        
    }

    const updateUbication = async () => {
    
        try {
            const riderId = await getRiderId();
           
            if (userLocation.latitude == 0 || userLocation.longitude == 0) {
                await getLocationHook()
              
            }
            await axios.put(`${rider_api_urls.update_coords}`, {
                lat: userLocation?.latitude,
                lng: userLocation?.longitude,
                riderId
             });
    
         
    
        } catch (error) {
        
        }
    }


    const onMovePositionMaker = async (loc) => {
        try {
        
           
            
            const apiCall = await axios.post(`${customer_api_urls.geocode_addresses}`, loc);
    
    
          if (apiCall?.data.success) {
    
            const { address_components, formatted_address, geometry, place_id } = apiCall?.data?.data

            setUpLocation({
                address_components,
                formatted_address,
                latitude: geometry.location.lat,
                longitude: geometry.location.lng,
                place_id,
      
              })
          
          } 
    
    
          

    
        } catch (error) {
            console.log(error,'error move position');
            
        }
    
    }

    const setUpLocation = async(data) => {
        try {
         
          
          const userId = await getUserId();
          if (userId) {
            // const apiCall = await axios.post(customer_api_urls.create_address,{
            //     latitude:latitude,
            //     longitude:longitude,
            //     address_components,
            //     formatted_address,
            //     place_id,
            //     userId,
            // });
          
          } else{
    
           
            await saveAdressCustomer({
              ...data,
              _id:1
            })

            
            dispatch(addDefaultAddressToUser(1));
            dispatch(addAddressToUser([{
                ...data,
                _id:1
            }]));
         
          }
         
      
        } catch(e) {
         
          console.log(e,'setUpLocation');
          
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo - Address');
        //  //console.log(e?.response?.data)
        }
      }
   



    
    

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
        updateUbication
    }
}
