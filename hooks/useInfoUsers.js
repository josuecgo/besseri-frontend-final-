
import axios from 'axios';
import { useContext, useState } from 'react';
import { api_statuses, api_urls, customer_api_urls } from '../util/api/api_essentials';
import { getUser, getUserAddress, getUserId, saveAdressCustomer, saveCarActive, saveGarage } from '../util/local-storage/auth_service';
import { useDispatch, useSelector } from 'react-redux';
import { addAddressToUser, addCarActiveToUser, addCarsToUser, addToUser, getYearsCars, saveNotification } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';
import { useEffect } from 'react';
import { showAlertLogin, showToaster, showToasterError } from '../util/constants';
import { getOrdersUser, isLoadingOrdersUser } from '../util/ReduxStore/Actions/CustomerActions/PedidosAction';
import { ProductContext } from '../util/context/Product/ProductContext';




export const useInfoUser = (  ) => {
  const dispatch = useDispatch()
  const {
      getCategorias
  } = useContext(ProductContext)




  const getUserInfo = async(user) => {
      try {

      
        const id = await getUserId();
        const user = await getUser()
        if (!id) {
          return
        }
      
        const apiCall = await axios(`${customer_api_urls.get_info_user}/${id}`);

        if (apiCall.status === api_statuses.success) {
          const { carActive,myAddresses,garage } = apiCall.data.data
          await  saveCarActive(carActive)
          
          await  saveAdressCustomer(myAddresses)
          await  saveGarage(garage)
          dispatch( addToUser(user) )
          dispatch( addCarActiveToUser(carActive) )
          dispatch( addAddressToUser(myAddresses[0]) )
          
          dispatch( addCarsToUser(garage) )
          if (carActive) {
             getCategorias()
          }
         
        }
      
        

      } catch (error) {
        showToaster(error.response.data.message)
      }
   
   
  }

  const activeCar = async(data) => {
    const userId = await getUserId();
    try {
        if (!userId) {
            showAlertLogin();
            return
        }
      
     
        const apiCall = await axios.post(`${customer_api_urls.active_car}/${userId}`,{garage:data});
            
        if (apiCall.status == api_statuses.success) {
          getUserInfo()
          showToaster('Nuevo Auto activado');
        }
       
    } catch (error) {
     
      showToasterError(error);
      
    }
   
  }

  const getPedidosUser = async() => {
    try {

      
      const id = await getUserId();
      const user = await getUser()
      if (!id) {
        return showToaster('Registrate o inicia sesion')
      }
      dispatch( isLoadingOrdersUser() )
      const apiCall = await axios.get(`${customer_api_urls.get_pedidos_user}/${id}`);

     
      if (apiCall.status === api_statuses.success) {    
        dispatch( getOrdersUser(apiCall?.data?.data) )
      }
    
      

    } catch (error) {
      showToaster(error?.response?.data?.message)
      dispatch( getOrdersUser([]) )
    }
   
  }

  const getNotificaciones = async() => {
    try {
        const id = await getUserId();
        
        const url = `${api_urls.getNotification}/${id}`;

        const apiCall = await axios.get(url);
        const data = apiCall.data.data;
        
        dispatch( saveNotification(data) )

       
    } catch (e) {
        // console.log({ eaAndData: e })
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo')
    }
}

  


  const rangeYear = () => {
    const max = new Date().getFullYear() + 1

    const min = max - 33
    const years = []

    for (let i = max; i >= min; i--) {
      years.push(i)
    }
    dispatch(getYearsCars(years));
    
  }

  useEffect(() => {
    rangeYear()
  }, [])
  

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