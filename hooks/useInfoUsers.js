
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
import { Platform } from 'react-native';




export const useInfoUser = (  ) => {
  const dispatch = useDispatch()
  const {
      getCategorias
  } = useContext(ProductContext)
  const { modeloValue,modelos }  = useSelector(state => state.user);


  const getUserInfo = useCallback(async () => {
    try {
      const id = await getUserId();
      const user = await getUser();
      if (!id) {
        return;
      }

     
  
      const apiCall = await axios(`${customer_api_urls.get_info_user}/${id}`);
  
      if (apiCall.status === api_statuses.success) {
        const { carActive, myAddresses, garage } = apiCall.data.data;
        console.log({ carActive, myAddresses });
        dispatch(addToUser(user));
        if (carActive) {
          dispatch(addCarActiveToUser(carActive));
          await saveCarActive(carActive);
        }

        if (myAddresses) {
          dispatch(addAddressToUser(myAddresses));
          await saveAdressCustomer(myAddresses);
        }
        if (garage) {
          dispatch(addCarsToUser(garage));
          await saveGarage(garage);
        }
       
       
  
      
      
  
      
     
  
        if (carActive) {
          getCategorias();
        }
      }
    } catch (error) {
      console.log('info user');
      showToaster(error?.response?.data?.message, 'code - IU56');
    }
  }, []);
  
  const activeCar = useCallback(async (data) => {
    const userId = await getUserId();
    try {
      if (!userId) {
        showAlertLogin();
        return;
      }
  
      const apiCall = await axios.post(`${customer_api_urls.active_car}/${userId}`, { garage: data });
  
      if (apiCall.status === api_statuses.success) {
        getUserInfo();
        showToaster('Nuevo Auto activado');
      }
    } catch (error) {
      showToasterError(error);
    }
  }, []);
  
  const getPedidosUser = useCallback(async () => {
    try {
      const id = await getUserId();
    
      if (!id) {
        return 
      }
      dispatch(isLoadingOrdersUser(true));
      const apiCall = await axios.get(`${customer_api_urls.get_pedidos_user}/${id}`);
  
      if (apiCall.status === api_statuses.success) {
        dispatch(getOrdersUser(apiCall?.data?.data));
      }
    } catch (error) {
      showToaster(error?.response?.data?.message);
      dispatch(getOrdersUser([]));
    }
  }, []);
  
  const getNotificaciones = useCallback(async () => {
    try {
      const id = await getUserId();
      if (!id) {
        return;
      }
     
      const url = `${api_urls.getNotification}/${id}`;
  
      const apiCall = await axios.get(url);
      const data = apiCall.data;
     
      dispatch(saveNotification(data));
      if (Platform.OS === 'ios') {
        PushNotificationIOS.setApplicationIconBadgeNumber(data.count);
      }
    } catch (e) {
     
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo - N');
    }
  }, []);
  

  


  const rangeYear = () => {
    
    if (!modeloValue) {
      return
    }
    let modelo = modelos.find(item => item._id === modeloValue);

   

    

    const max = modelo?.years?.al

    const min = modelo?.years?.de
    const years = []

    for (let i = max; i >= min; i--) {
      years.push(i)
    }
    dispatch(getYearsCars(years));
    
  }

  useEffect(() => {
    rangeYear()
  }, [modeloValue])
  

  useEffect(() => {
    
    getNotificaciones()
   
  }, [])
  


 




 
  

  return {
    getUserInfo,
    activeCar,
    getPedidosUser,
    getNotificaciones
  }

}