import axios from 'axios';
import { useState,useEffect } from 'react';
import { customer_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import { showToaster } from '../util/constants';

export const useSearch = (  ) => {
    
    const [ isLoading, setIsLoading ] = useState(true);
    const [ marcas, setMarcas ] = useState([]);
    const [modelo, setModelo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [productsData,setProductsData] = useState(null);
    const [servicesData,setServicesData] = useState(null);
    const [productFilter, setProductFilter] = useState([]);
    const [valueMaker, setValueMaker] = useState(null);
    const [valueModel, setValueModel] = useState(null);
    const [servicios, setServicios] = useState(false)

    
    const getMarcas = async () => {
        
        try {
            const apiCall = await axios.get(vendor_api_urls?.get_makers)
            if (apiCall.status == 200) {
                setMarcas(apiCall.data?.data)
            } else {
                setMarcas([]);
                showToaster('No tienes conexion a la red')
            }
        } catch (error) {
            console.log(error);
            setMarcas([])
        }
        setIsLoading( false );
    }

    const getModelo = async(id) => {
        
        try {
            
            setIsLoading( true );
            const apiCall = await axios.get(`${vendor_api_urls.get_models}/${id}`,);
            setIsLoading( false );
            if (apiCall?.status == 200) {
                setModelo(apiCall.data.data);
            }
            
            } catch (e) {
                setIsLoading( false );
              alert('Algo salió mal');
            }
        
    }


    const searchCall = async(st,isServices) => {
        setServicios(isServices)
        try 
        {
            setLoading(true);
            if(isServices) {
                const apiCall = await axios.post(customer_api_urls?.service_search,{
                searchText:st,
            });
            
                setProductsData(apiCall.data.Data);
                setLoading(false);
                

            } else {
                const apiCall = await axios.post(customer_api_urls?.search_api,{searchText:st});
           
                setProductsData(apiCall.data.Data);
               
                
                
                setLoading(false);

            }
            
        } catch(e) {
            console.log(e?.response?.data)
            setLoading(false);
            showToaster('No hay conexion con el servidor')
        }
    }

 

    const makerFilter = () => {
        if (servicios) {
            servicesFilter();
            return;
        }

        
       
        if (valueMaker) {
            if (valueModel) {
               
                let itemData;
                let itemModel;
                const marca = productsData.filter((item) => {
                    itemData = item.maker ? item?.maker?._id : '';
                    let searchTextData = valueMaker;
                   
                    return itemData.indexOf(searchTextData) > -1;
                })
                
                const modelo = marca.filter((item) => {
                    
                    itemModel = item.model ? item?.model?._id : '';
                    let searchTextData = valueModel;
                   
                    return itemModel.indexOf(searchTextData) > -1;
                })

                setProductFilter(modelo ? modelo : []);
               
               
            } else {
                setValueModel(null);
                const marca = productsData.filter((item) => {
                    let itemData = item.maker ? item?.maker?._id : '';
                    let searchTextData = valueMaker;
                    return itemData.indexOf(searchTextData) > -1;
                })
                
                setProductFilter(marca ? marca : []);
            }

            
          
        }else{  
           
            setProductFilter(productsData)
        }
       
    };

    const servicesFilter = ()=> {
        if (valueMaker) {
            if (valueModel) {
               
                let itemData;
                let itemModel;
                const marca = productsData.filter((item) => {
                    itemData = item.makersIds ? item?.makersIds : '';
                    let searchTextData = valueMaker;
                   
                    return itemData.indexOf(searchTextData) > -1;
                })
                
                const modelo = marca.filter((item) => {
                 
                    itemModel = item.model ? item?.model?._id : '';
                    let searchTextData = valueModel;
                   
                    return itemModel.indexOf(searchTextData) > -1;
                })

                setProductFilter(modelo ? modelo : []);
               
               
            } else {
                const marca = productsData.filter((item) => {
                   
                    let itemData = item.makersIds ? item?.makersIds : '';
                    let searchTextData = valueMaker;
                    return itemData.indexOf(searchTextData) > -1;
                })
                
                setProductFilter(marca ? marca : []);
            }

            
          
        }else{  
           
            setProductFilter(productsData)
        }
    }

    useEffect(() => {
      makerFilter()
    }, [productsData,valueMaker,valueModel])
    
   
   
    useEffect(() => {
        // now_playing
        getMarcas();

    }, [])

    useEffect(() => {
        if (valueMaker) {
            getModelo(valueMaker);
            
        }
    }, [valueMaker]);


    return {
        isLoading,
        marcas,
        setMarcas,
        modelo,
        setModelo,
        searchCall,
        productsData,
        servicesData,
        loading,
        getModelo,
        makerFilter,
        productFilter,
        valueMaker, 
        setValueMaker,
        valueModel, 
        setValueModel

    }

}



