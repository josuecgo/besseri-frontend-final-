

import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { customer_api_urls } from '../util/api/api_essentials';
import { getUserId } from '../util/local-storage/auth_service';
import { useDispatch, useSelector } from 'react-redux';

import { showAlertLogin, showToaster } from '../util/constants';

import { Alert, Platform } from 'react-native';
import { addAddressToUser, addDefaultAddressToUser } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';




export const useStoreLocation = () => {
  const { carActive,addresses,defaultAddress } = useSelector(state => state.user);
  const direccionStore = useSelector(state => state.user.addresses);
  const [stores, setStores] = useState(null)
  const [categoriesActive, setCategoriesActive] = useState([]);
  const [typeServicesActive, setTypeServicesActive] = useState([])
  const dispatch = useDispatch()
  

  const getAddresses = async ({ navigation }) => {
    try {
      
      const userId = await getUserId();
      if (!userId) {

        if (direccionStore) {
          const data = {
            _id: 1,
            ...direccionStore[0]
          }
          dispatch(addAddressToUser([data]))
         
          
          dispatch( addDefaultAddressToUser(1) )
          return
        }
        showAlertLogin(goLogin, goCancel)
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
        
        dispatch(addAddressToUser(apiCall.data.data))
  
        
        if (apiCall?.data?.data.length > 0) {
         
          dispatch( addDefaultAddressToUser(apiCall.data.data[0]._id) )

        } else {
          dispatch( addDefaultAddressToUser(null) )
          
        }
      }

    } catch (e) {
     
      showToaster('Algo salió mal. Por favor, vuelva a intentarlo code: 2')
    }
  }

  const getStoreService = async (isHome,type='') => {
    try {
   
      
      if (!addresses) return
      const userId = await getUserId();
      const findAddress =  userId ? addresses.find(item => item?._id === defaultAddress  ) : addresses[0] ;
      
    
      const apiCall = await axios.post(`${customer_api_urls.get_stores_type_services}/${type}`, {
         addresses:findAddress, carActive,isHome 
        });
      
      setStores(apiCall?.data?.data)
    
    } catch (error) {
    
      
      showToaster('Error con el servidor');
    }
  }

 
  const getCategories = async () => {
    try {
        
        const url = `${customer_api_urls.active_categories_services}`;

        const apiCall = await axios.get(url)

        if (apiCall?.data?.data.categories) {
          setCategoriesActive(apiCall?.data?.data?.categories)
        }
        if (apiCall?.data?.data) {
          setTypeServicesActive(apiCall?.data?.data?.type_services)
        }
       
      
    } catch (error) {
        
       
        const errorMessage = error.response.data.message ? error.response.data.message : "Error de conexión";
       
        showToaster(errorMessage);
    }
  }


  

 


  return {
    getAddresses,
    getStoreService,
    categoriesActive,
    typeServicesActive
  }

}