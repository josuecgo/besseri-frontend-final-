import { useEffect, useState } from 'react'
import axios from "axios";
import { api_statuses, customer_api_urls } from "../util/api/api_essentials";
import { showToaster } from "../util/constants";
import { getUserId } from '../util/local-storage/auth_service';


export const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  const getMyOrders = async () => {
    const userId = await getUserId();
    if (userId) {
      try {
        setLoading(true);
        
        const apiCall = await axios.get(`${customer_api_urls.get_my_orders}/${userId}`);

        
      
        setLoading(false);
        if (apiCall.status == api_statuses.success) {
          setOrders(apiCall.data.data);
          geyMyOrdersPending(apiCall.data.data);
        } else {
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
        }
      } catch (e) {
        // console.log(e)
        setLoading(false);
        showToaster('Algo salió mal. Por favor, vuelva a intentarlo')
      }
    } 
  }

  const geyMyOrdersPending = async(data) => {

  }
  




  useEffect(() => {
    getMyOrders()
  }, [])
  



  return {
    getMyOrders,
    orders,
    loading
  }
}