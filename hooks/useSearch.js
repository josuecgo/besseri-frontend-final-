import axios from 'axios';
import { useState,useEffect } from 'react';
import { customer_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import { showToaster } from '../util/constants';

export const useSearch = ( isServices ) => {
    
    const [ isLoading, setIsLoading ] = useState(true);
    const [ marcas, setMarcas ] = useState([])
    const [loading, setLoading] = useState(false);
    const [productsData,setProductsData] = useState(null);
    const [servicesData,setServicesData] = useState(null);

    const getMarcas = async () => {
        
        try {
            const apiCall = await axios.get(vendor_api_urls?.get_makers)
            if (apiCall.status == 200) {
                setMarcas(apiCall.data?.data)
            } else {
                
            }
        } catch (error) {
            console.log(error);
            setMarcas([])
        }
        setIsLoading( false );
    }


    const searchCall = async(st) => {
        
         try 
        {
        setLoading(true);
        if(isServices) {
            const apiCall = await axios.post(customer_api_urls?.service_search,{
            searchText:st,
        });
        setServicesData(apiCall.data.Data);
        setLoading(false);

        } else {
            const apiCall = await axios.post(customer_api_urls?.search_api,{
            searchText:st,
        });
        setProductsData(apiCall.data.Data);
        setLoading(false);

        }
        setLoading(false);
        } catch(e) {
            console.log(e?.response?.data)
            setLoading(false);
        showToaster('something went wrong')
        }
    }  

   
    useEffect(() => {
        // now_playing
        getMarcas();

    }, [])



    return {
        isLoading,
        marcas,
        searchCall,
        productsData,
        servicesData,
        loading

    }

}

