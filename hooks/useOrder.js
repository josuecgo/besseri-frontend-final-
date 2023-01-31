import { useEffect, useState } from 'react'
import axios from "axios";
import { api_statuses, customer_api_urls } from "../util/api/api_essentials";
import { showToaster, USER_ORDER_STATUSES } from "../util/constants";
import { getUserId } from '../util/local-storage/auth_service';


export const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [pending, setPending] = useState([]);
  const [sending, setSending] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [cancelled, setCancelled] = useState([]);
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
          geyMyOrdersStatus(apiCall.data.data);
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

  const geyMyOrdersStatus = async(data) => {
    
    // ?Pendientes de envio 
    let pending = data.filter((item) => 
    item?.order_status_code === USER_ORDER_STATUSES.PACKEd || item?.order_status_code === USER_ORDER_STATUSES.PROCESSING || item?.order_status_code === 'RIDER_ASSIGNED' 
    );

    // ? Enviado
    let sending = data.filter((item) =>   item?.order_status_code === USER_ORDER_STATUSES.ORDER_OUT_FOR_DELIVERY );

    //? Pendientes de valoracion o Entregados
    let delivered = data.filter((item) => item?.order_status_code === USER_ORDER_STATUSES.PARCEL_DELIVERED );
    
    // ? Cancelado 
    let cancelados = data.filter((item) => item?.order_status_code === USER_ORDER_STATUSES.CANCELLED );
    
    
    setPending(pending)
    setSending(sending);
    setDelivered(delivered); 
    setCancelled(cancelados)

    
  }
  




  useEffect(() => {
    getMyOrders()
  }, [])
  



  return {
    getMyOrders,
    orders,
    loading,
    pending,
    sending,
    delivered,
    cancelled, 
  }
}