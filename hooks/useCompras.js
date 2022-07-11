import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { paymentApis } from '../util/api/api_essentials';

import { getUser } from '../util/local-storage/auth_service';

import { showToaster } from '../util/constants';




export const useCompras = () => {
    const [isLoading, setLoading] = useState(false)
    const [cards, setCards] = useState([])
   
    const getCards = useCallback(
        async() => {
            try {
                const user = await getUser();
                
              
                const apiCall = await axios.get(`${paymentApis.getCardsOpenpay}/${user?.customerId}`,);
                setCards(apiCall?.data?.data);
                
            } catch (e) {
                console.log(e)
                setLoading(false);
                showToaster('No hay conexion con el servidor')
            }
        }, 
    []);

    const saveCards = useCallback(
        async (form) => {
            setLoading(true)
            try {
                const user = await getUser();
                

                const apiCall = await axios.post(`${paymentApis.saveCardsOpenpay}/${user?.customerId}`,form);
               
                getCards();
                setLoading(false)
                return apiCall.data?.success;

            } catch (e) {
                
                setLoading(false);
                showToaster(e.response.data?.error);
                return false;
            }
        }, 
    []);
    

    
    
    useEffect(() => {
        getCards()
    }, [])
        

       

    return {
        cards,
        saveCards,
        isLoading
    }
}
