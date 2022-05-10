import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { customer_api_urls } from '../util/api/api_essentials';





export const useCostos = () => {
    const [costoEnvio, setCostoEnvio] = useState(0)
    const [distancia, setDistancia] = useState(0);
    const [comision, setComision] = useState(10)
    const CalcularEnvio = (distancia,costoK) => {
        let total = Math.ceil(distancia * costoK)
        
        // setCostoEnvio(parseFloat(total.toFixed(2))) 
        setCostoEnvio(total) 
    }


    const CalcularDistancia = (longBusiness,latBusiness,longCustomer,latCustomer,costoK) => {
       
        const distance = Math.sqrt(
          Math.pow(69.1 * (Number(latBusiness) - [latCustomer]), 2) +
          Math.pow(69.1 * ([longCustomer] - Number(longBusiness)) * Math.cos(Number(latBusiness) / 57.3), 2));
        
        // return Math.round(distance);
        setDistancia(distance.toFixed(2))
        CalcularEnvio(distance.toFixed(2),costoK)
       
    }

    const getComision = async() => {
        const getFee = await axios.get(customer_api_urls?.get_fees);
        
        setComision(getFee.data.data[0]?.besseri_comission); 
    }

    useEffect(() => {
        getComision();
    }, [])
    
    

    return {
        CalcularEnvio,
        CalcularDistancia,
        costoEnvio,
        distancia,
        comision
    }
}
