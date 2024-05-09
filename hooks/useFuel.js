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
          
            const apiCall = await axios.post(`${customer_api_urls.create_consumption}/${id}`,{
                ...data,
                garage:carActive._id,
                km_actual:data.km
            });
            
           
            
            await getFuelConsumption()
            setLoading(false)
           
            
           
        } catch (error) {
            setLoading(false)
        }
    }

    const createFuelConsumptionInitial = async(data) => {
        try {
            setLoading(true)
            const id = await getUserId()
          
             await axios.post(`${customer_api_urls.create_consumption_initial}/${id}`,{
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

    const closeFuelConsumption = async(data) => {
        try {
            setLoading(true)
           
          
            const apiCall = await axios.put(`${customer_api_urls.close_consumption}/${data.id}`,{
                ...data,
                km_actual:data.km
            });
            
           
            
            dispatch(getAllFuelConsumption(apiCall.data.data));
            await calcularTotalKm(apiCall.data.data)
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
            await calcularTotalKm(apiCall.data.data)
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
           
           
           
            dispatch(getAllFuelConsumption(apiCall.data.data));
            await calcularTotalKm(apiCall.data.data);
            
            setLoading(false)

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

    // const calcularTotalKm = (response) => {
    //    try {
    //     if (response.length <= 0) {
    //         dispatch(addKmRecorrido({
    //             kmPerByDay:null,
    //             totalKmTraveled:null,
    //             daysPassed:null,
    //             fuelTotal:null,
    //             amountTotal:null
    //         }));
    //         return
    //     }
    //     console.log(response);
    //     const ultimoRegistro = response[0];
       
    //     const count = response.length
    //     const primerRegistro = response[count - 1];
       
    //     const actual = ultimoRegistro?.km_actual ?? ultimoRegistro?.km_anterior;
    //     const totalKmRecorridos = actual - primerRegistro?.km_anterior;

    //     const fechaInicialDate = new Date(primerRegistro.createdAt);
    //     const fechaFinalDate = new Date(ultimoRegistro.createdAt);
      
    //     const diferenciaMilisegundos = fechaFinalDate - fechaInicialDate;
      
    //     const diasTranscurridos = Math.round(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) ;
       

    //     const kmPorDia = diasTranscurridos <= 0 ? totalKmRecorridos :  totalKmRecorridos / diasTranscurridos;


     
        
       

    //     let sumaAmounts = 0;
    //     let sumaLiters = 0;

    //     response.forEach(registro => {
    //         if (registro.amount !== null && !isNaN(registro.amount)) {
    //             sumaAmounts += registro.amount;
    //         }
    //         if (registro.liters !== null && !isNaN(registro.liters)) {
    //             sumaLiters += registro.liters;
    //         }
    //     });


    //     dispatch(addKmRecorrido({
    //         kmPerByDay: response.length > 1 ? kmPorDia : 0,
    //         totalKmTraveled:response.length > 1 ? totalKmRecorridos : 0,
    //         daysPassed:diasTranscurridos,
    //         fuelTotal:sumaLiters,
    //         amountTotal:sumaAmounts
    //     }));


    //    } catch (error) {
    //     console.log(error);
    //     setLoading(false)
    //    }
            
    // }

    
    const calcularTotalKm = (response) => {
        try {
           
            if (response.length <= 0) {
                dispatch(addKmRecorrido({
                    kmPerByDay: null,
                    totalKmTraveled: null,
                    daysPassed: null,
                    fuelTotal: null,
                    amountTotal: null
                }));
                return;
            }
    
            const registrosConKilometraje = response.filter(registro => registro.km_anterior !== null && registro.km_actual !== null);
    
            if (registrosConKilometraje.length <= 0) {
                dispatch(addKmRecorrido({
                    kmPerByDay: 0,
                    totalKmTraveled: 0,
                    daysPassed: null,
                    fuelTotal: null,
                    amountTotal: null
                }));
                return;
            }
    
            const primerRegistro = registrosConKilometraje[registrosConKilometraje.length - 1];
            const ultimoRegistro = registrosConKilometraje[0];
    
            const totalKmRecorridos = ultimoRegistro.km_actual - primerRegistro.km_anterior;
    
            const fechaInicialDate = new Date(primerRegistro.createdAt);
            const fechaFinalDate = new Date(ultimoRegistro.createdAt);
          
            const diferenciaMilisegundos = fechaFinalDate - fechaInicialDate;
          
            const diasTranscurridos = Math.round(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    
            const kmPorDia = diasTranscurridos <= 0 ? 0 : totalKmRecorridos / diasTranscurridos;
    
            let sumaAmounts = 0;
            let sumaLiters = 0;
    
            response.forEach(registro => {
                if (registro.amount !== null && !isNaN(registro.amount)) {
                    sumaAmounts += registro.amount;
                }
                if (registro.liters !== null && !isNaN(registro.liters)) {
                    sumaLiters += registro.liters;
                }
            });
    
            dispatch(addKmRecorrido({
                kmPerByDay: kmPorDia,
                totalKmTraveled: totalKmRecorridos,
                daysPassed: diasTranscurridos,
                fuelTotal: sumaLiters, // Utilizamos la suma de litros de todos los registros
                amountTotal: sumaAmounts
            }));
        } catch (error) {
            console.log(error);
            setLoading(false);
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
        closeTravel,
        createFuelConsumptionInitial,
        closeFuelConsumption
      
    }

}