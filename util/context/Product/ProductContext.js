import React,{ createContext, useCallback, useEffect, useReducer,useState } from "react";
import axios from 'axios';
import { customer_api_urls, vendor_api_urls } from "../../api/api_essentials";
import { showToaster } from "../../constants";


import { productReducer } from "./productReducer";






const productInicialState = {
    productos:[],
    servicios:[],
    categorias:[],
    marcas:[],
    modelo:null,
    comision:false,
    isLoading:false
}





export const ProductContext = createContext({});

export const ProductProvider = ({children}) => {
    const [state, dispatch] = useReducer(productReducer, productInicialState);
    const [valueMaker, setValueMaker] = useState(null);
    const [valueModel, setValueModel] = useState(null);
    const [ marcas, setMarcas ] = useState([]);
    const [modelo, setModelo] = useState(false);
    const [servicios, setServicios] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const getProducts = useCallback(
        async() => {
          try {
            const apiCall = await axios.get(customer_api_urls.get_products);
            
            
            
            dispatch({
                type:'getProductos',
                payload: {
                    productos: apiCall.data.data.products,
                    categorias: apiCall.data.data.categories
                }
            });
            dispatch({
                type:'getCategorias',
                payload: {
                   
                    categorias: apiCall.data.data.categories
                }
            });
          
          
           
          } catch(e) {
            console.log({getProducts:e})
            showToaster('No hay conexion con el servidor ');
           
          }
    },[])

    const getServices = useCallback(
        async() => {
            try {
                const apiCall = await axios.get(customer_api_urls.get_services);
                
                dispatch({
                    type:'getServicios',
                    payload: {
                        servicios: apiCall.data.data,
                       
                    }
                });
              
              } catch(e) {
                
                console.log({getServices:e});
                
              }
    },[])

    const getComision = useCallback(
        async() => {
          try {
            const getFee = await axios.get(customer_api_urls?.get_fees);

            dispatch({
                type:'getComision',
                payload: {
                    comision: getFee.data.data[0]?.besseri_comission,
                }
            });
          
           
          } catch(e) {
            console.log({productContext:e})
            showToaster('No hay conexion con el servidor ');
           
          }
    },[])

    const getMarcas = useCallback(
      async() => {
        try {
            const apiCall = await axios.get(vendor_api_urls?.get_makers)
            setMarcas(apiCall.data?.data)
            // dispatch({
            //     type:'getMarcas',
            //     payload: {
            //         marcas: apiCall.data?.data,
            //     }
            // });
        
        } catch (error) {
            console.log({productContext:error})
           
        }
      },
      [],
    )

    const getModelo = useCallback(
      async(id) => {
        try {
            if (valueMaker.length > 0) {
                
               
                const apiCall = await axios.get(`${vendor_api_urls.get_models}/${id}`,);
                
                if (apiCall?.status == 200) {
                    setModelo(apiCall.data.data);
                }
            }
           
            
            } catch (e) {
                
              alert('Algo sali?? mal modelo');
            }
      },
      [valueMaker],
    )

    const searchCall = useCallback(
        async(st,isServices) => {
            setLoading(true);
            setServicios(isServices)
           
        try 
        {
           
            if(isServices === 'Servicios') {
                const apiCall = await axios.post(customer_api_urls?.service_search,{
                searchText:st,
                });
            
                
                dispatch({
                    type:'getServicios',
                    payload: {
                        servicios: apiCall.data.Data,
                       
                    }
                });
                setLoading(false);

            } else {

                const apiCall = await axios.post(customer_api_urls.search_api,{searchText:st});
           
               
                dispatch({
                    type:'getProductos',
                    payload: {
                        productos: apiCall.data.Data,
                    }
                });
                setLoading(false);

            }
            
            
        } catch(e) {
            console.log(e)
            setLoading(false);
            showToaster('No hay conexion con el servidor')
        }
    },[]);

   
    const resetFiltro = () => {
        setValueMaker(null);
        setValueModel(null);
        setModelo(false);
        getMarcas();
        getProducts();
        getServices();

    }
    
    
    useEffect(() => {
        let abortController = new AbortController();  
        getProducts()
        return () => {  
            abortController.abort();  
        }  
       
    }, [])

    useEffect(() => {
        let abortController = new AbortController();
        getComision()
        return () => {  
            abortController.abort();  
        } 
    }, [])

    useEffect(() => {
        let abortController = new AbortController();
        getMarcas();
        return () => {  
            abortController.abort();  
        } 
    }, [])

    useEffect(() => {
        let abortController = new AbortController();
        getServices();
        return () => {  
            abortController.abort();  
        } 
    }, [])
    
    useEffect(() => {
        let abortController = new AbortController();
        if (valueMaker) {
            getModelo(valueMaker); 
        }
        return () => {  
            abortController.abort();  
        } 
    }, [valueMaker])
    
    
    

    return (
        <ProductContext.Provider
        value={{
            ...state,
            marcas, 
            setMarcas,
            modelo, 
            setModelo,
            valueMaker, 
            setValueMaker,
            valueModel, 
            setValueModel,
            resetFiltro,
            searchCall,
            
          
        }}
        >
            {children}
        </ProductContext.Provider>
    )
}



 
