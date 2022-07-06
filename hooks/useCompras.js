import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { customer_api_urls, paymentApis } from '../util/api/api_essentials';
import { useStripe } from '@stripe/stripe-react-native';
import { getUser } from '../util/local-storage/auth_service';
import { useSelector } from 'react-redux';
import { showToaster } from '../util/constants';




export const useCompras = () => {
    
    const [cards, setCards] = useState([])


    const getCards = useCallback(
        async () => {
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
    
    useEffect(() => {
        getCards()
    }, [])
        

       

    return {
        cards,
        
    }
}
