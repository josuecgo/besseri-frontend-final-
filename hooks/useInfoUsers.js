
import axios from 'axios';
import { useState } from 'react';
import { api_statuses, customer_api_urls } from '../util/api/api_essentials';
import { getUserAddress, getUserId, saveAdressCustomer, saveCarActive, saveGarage } from '../util/local-storage/auth_service';
import { useDispatch } from 'react-redux';
import { addCarActiveToUser, addCarsToUser } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';




export const useInfoUser = (  ) => {
  const dispatch = useDispatch()

  const getUserInfo = async(user) => {
      try {

      
        const id = await getUserId();
        if (!id) {
          return
        }
      
        const apiCall = await axios(`${customer_api_urls.get_info_user}/${id}`);

        if (apiCall.status === api_statuses.success) {
          const { carActive,myAddresses,garage } = apiCall.data.data
          await  saveCarActive(carActive)
          
          await  saveAdressCustomer(myAddresses)
          await  saveGarage(garage)

          dispatch( addCarActiveToUser(carActive) )
         
          dispatch( addCarsToUser(garage) )
        }
      
        

      } catch (error) {
        
      }
   
   
  }




 
  

  return {
    getUserInfo
  }

}