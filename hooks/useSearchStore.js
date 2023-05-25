import axios from 'axios';
import { useState,useEffect, useContext } from 'react';
import { customer_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import { showToaster } from '../util/constants';
import { ProductContext } from '../util/context/Product/ProductContext';
import { matchMaker, matchModel, matchYear } from '../util/utility-functions';
import { getMakerValueCars, getMakersCars, getModelValueCars, getModelsCars, getYearValueCar } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';
import { useDispatch, useSelector } from 'react-redux';


export const useSearchStore = (  ) => {
    const  dispatch = useDispatch();
    const {marcaValue} = useSelector(state => state.user )
    
    const [ isLoading, setIsLoading ] = useState(true);
    const [ marcas, setMarcas ] = useState([]);
    const [modelo, setModelo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataFilter,setDataFilter] = useState([]);
    const [servicesData,setServicesData] = useState([]);
    const [productFilter, setProductFilter] = useState([]);
    const [valueMaker, setValueMaker] = useState(null);
    const [valueModel, setValueModel] = useState(null);
    const [valueYear, setValueYear] = useState("")
    const [valueCategorias, setValueCategorias] = useState(null);
    const [servicios, setServicios] = useState(false)
    const [minimumPrice, setMinimumPrice] = useState('loading');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [productsData, setProductsData] = useState([])
    const [comision, setComision] = useState(10);

    const {
        getCategorias,
        carDefault,carCompatible
    } = useContext(ProductContext)

    const getStore = async (tienda) => {
        
        try {
            setIsLoading(true);
           
            const apiCall = await axios.get(`${customer_api_urls.get_store_data}/${tienda?._id}`);
            
            let cate = apiCall?.data?.data?.categories;
            // let result  = cate.filter((elem, index) => {
            //     const firstIndex = cate.findIndex(({ _id, name }) => {
            //         return _id === elem._id && name === elem.name
            //     });
            //     return firstIndex === index
            // });
            
           
            setCategories(cate);
            setProductsData(apiCall?.data?.data?.products);
            setProductFilter(apiCall?.data?.data?.products)
            // setMinimumPrice(apiCall?.data?.data?.minPrice);
            // setServices(apiCall?.data?.data?.services);
            setIsLoading(false);
            //  setState(apiCall.data.data.products,SCREEN_STATES.PRODUCTS);
            //  setState(apiCall.data.data.categories,SCREEN_STATES.CATEGORIES);
        } catch (e) {
          setIsLoading(false);
        //   console.log(e);
        //   console.log(e.response.data);
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo get store');
        }
    };

    const getMarcas = async () => {
        
        try {
            const apiCall = await axios.get(vendor_api_urls?.get_makers)
            if (apiCall.status == 200) {
              
                dispatch(getMakersCars(apiCall.data?.data))
            } else {
                
                showToaster('No tienes conexion a la red')
            }
        } catch (error) {
           
           showToaster(error.response.data.message)
        }
       
    }

    const getModelo = async(id) => {
        
        try {
            
           
            const apiCall = await axios.get(`${vendor_api_urls.get_models}/${id}`,);
            
            if (apiCall?.status == 200) {
               
                dispatch(getModelsCars(apiCall.data?.data))
            }
            
            } catch (e) {
                
              alert(e.response.data.message);
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
       
    
        let filtrado = []
        if (valueModel && valueYear && modelo) {
            let carModel = modelo.find((item) => item._id === valueModel )
            carCompatible({model:carModel,year:valueYear})
        }else{
            carCompatible(false)
        }

        if (valueMaker) {
          if (valueModel) {
           

            const modelo =  matchModel(productsData,valueMaker,valueModel,valueYear)
            filtrado = modelo ? modelo : []
           
           
           
          }else{
            const marca = matchMaker(productsData,valueMaker,valueYear);

         
            filtrado = marca ? marca : []
            
             
          }
    
        }else{
          filtrado = productsData
         
        }
       
        if (valueYear) {
            let match = matchYear(filtrado,valueModel,valueYear)
          
            setProductFilter(match)
        }else{
            setProductFilter(filtrado)
        }
       
        
        
        
       
    }


    const resetFiltros = () => {
        setProductFilter(productsData);
        setValueCategorias(null);
        
        dispatch(getModelsCars([]))
        dispatch(getMakerValueCars(null))
        dispatch(getYearValueCar(null))
        // setValueMaker("");
        // setValueModel("");
        // setValueYear("")
        // setModelo('')
        // getStore(store);
        

    }


    const handleMarca = (item) => {
       
        dispatch(getMakerValueCars(item))
        

    }
    const handleModel = (item) => {
       
        dispatch(getModelValueCars(item))
    }
    const handleYear = (item) => {
        
       
        dispatch(getYearValueCar(item))

    }
    

    useEffect(() => {
        handleMarca(carDefault?.maker?._id)
        handleYear(carDefault?.year)
    }, [carDefault])

    useEffect(() => {
      if (carDefault && modelo) {
        handleModel(carDefault?.model?._id)
      }
    }, [modelo,carDefault])
    
   
    useEffect(() => {
        getMarcas();
    }, [])

    useEffect(() => {
        if (marcaValue) {
            getModelo(marcaValue);
            
        }
    }, [marcaValue]);
   
  
    // useEffect(() => {

    //     makerFilter();
    // }, [marcaValue,valueModel,valueYear])
    
    
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
        setCategories,resetFiltros,comision,
        getStore,valueYear, setValueYear,
        handleMarca,
        handleModel,
        handleYear
    }

}

