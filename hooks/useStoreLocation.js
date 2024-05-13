

import axios from 'axios';
import { useCallback, useContext, useState } from 'react';
import { api_statuses, api_urls, customer_api_urls } from '../util/api/api_essentials';
import { getUser, getUserAddress, getUserId, saveAdressCustomer, saveCarActive, saveGarage } from '../util/local-storage/auth_service';
import { useDispatch, useSelector } from 'react-redux';
import { addAddressToUser, addCarActiveToUser, addCarsToUser, addToUser, getYearsCars, saveNotification } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';
import { useEffect } from 'react';
import { showAlertLogin, showToaster, showToasterError } from '../util/constants';
import { getOrdersUser, isLoadingOrdersUser } from '../util/ReduxStore/Actions/CustomerActions/PedidosAction';
import { ProductContext } from '../util/context/Product/ProductContext';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Alert, Platform } from 'react-native';




export const useInfoUser = (  ) => {
  

    const getAddresses = async ({navigation}) => {
        try {
    
          const userId = await getUserId();
          if (!userId) {
          
          if(direccionStore){
            const data = {
              _id:1,
              ...direccionStore[0]
            }
       
          setAddresses([data]);
          setDefaultAddress(1)
            return
          }
            showAlertLogin(goLogin,goCancel)
            return
          }
          const apiCall = await axios.get(`${customer_api_urls.get_addresses}/${userId}`);
    
    
          if (apiCall?.data?.data.length <= 0) {
            Alert.alert('No tienes ninguna direccion', 'Crea una direccion', [
              {
                text: 'Cancelar',
                onPress: () => props.navigation.goBack(),
                style: 'cancel',
              },
              { text: 'Crear', onPress: () => navigation.navigate('Mi dirección') },
            ]);
          } else {
            setAddresses(apiCall.data.data);
            if (apiCall?.data?.data.length > 0) {
              setDefaultAddress(apiCall.data.data[0]._id)
    
            } else {
              setDefaultAddress(null)
            }
          }
    
        } catch (e) {
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 2')
        }
      }

  
  return {
    
  }

}