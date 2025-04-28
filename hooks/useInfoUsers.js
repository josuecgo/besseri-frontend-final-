
import axios from 'axios';
import { useCallback, useContext, useState } from 'react';
import { api_statuses, api_urls, customer_api_urls } from '../util/api/api_essentials';
import { getUser, getUserAddress, getUserId, saveAdressCustomer, saveCarActive, saveGarage, saveUserData, saveUserId, saveUserType } from '../util/local-storage/auth_service';
import { useDispatch, useSelector } from 'react-redux';
import { addAddressToUser, addCarActiveToUser, addCarsToUser, addDefaultAddressToUser, addToUser, getMakerValueCars, getModelValueCars, getYearsCars, getYearValueCar, saveNotification } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';
import { useEffect } from 'react';
import { showAlertLogin, showToaster, showToasterError } from '../util/constants';
import { getOrdersUser, isLoadingOrdersUser } from '../util/ReduxStore/Actions/CustomerActions/PedidosAction';
import { ProductContext } from '../util/context/Product/ProductContext';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSearchStore } from './useSearchStore';
import { useLocation } from './useLocation';




export const useInfoUser = () => {
  const dispatch = useDispatch()
  const { getCategorias } = useContext(ProductContext)
  const { modeloValue, modelos, carActive } = useSelector(state => state.user);
  const { getModelo } = useSearchStore()

 const { getLocationHook } = useLocation()


  const getUserInfo = useCallback(async () => {
    try {
      const id = await getUserId();

      if (!id) {
        getLocationHook()
        return
      };

      const apiCall = await axios(`${customer_api_urls.get_info_user}/${id}`);

      if (apiCall.status === api_statuses.success) {
        const { carActive, myAddresses, garage, user } = apiCall.data.data;


        saveUserData(user);
       
        
        if (carActive) {
          if (user?.role === 'mechanic') return
          dispatch(getMakerValueCars(carActive?.maker?._id))
          await getModelo(carActive?.maker?._id)

          dispatch(addCarActiveToUser(carActive));
          await saveCarActive(carActive);

          dispatch(getModelValueCars(carActive?.model?._id))

          dispatch(getYearValueCar(carActive?.year))


        }



        
        if (garage) {
          dispatch(addCarsToUser(garage));
          await saveGarage(garage);
        }
        if (carActive) {
          getCategorias();
        }

        if (myAddresses.length > 0) {
          dispatch(addAddressToUser(myAddresses));
          await saveAdressCustomer(myAddresses);

          return myAddresses;
        }else{
          getLocationHook()
          return false
        }
        
      }
    } catch (error) {
      console.log(error);
      
      showToaster(error?.response?.data?.message || 'code - IU56');
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
      console.log(error, 'activeCar');
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
      console.log(error, 'getPedidosUser');
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
      console.log(e, 'error en get notificaciones');

      showToaster('Algo salió mal. Por favor, vuelva a intentarlo - N');
    }
  }, []);

  const saveRecentProduct = async (userId, productId) => {
    try {
      const apiCall = await axios.post(`${customer_api_urls.add_recent_product}`, { userId, productId });
    } catch (error) {
      console.log(error, 'saveRecentProduct');

    }
  }

  const getRecentProduct = async () => {
    try {
      const id = await getUserId();
      if (!id) {
        return;
      }

      const url = `${customer_api_urls.get_recent_product}/${id}`;

      const apiCall = await axios.get(url);


      return apiCall.data?.data;


    } catch (error) {
      console.log(error, 'getRecentProduct');

    }
  }




  const rangeYear = () => {

    if (!modeloValue || modelos) {
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
    if (modelos) {
      rangeYear()
    }

  }, [modeloValue, modelos])













  return {
    getUserInfo,
    activeCar,
    getPedidosUser,
    getNotificaciones,
    saveRecentProduct,
    getRecentProduct
  }

}