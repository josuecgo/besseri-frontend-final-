import { useEffect, useState, useRef } from 'react';

import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { showToaster } from '../util/constants';



export const useLocation = () => {
    const [user, setUser] = useState([])

   
    
    
   
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

    const followUserLocation = () => {
        watchId.current = Geolocation.watchPosition(
            ({ coords }) => {

                if( !isMounted.current ) return;


                const location = {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                }

                setUserLocation( location );
                setRouteLines( routes => [ ...routes, location ]);

            },
            (err) => console.log(err), { enableHighAccuracy: true, distanceFilter: 10 }
        );
    }

    const stopFollowUserLocation = () => {
        if( watchId.current )
            Geolocation.clearWatch( watchId.current );
    }

    const getAddresses = async() => {
        try {
            ;
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

    
    

    return {
        hasLocation,
        initialPosition,
        getCurrentLocation,
        followUserLocation,
        stopFollowUserLocation,
        userLocation,
        routeLines,
        direccion,
        user,
        getAddresses
    }
}
