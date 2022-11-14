import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { paymentApis, vendor_api_urls } from '../util/api/api_essentials';

import { getUser, getUserId } from '../util/local-storage/auth_service';

import { showToaster } from '../util/constants';




export const useCompras = () => {
    const [isLoading, setLoading] = useState(false)
    const [cupones, setCupones] = useState([])
   
    const getCupones = async () => {
            setLoading(true)
            try {
                
                const user = await getUser();
                
                if (user) {
                    const apiCall = await axios.get(`${vendor_api_urls.get_cupones}/${user?._id}`);
               
                    setCupones(apiCall?.data?.data);
                }
               
                setLoading(false)
                
            } catch (e) {
                
                setLoading(false);
                showToaster(e.response.data?.error);
                
               
            }
    }

    const deleteCupones = async (id) => {
            setLoading(true)
            try {
                const user = await getUser();
                const apiCall = await axios.delete(`${vendor_api_urls.delete_cupones}/${id}`);
               
                getCupones()
                showToaster('Cupon eliminado correctamente');
                setLoading(false)
                
            } catch (e) {
                
                setLoading(false);
                showToaster(e.response.data?.error);
                
               
            }
        }

    const createCupones = async (data) => {
            setLoading(true)
            try {
              
                
                const apiCall = await axios.post(`${vendor_api_urls.create_cupones}`,data);
               

                if (apiCall?.status == 200) {
                    getCupones()
                    showToaster('Cupon creado correctamente');
                }
               
                setLoading(false)
                return apiCall?.status
            } catch (e) {
                // console.log(e?.response?.status);
                setLoading(false);
                showToaster(e?.response?.data?.message);
                
               return e?.response?.status
            }
    }
    const aplicarCupones = async (name,total) => {
            setLoading(true)
            try {
                
                const id = await getUserId();
                const apiCall = await axios.post(`${vendor_api_urls.search_cupones}/${id}`,{name,total});
               
                setLoading(false)
                return {cupon:apiCall.data,status:apiCall.status}
            } catch (e) {
                // console.log(e?.response?.status);
                setLoading(false);
                showToaster(e?.response?.data?.message);
                
               return {status:e?.response?.status}
            }
    }


    

    

    
    
    // useEffect(() => {
    //     getCards()
    // }, []);

    useEffect(() => {
        let abortController = new AbortController();
        getCupones()
        return () => {  
            abortController.abort();  
        } 
    }, [])
        

       

    return {
        isLoading,
        cupones,
        deleteCupones,
        createCupones,
        aplicarCupones
    }
}
