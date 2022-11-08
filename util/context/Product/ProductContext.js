import React,{ createContext, useCallback, useEffect, useReducer,useState } from "react";
import axios from 'axios';
import { customer_api_urls, vendor_api_urls } from "../../api/api_essentials";
import { showToaster } from "../../constants";


import { productReducer } from "./productReducer";
import { getUserType } from "../../local-storage/auth_service";






const productInicialState = {
    productos:null,
    servicios:[],
    categorias:[],
    marcas:[],
    modelo:null,
    comision:false,
    isLoading:false,
    productFiltrado: false,
    store:[],
    productosStore:[],
    productFiltradoStore:false
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
    const [dowload, setDowload] = useState(false)

    const getCategorias = async(params) => {
        try {
            
            const apiCall = await axios.get(customer_api_urls.get_products,{params});
            await dispatch({
                type:'getCategorias',
                payload: {
                   
                    categorias: apiCall?.data?.data?.categories
                }
            });

          } catch(e) {
            // console.log({getProducts:e})
            showToaster('No hay conexion con el servidor - C01');
           
          }
    }



    const getProducts = useCallback(
        async() => {
            try {
                
                const apiCall = await axios.get(customer_api_urls.get_products);
    
                if (apiCall?.status === 200) {
                    await dispatch({
                        type:'getProductos',
                        payload: {
                            productos: apiCall.data.data.products,
                            // categorias: apiCall?.data?.data?.categories
                        }
                    });
                    setDowload(apiCall.data.data.products)
                    filterProduct(apiCall.data.data.products)
                }

              } catch(e) {
                // console.log({getProducts:e})
                showToaster('No hay conexion con el servidor - 01');
               
            }
    },[])

    const filterProduct = async(data) => {
        
        await dispatch({
            type:'filterProducts',
            payload: {
                productos:data,
                // categorias: apiCall?.data?.data?.categories
            }
        });
    }


    const getServices = useCallback(
        async() => {
            try {
                const apiCall = await axios.get(customer_api_urls.get_services);
                if (apiCall?.status == 200) {
                    dispatch({
                        type:'getServicios',
                        payload: {
                            servicios: apiCall.data.data,
                           
                        }
                    });
                }

              
              } catch(e) {
                showToaster('No hay conexion con los servicios')
                // console.log({getServices:e});
                
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
            // console.log({productContext:e})
            showToaster('No hay conexion con el servidor ');
           
          }
    },[])

    const getMarcas = useCallback(
      async() => {
        try {
            const apiCall = await axios.get(vendor_api_urls?.get_makers)
            if (apiCall?.status == 200) {
                
            setMarcas(apiCall.data?.data)
            }
            // dispatch({
            //     type:'getMarcas',
            //     payload: {
            //         marcas: apiCall.data?.data,
            //     }
            // });
        
        } catch (error) {
            // console.log({productContext:error})
           
        }
      },
      [],
    )

    const getModelo = useCallback(
      async(id) => {
        try {
            if (valueMaker.length > 0) {
                
               
                const apiCall = await axios.get(`${vendor_api_urls.get_models}/${id}`);
                
                if (apiCall?.status == 200) {
                    setModelo(apiCall.data.data);
                }
            }
           
            
            } catch (e) {
                
              alert('Algo salió mal modelo');
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
            
                if (apiCall?.status == 200) {
                    dispatch({
                        type:'getServicios',
                        payload: {
                            servicios: apiCall.data.Data,
                        
                        }
                    });
                }

                setLoading(false);

            } else {
                
                const apiCall = await axios.post(customer_api_urls.search_api,{searchText:st});
           
                if (apiCall?.status == 200) {
                    dispatch({
                        type:'getProductos',
                        payload: {
                            productos: apiCall.data.Data,
                        }
                    });
                    console.log({resp:apiCall.data.Data});
                    filterProduct(apiCall.data.Data)
                }
                
                setLoading(false);

            }
            
            
        } catch(e) {
            // console.log(e)
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
    


    const getProductStore = useCallback(
        async(store) => {
            try {
                
                await dispatch({
                    type:'getStore',
                    payload: {
                        store: store,
                          
                    }
                });
            } catch (e) {
              
              showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
            }
    },[])

    const filterProductStore = async(data) => {
        // console.log(data,'--data');
        await dispatch({
            type:'filterProductsStore',
            payload: {
                productFiltradoStore:data,
                // categorias: apiCall?.data?.data?.categories
            }
        });
    }
    const productStore = async(data) => {
        console.log('--data');
        // await dispatch({
        //     type:'productStore',
        //     payload: {
        //         productosStore:data?.products,
        //         // minimumPrice:data?.minPrice,
        //         // categories:data?.minPrice,
        //         // categorias: apiCall?.data?.data?.categories
        //     }
        // });
    }

    

    // const storeProduct = useCallback(
    //     async(store) => {
    //         try {
    //             console.log(store?._id,'storeproduct');
    //             const apiCall = await axios.get(`${customer_api_urls.get_store_data}/${store?._id}`);
        
    //             let cate = apiCall.data?.data?.categories;
                  
                   
    //             // let result  = cate.filter((elem, index) => {
    //             //         const firstIndex = cate.findIndex(({ _id, name }) => {
    //             //             return _id === elem._id && name === elem.name
    //             //         });
    //             //         return firstIndex === index
    //             // });
                    
        
                   
    //             console.log({status:apiCall?.status});
    //             if (apiCall?.status === 200) {
    //                 console.log('llamando productStore');
    //                 // setProductsData(apiCall.data.data.products);
    //                 await productStore({
    //                     // productosStore:apiCall.data.data?.products,
    //                     productosStore:[],
    //                     minimumPrice:apiCall.data.data.minPrice,
    //                     categories:[],
    //                 })
                    
    //                 // setMinimumPrice(apiCall.data.data.minPrice);
    //                 // setServices(apiCall?.data?.data?.services);

    //                 filterProductStore(apiCall.data.data.products);
                   
                    
    //             }

    //           } catch(e) {
    //             // console.log({getProducts:e})
    //             showToaster('No hay conexion con el servidor - 01STR');
               
    //         }
    // },[state?.store])

    

    const storeProduct = async(store) => {
        try {
            console.log(store?.storeName,'storeproduct');
            const apiCall = await axios.get(`${customer_api_urls.get_store_data}/${store?._id}`);
    
            let cate = apiCall.data?.data?.categories;
              
               
            // let result  = cate.filter((elem, index) => {
            //         const firstIndex = cate.findIndex(({ _id, name }) => {
            //             return _id === elem._id && name === elem.name
            //         });
            //         return firstIndex === index
            // });
                
    
               
            console.log({status:apiCall?.status});
            if (apiCall?.status === 200) {
                console.log('llamando productStore');
                // setProductsData(apiCall.data.data.products);
                await productStore({
                    // productosStore:apiCall.data.data?.products,
                    productosStore:[],
                    minimumPrice:apiCall.data.data.minPrice,
                    categories:[],
                })
                
                // setMinimumPrice(apiCall.data.data.minPrice);
                // setServices(apiCall?.data?.data?.services);

                filterProductStore(apiCall.data.data.products);
               
                
            }

          } catch(e) {
            // console.log({getProducts:e})
            showToaster('No hay conexion con el servidor - 01STR');
           
        }
   
    }

   
    

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
            filterProduct,
            dowload,
            getProducts,
            getCategorias,
            getComision,
            getServices,
            getMarcas,
            getModelo,
            getProductStore,
            filterProductStore,
            productStore,
            storeProduct
        }}
        >
            {children}
        </ProductContext.Provider>
    )
}



 
