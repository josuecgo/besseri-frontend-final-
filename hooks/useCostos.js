import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { customer_api_urls } from '../util/api/api_essentials';





export const useCostos = () => {
    const [costoEnvio, setCostoEnvio] = useState(0)
    const [distancia, setDistancia] = useState(0);
    const [comision, setComision] = useState(10)
    const [deliveryFee, setDeliveryFee] = useState(12.02)
    const CalcularEnvio = (distancia,costoK) => {
        let total = Math.ceil(distancia * costoK)
        
        // setCostoEnvio(parseFloat(total.toFixed(2))) 
        setCostoEnvio(total) 
    }


    const CalcularDistancia = (business,deliveryAddress,costoK) => {
        const {location,kmFree} = business;
        
        const distance = Math.sqrt(
          Math.pow(69.1 * (Number(location?.latitude) - [deliveryAddress?.latitude]), 2) +
          Math.pow(69.1 * ([deliveryAddress?.longitude] - Number(location?.longitude)) * Math.cos(Number(location?.latitude) / 57.3), 2));
         
        let d = distance.toFixed(2) - kmFree;

        if (d <= 0) {
            setDistancia(0);
            setCostoEnvio(0);
        }else{
            setDistancia(d)
            CalcularEnvio(d,costoK)
        }
        
       
    }

    const getComision = async() => {
        const getFee = await axios.get(customer_api_urls?.get_fees);
        
        setComision(getFee.data.data[0]?.besseri_comission); 
        setDeliveryFee(getFee?.data?.data[0]?.delivery_fee);
    }

    useEffect(() => {
        getComision();
    }, [])
    
    

    return {
        CalcularEnvio,
        CalcularDistancia,
        costoEnvio,
        distancia,
        comision,
        deliveryFee
    }
}
