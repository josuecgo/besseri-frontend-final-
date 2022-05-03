import { useEffect, useState, useRef } from 'react';
import {  Platform,  PermissionsAndroid } from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { showToaster } from '../util/constants';
import Geocoder from 'react-native-geocoding';



export const useLocation = () => {
    const [user, setUser] = useState([])
    Geocoder.init('AIzaSyAjyGdmeJ8fyRP7eKPJ2ODtF0JEbqEbw8o');
   
    
    
   
    const [ hasLocation, setHasLocation ] = useState(false);
    const [ routeLines, setRouteLines ] = useState([])
    const [direccion, setDireccion] = useState([])
    const [ initialPosition, setInitialPosition ] = useState({
        longitude: 0,
        latitude: 0
    });

    const [ userLocation, setUserLocation] = useState({
        longitude: 0,
        latitude: 0
    });


   
    
    const watchId = useRef();
    const isMounted = useRef(true);


    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        }
    }, [])

    

    useEffect(() => {
        getLocationHook()
        getCurrentLocation()
            .then( location => {

                if( !isMounted.current ) return;

                setInitialPosition(location);
                setUserLocation(location);
                setRouteLines( routes => [ ...routes, location ])
                setHasLocation(true);
            });

    }, []);


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
            console.log(e.response)
            
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
                        return setUserLocation({
                                latitude:currentLatitude,
                                longitude:currentLongitude
                        })
                        }
                    );
            } catch (error) {
                console.log(error);
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
                return setUserLocation({
                  latitude:res?.coords?.latitude,
                  longitude:res?.coords?.longitude
                });
              });
            } else {
              console.log("Location permission denied")
            }
        
          } catch(e) {
            console.log(e)
           showToaster('No se pudo obtener la ubicación actual.')
          }
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
        getLocationHook
    }
}
