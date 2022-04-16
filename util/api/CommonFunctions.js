import axios from "axios";
import { Alert, PermissionsAndroid } from "react-native";
import { showToaster } from "../constants";
import { api_statuses, api_urls, rider_api_urls, vendor_api_urls } from "./api_essentials";
import Geolocation from "@react-native-community/geolocation";
export const getStoreEarnings = async(storeId) => {
    try {
     const apiCall = await axios.get(`${vendor_api_urls.get_earnings}/${storeId}`);
     if(apiCall.status == api_statuses.success) {
       return apiCall.data.data
     } else {
       showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
     }
    } catch(e) {
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
    }
  }

  export const getRiderEarnings = async(riderId) => {
    try {
     const apiCall = await axios.get(`${rider_api_urls.get_earnings}/${riderId}`);
     if(apiCall.status == api_statuses.success) {
       console.log(apiCall.data.data)
       return apiCall.data.data
     } else {
       showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
     }
    } catch(e) {
      console.log(e?.response?.data)
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
    }
  }  

export const getLocation = async() => {
    try {
      let loc = null;
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Besseri',
          'message': 'Besseri necesita ubicación para mostrarte las tiendas cercanas'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(response => {
          loc = response.coords
        });
        return loc;
      } else {
        console.log("location permission denied")
        showToaster("Permiso de ubicación denegado");
      }
    } catch(e) {
        showToaster('No pude obtener tu ubicación')
    }
  }