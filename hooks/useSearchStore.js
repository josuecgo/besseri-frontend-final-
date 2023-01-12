import axios from 'axios';
import { useState,useEffect, useContext } from 'react';
import { customer_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import { showToaster } from '../util/constants';
import { ProductContext } from '../util/context/Product/ProductContext';
import { matchMaker, matchModel, matchYear } from '../util/utility-functions';


export const useSearchStore = (  ) => {
    
    const [ isLoading, setIsLoading ] = useState(true);
    const [ marcas, setMarcas ] = useState([]);
    const [modelo, setModelo] = useState(false);
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
        productos,
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
                setMarcas(apiCall.data?.data)
            } else {
                setMarcas([]);
                showToaster('No tienes conexion a la red')
            }
        } catch (error) {
           
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


    const  betweenNumber = (startingNumber, endingNumber, givenNumber) => {

        if(givenNumber >= startingNumber && givenNumber <= endingNumber){
            // console.log(`número dado ${givenNumber} cae entre ${startingNumber} y ${endingNumber}`);
            return true
        }else{
        //   console.log(`número dado ${givenNumber} no cae entre ${startingNumber} y ${endingNumber}`);
            return false;
        }
    }

    const matchesForModel = (id,searchId) => {
        
        if (searchId?.matchs.length > 0) {
            // console.log({id,searchId:searchId?.matchs});
            const match = searchId?.matchs.filter(element => element?.model?._id === id);
            if (match.length > 0) {
                
                return searchId;
            }else{
                return false;
            }
     
        }
        return false;

    }


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

    const categoriaFilter = async (data) => {
        
        // setValueMaker(null);
        // setValueModel(null);
        // await getStore()
        let categoria = [];
        if (data) {
            
            categoria =  data.filter((item) => {
               
                let itemData = item.categoryId ? item?.categoryId : '';
                let searchTextData = valueCategorias;
                return itemData.indexOf(searchTextData) > -1;
            });
        }else {
            categoria =  productos.filter((item) => {
               
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
        setValueMaker("");
        setValueModel("");
        setValueYear("")
        setModelo('')
        // getStore(store);
        

    }


    const handleMarca = (item) => {
       
        setValueModel('')
        setValueMaker(item)
        

    }
    const handleModel = (item) => {
        setValueModel(item);

    }
    const handleYear = (item) => {
        
        setValueYear(item);

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
        if (valueMaker) {
            getModelo(valueMaker);
            
        }
    }, [valueMaker]);
   
  
    useEffect(() => {

        makerFilter();
    }, [valueMaker,valueModel,valueYear])
    
    
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

