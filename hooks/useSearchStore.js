import axios from 'axios';
import { useState,useEffect, useContext, useCallback } from 'react';
import { customer_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import { showToaster } from '../util/constants';
import { ProductContext } from '../util/context/Product/ProductContext';
import { matchMaker, matchModel, matchYear } from '../util/utility-functions';
import { addCarActiveToUser, getMakerValueCars, getMakersCars, getModelValueCars, getModelsCars, getYearValueCar, getYearsCars } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';
import * as UserInfoActions from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';
import { useDispatch, useSelector } from 'react-redux';


export const useSearchStore = (  ) => {
    const  dispatch = useDispatch();
    const {carActive,user} = useSelector(state => state.user )
    
    const [ isLoading, setIsLoading ] = useState(true);
    const [ marcas, setMarcas ] = useState([]);
    const [modelo, setModelo] = useState(null);
    const [productFilter, setProductFilter] = useState([]);
    const [valueMaker, setValueMaker] = useState(null);
    const [valueModel, setValueModel] = useState(null);
    const [valueYear, setValueYear] = useState("")
    const [valueCategorias, setValueCategorias] = useState(null);
    const [categories, setCategories] = useState([]);
    const [productsData, setProductsData] = useState([])
    const { carCompatible,getProducts } = useContext(ProductContext)

    const getStore = async (tienda) => {
        
        try {
            setIsLoading(true);
           
            const apiCall = await axios.get(`${customer_api_urls.get_store_data}/${tienda?._id}`);
            
            let cate = apiCall?.data?.data?.categories;
          
            
           
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
        //   //console.log(e);
        //   //console.log(e.response.data);
          showToaster('Algo salió mal. Por favor, vuelva a intentarlo get store');
        }
    };

    const getMarcas = useCallback(
        async () => {
            
            
            try {
                const apiCall = await axios.get(vendor_api_urls?.get_makers)
                if (apiCall.status == 200) {
                   
                    await dispatch(getMakersCars(apiCall.data?.data))
                } else {
                    
                    showToaster('No tienes conexion a la red')
                }
            } catch (error) {
               
               showToaster(error.response.data.message)
            }
           
        },
      [],
    )

    const getModelo = useCallback(
    async (id) => {
        try {
            const apiCall = await axios.get(`${vendor_api_urls.get_models}/${id}`);
          
            if (apiCall?.status === 200) {
                dispatch(getModelsCars(apiCall.data?.data))
            }
        } catch (error) {
           showToaster(error.response.data.message)
        }
    },
    [dispatch] // Solo depende de dispatch, que es estable
);
    



    const rangeYear = async() => {
        const max = new Date().getFullYear() + 1

        const min = max - 33
        const years = []

        for (let i = max; i >= min; i--) {
            years.push(i)
        }
       
        await dispatch(getYearsCars(years))

    }



    const searchCallStore = async(st,isServices) => {
       
        
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


    const resetFiltros = async() => {
        setProductFilter(productsData);
        setValueCategorias(null);
        
        // dispatch(resetFiltros())
       
      
        

    }


    const handleMarca = (item) => {
        handleModel('')
        handleYear('')
        dispatch(getMakerValueCars(item))
        
        dispatch(addCarActiveToUser({
            ...carActive,
            maker:{
                _id:item
            },
            model:'',
            year:null
        }))
        
       
    }
    const handleModel = (item) => {
       
        dispatch(getModelValueCars(item))

        dispatch(addCarActiveToUser({
            ...carActive,
            model:{
                _id:item
            },
            year:null
        }))
    }
    const handleYear = (item) => {
        
       
        dispatch(getYearValueCar(item))
        dispatch(addCarActiveToUser({
            ...carActive,
            year:item
        }))

    }
    
    const resetCar = () => {
        dispatch(UserInfoActions.resetFiltros())
    }

 
    
   
    useEffect(() => {
        getMarcas();
        rangeYear()
    }, [])

  
   


   

    
    
    return {
        isLoading,
        marcas,
        setMarcas,
        modelo,
        setModelo,
        productsData,
        getModelo,
        makerFilter,
        productFilter,
        valueMaker, 
        setValueMaker,
        valueModel, 
        setValueModel,
        resetCar,
        searchCallStore,
        categories,
        valueCategorias, setValueCategorias,
        setCategories,resetFiltros,
        getStore,valueYear, setValueYear,
        handleMarca,
        handleModel,
        handleYear,
        getMarcas
    }

}

