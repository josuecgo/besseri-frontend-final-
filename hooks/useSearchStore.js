import axios from 'axios';
import { useState,useEffect } from 'react';
import { customer_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import { showToaster } from '../util/constants';

export const useSearchStore = ( store ) => {
    
    const [ isLoading, setIsLoading ] = useState(true);
    const [ marcas, setMarcas ] = useState([]);
    const [modelo, setModelo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataFilter,setDataFilter] = useState([]);
    const [servicesData,setServicesData] = useState([]);
    const [productFilter, setProductFilter] = useState([]);
    const [valueMaker, setValueMaker] = useState(null);
    const [valueModel, setValueModel] = useState(null);
    const [valueCategorias, setValueCategorias] = useState(null);
    const [servicios, setServicios] = useState(false)
    const [minimumPrice, setMinimumPrice] = useState('loading');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [productsData, setProductsData] = useState([])
    const [comision, setComision] = useState(10);

    const getStore = async () => {
        
        try {
            setIsLoading(true);
            const apiCall = await axios.get(
            `${customer_api_urls.get_store_data}/${store?._id}`);
            let cate = apiCall.data?.data?.categories;
          
           
            let result  = cate.filter((elem, index) => {
                const firstIndex = cate.findIndex(({ _id, name }) => {
                    return _id === elem._id && name === elem.name
                });
                return firstIndex === index
            });
            

            setCategories(result);
            setProductsData(apiCall.data.data.products);
            setMinimumPrice(apiCall.data.data.minPrice);
            setServices(apiCall?.data?.data?.services);
            setIsLoading(false);
            //  setState(apiCall.data.data.products,SCREEN_STATES.PRODUCTS);
            //  setState(apiCall.data.data.categories,SCREEN_STATES.CATEGORIES);
        } catch (e) {
          setIsLoading(false);
          console.log(e);
          console.log(e.response.data);
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
        }
      };

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
       
    }

    const getModelo = async(id) => {
        
        try {
            
            
            const apiCall = await axios.get(`${vendor_api_urls.get_models}/${id}`,);
            
            if (apiCall?.status == 200) {
                setModelo(apiCall.data.data);
            }
            
            } catch (e) {
                
              alert('Algo salió mal');
            }
        
    }



    const searchCallStore = async(st,isServices) => {
        setServicios(isServices);
        
        let itemData;
        let itemModel;
        const name = productsData.filter((item) => {
            itemData = item.name ? item?.name.toLowerCase() : ''.toLowerCase();
            let searchTextData = st;
           
            return itemData.indexOf(searchTextData) > -1;
        });

        setProductFilter(name);
    }  
    

    const makerFilter = () => {
        if (servicios) {
            servicesFilter();
            return;
        }

        
        
        // setModelo(false);
        
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
            
            setProductFilter(productsData);
            
        }
        
        // if (valueCategorias) {
        //     categoriaFilter(productFilter)
        // }

       
       
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
                    console.log(item.model._id);
                    itemModel = item.model ? item?.model?._id : '';
                    let searchTextData = valueModel;
                   
                    return itemModel.indexOf(searchTextData) > -1;
                })

                setProductFilter(modelo ? modelo : []);
               
               
            } else {
                const marca = productsData.filter((item) => {
                    console.log({marca:item.makersIds});
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

    const categoriaFilter = (data) => {
        

        let categoria = [];
        if (data) {
            categoria =  data.filter((item) => {
               
                let itemData = item.categoryId ? item?.categoryId : '';
                let searchTextData = valueCategorias;
                return itemData.indexOf(searchTextData) > -1;
            });
        }else {
            categoria =  productFilter.filter((item) => {
               
                let itemData = item.categoryId ? item?.categoryId : '';
                let searchTextData = valueCategorias;
                return itemData.indexOf(searchTextData) > -1;
            });
        }
       
    
       
        
        
        setProductFilter(categoria ? categoria : []);
       
    }

    const resetFiltros = () => {
        setProductFilter(productsData);
        setValueCategorias(null);
        setValueMaker(null);
        setValueModel(null);

        getStore();
        

    }


    const getComision = async () => {
        try {
          setIsLoading(true);
          const getFee = await axios.get(customer_api_urls?.get_fees);
    
          setComision(getFee.data.data[0]?.besseri_comission);
    
          setIsLoading(false);
          //  setState(apiCall.data.data.products,SCREEN_STATES.PRODUCTS);
          //  setState(apiCall.data.data.categories,SCREEN_STATES.CATEGORIES);
        } catch (e) {
          setIsLoading(false);
    
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo');
        }
       
    };

    useEffect(() => {
        getComision();
    }, [productsData]);




    useEffect(() => {
      makerFilter()
    }, [productsData,valueMaker,valueModel])
    
    useEffect(() => {
        categoriaFilter(productFilter);
    }, [valueCategorias])
    
    
   
    useEffect(() => {
        getMarcas();
    }, [])

    useEffect(() => {
        if (valueMaker) {
            getModelo(valueMaker);
            
        }
    }, [valueMaker]);
   
    useEffect(() => {
        getStore();
    }, []);

    
    
    return {
        isLoading,
        marcas,
        setMarcas,
        modelo,
        setModelo,
        productsData,
        servicesData,
        loading,
        getModelo,
        makerFilter,
        productFilter,
        valueMaker, 
        setValueMaker,
        valueModel, 
        setValueModel,
        dataFilter,
        searchCallStore,
        minimumPrice,
        products,
        categories,
        services,
        valueCategorias, setValueCategorias,
        setCategories,resetFiltros,comision

    }

}



