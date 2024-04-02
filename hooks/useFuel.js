import axios from 'axios';
import { useState } from 'react';
import { customer_api_urls } from '../util/api/api_essentials';
import { getUserId } from '../util/local-storage/auth_service';
import { useDispatch, useSelector } from 'react-redux';
import { addKmRecorrido, addToDriver, addToFuel, getAllDrivers, getAllFuelConsumption } from '../util/ReduxStore/Actions/CustomerActions/FuelActions';
import moment from 'moment';

export const useFuel = (  ) => {
    const [loading, setLoading] = useState(false);
    const { carActive } = useSelector(state => state.user);
    const dispatch = useDispatch()
    const [averageGasConsumption, setAverageGasConsumption] = useState(null)

    const getDrivers = async() => {
        try {
            setLoading(true)
            const id = await getUserId()
            const apiCall = await axios.get(`${customer_api_urls.get_driver}/${id}`);
            setLoading(false)
           
            
            dispatch(getAllDrivers(apiCall.data.data));
        } catch (error) {
            setLoading(false)
        }
    }

   
    const createDriver = async(data) => {
        try {
            setLoading(true)
            const id = await getUserId()
            const apiCall = await axios.post(`${customer_api_urls.create_driver}/${id}`,data);
            
           
            
            dispatch(addToDriver( apiCall.data.data));
            setLoading(false)
           
            
           
        } catch (error) {
            setLoading(false)
        }
    }

    const createFuelConsumption = async(data) => {
        try {
            setLoading(true)
            const id = await getUserId()
          
            const apiCall = await axios.post(`${customer_api_urls.create_consumption}/${id}`,{...data,garage:carActive._id});
            
           
            
            await getFuelConsumption()
            setLoading(false)
           
            
           
        } catch (error) {
            setLoading(false)
        }
    }

    const createTravel = async(data) => {
        try {
            setLoading(true)
            const id = await getUserId()
          
            const apiCall = await axios.post(`${customer_api_urls.create_travel}/${id}`,{
                ...data,
                garage:carActive._id,
                km_anterior:data.km
            });
            
           
            
            await getFuelConsumption()
            setLoading(false)
           
            
           
        } catch (error) {
            setLoading(false)
        }
    }

    const closeTravel = async(data) => {
        try {
            setLoading(true)
           
          
            const apiCall = await axios.put(`${customer_api_urls.close_travel}/${data.id}`,{
                ...data,
                km_actual:data.km
            });
            
           
            
            dispatch(getAllFuelConsumption(apiCall.data.data));
            calcularTotalKm(apiCall.data.data)
            setLoading(false)
           
            
           
        } catch (error) {
            setLoading(false)
        }
    }

    const getFuelConsumption = async() => {
        try {
            setLoading(true)
            const id = await getUserId()
            const apiCall = await axios.get(`${customer_api_urls.get_consumption}/${id}`);
            setLoading(false)
           
           
            dispatch(getAllFuelConsumption(apiCall.data.data));
            calcularTotalKm(apiCall.data.data)
        } catch (error) {
            setLoading(false)
        }
    }

    const calcularConsumoEntreRecargas = (registros) => {
        if (registros.length < 2) {
            return 0; // No se pueden calcular consumos sin al menos dos registros
        }
    
        let totalKm = 0;
        let totalLitros = 0;
      
        // Sumar los kilómetros recorridos y los litros de cada registro
        for (let i = 1; i < registros.length; i++) {
            const registroActual = registros[i];
            const registroAnterior = registros[i - 1];
    
            totalKm += registroActual.km_recorrido;
            totalLitros += registroActual.liters;
        }
    
       
        // Calcular el consumo promedio de gasolina
        const consumoPromedio = totalLitros / totalKm;
      
        setAverageGasConsumption(consumoPromedio)
        return consumoPromedio;
    }

    const calcularTotalKm = (response) => {
       try {
        if (response.length <= 0) {
            dispatch(addKmRecorrido({
                kmPerByDay:null,
                totalKmTraveled:null,
                daysPassed:null
            }));
            return
        }
        const ultimoRegistro = response[0];
        const count = response.length
        const primerRegistro = response[count - 1];
        const actual = ultimoRegistro?.km_actual ?? ultimoRegistro?.km_anterior;
        const totalKmRecorridos = actual - primerRegistro?.km_anterior;

        const primeraFecha = moment(primerRegistro.createdAt);

        const ultimaFecha = moment(ultimoRegistro.createdAt);
     
        const diasTranscurridos = ultimaFecha.diff(primeraFecha, 'days');

        const kmPorDia = diasTranscurridos <= 0 ? totalKmRecorridos :  totalKmRecorridos / diasTranscurridos;
     
        
        dispatch(addKmRecorrido({
            kmPerByDay:kmPorDia,
            totalKmTraveled:totalKmRecorridos,
            daysPassed:diasTranscurridos
        }));
       } catch (error) {
        console.log(error);
       }
            
    }

    return {
        getDrivers,
        loading,
        
        createDriver,
        createFuelConsumption,
        getFuelConsumption,
        calcularConsumoEntreRecargas,
        averageGasConsumption,
        createTravel,
        closeTravel
      
    }

}