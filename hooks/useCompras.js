import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { paymentApis, vendor_api_urls } from '../util/api/api_essentials';

import { getUser } from '../util/local-storage/auth_service';

import { showToaster } from '../util/constants';




export const useCompras = () => {
    const [isLoading, setLoading] = useState(false)
    const [cards, setCards] = useState([])
    const [cupones, setCupones] = useState([])
   
    const getCupones = useCallback(
        async () => {
            setLoading(true)
            try {
                
                const user = await getUser();
                
                const apiCall = await axios.get(`${vendor_api_urls.get_cupones}/${user?._id}`);
               
                setCupones(apiCall?.data?.data);
                setLoading(false)
                
            } catch (e) {
                
                setLoading(false);
                showToaster(e.response.data?.error);
                
               
            }
        }, 
    []);

    const deleteCupones = useCallback(
        async (id) => {
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
        }, 
    []);

    const createCupones = useCallback(
        async (id) => {
            setLoading(true)
            try {
                
                const apiCall = await axios.post(`${vendor_api_urls.create_cupones}`);
               
                getCupones()
                showToaster('Cupon eliminado correctamente');
                setLoading(false)
                
            } catch (e) {
                
                setLoading(false);
                showToaster(e.response.data?.error);
                
               
            }
        }, 
    []);

    

    
    
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
        createCupones
    }
}
