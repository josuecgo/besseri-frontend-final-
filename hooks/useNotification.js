import { useEffect, useState } from 'react';
import * as CartActions from '../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useDispatch, useSelector } from 'react-redux';
import { showToaster } from '../util/constants';
import { api_urls } from '../util/api/api_essentials';
import axios from 'axios';
import { getRiderProfile, getUserId } from '../util/local-storage/auth_service';




export const useNotification = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [newNotification, setNewNotification] = useState([]);
    const dispatch = useDispatch()
    
    
    const getNotificaciones = async() => {
        // try {
        //     // const id = await getUserId();
            
        //     // const url = `${api_urls.getNotification}/${id}`;

        //     // const apiCall = await axios.get(url);
        //     // const data = apiCall.data.data;
        //     // //console.log(data,'noti');
        //     // setNotificaciones(data);
        //     // dispatch()
           
        // } catch (e) {
        //     // //console.log({ eaAndData: e })
        //     showToaster('Algo salió mal. Por favor, vuelva a intentarlo')
        // }
    }

   
    
  
    

    return {
        getNotificaciones,
        notificaciones,
        newNotification, 
        setNewNotification
    }
}