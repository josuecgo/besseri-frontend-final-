import axios from 'axios';
import { useState } from 'react';
import { customer_api_urls } from '../util/api/api_essentials';
import { getUserId } from '../util/local-storage/auth_service';
import { useDispatch, useSelector } from 'react-redux';
import { addToDriver, addToFuel, getAllDrivers, getAllFuelConsumption } from '../util/ReduxStore/Actions/CustomerActions/FuelActions';

export const useFuel = (  ) => {
    const [loading, setLoading] = useState(false);
    const { carActive } = useSelector(state => state.user);
    const dispatch = useDispatch()

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

    const getFuelConsumption = async() => {
        try {
            setLoading(true)
            const id = await getUserId()
            const apiCall = await axios.get(`${customer_api_urls.get_consumption}/${id}`);
            setLoading(false)
           
            
            dispatch(getAllFuelConsumption(apiCall.data.data));
        } catch (error) {
            setLoading(false)
        }
    }

    return {
        getDrivers,
        loading,
        
        createDriver,
        createFuelConsumption,
        getFuelConsumption
      
    }

}