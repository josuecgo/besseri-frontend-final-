import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { api_statuses, customer_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import { showToaster } from '../util/constants';
import { getBusinessId, getBusinessProfile } from '../util/local-storage/auth_service';

export const useVendor = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [products, setProducts] = useState([])
  const [categorias, setCategorias] = useState([])
  const [selectedCategory, setSelectedcategory] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [productsCategoria, setProductsCategoria] = useState([])
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([])
  const [years, setYears] = useState([]);
  const [productsFilter, setProductsFilter] = useState([])
  const [business,setBusinessDetails] = useState(null);
  const business_profile = useSelector(state => state?.businessActions);

  const getMyProducts = async () => {
    try {
      setShowLoader(true);
      const profile = await getBusinessProfile();
      setBusinessDetails(profile);

      // const businessId = await getBusinessId();
      // const url = `${vendor_api_urls.get_products}/${businessId}`
      // const apiCall = await axios.get(url);
      setShowLoader(false);
      // if (apiCall.status == 200) {
      //   setProducts(apiCall.data.data);

      //   return;
      // }
      // alert('No hay conexion con el servidor');
    } catch (e) {
      setShowLoader(false);
      //  console.log(e.response.data);
      alert('ocurrió un error');
    }
  }

  const getCategorias = async (params) => {
    try {
      setShowLoader(true)
      const apiCall = await axios.get(customer_api_urls.get_products, { params });

      if (apiCall.status === 200) {
        setCategorias(apiCall?.data?.data?.categories)
        setShowLoader(false)
      }


    } catch (e) {
      // console.log({getProducts:e})
      showToaster('No hay conexion con el servidor - C01');
      setShowLoader(false)
    }
  }

  const getSubCategories = async (data) => {
    try {

      if (data?._id) {
        setShowLoader(true);
        const apiCall = await axios.get(
          `${vendor_api_urls.get_sub_categories}/${data?._id}`,
        );

        setShowLoader(false);

        if (apiCall?.status == api_statuses?.success) {
          setSubcategories(apiCall.data.data);
        }

      }

    } catch (e) {
      // console.log(e?.response?.data);
      showToaster('No hay conexion con el servidor')
      setShowLoader(false);
    }
  };

  const productSubCategoria = async (data) => {
    try {

      if (data?._id) {
        setShowLoader(true);
        const apiCall = await axios.get(
          `${vendor_api_urls.get_products_sub_categories}/${data?._id}`,
        );

        setShowLoader(false);

        if (apiCall?.status == api_statuses?.success) {
          setProductsCategoria(apiCall.data.data);
          setProductsFilter(apiCall.data.data);

        }

      }

    } catch (e) {
      // console.log(e?.response?.data);
      showToaster('No hay conexion con el servidor')
      setShowLoader(false);
    }
  }

  const getMarcas = useCallback(
    async () => {
      try {
        const apiCall = await axios.get(vendor_api_urls?.get_makers)
        if (apiCall?.status == 200) {

          setMarcas(apiCall.data?.data)
        }


      } catch (error) {
        showToaster('No hay marcas disponibles')

      }
    },
    [],
  )

  const getModelo = useCallback(
    async (id) => {
      try {



        const apiCall = await axios.get(`${vendor_api_urls.get_models}/${id}`);

        if (apiCall?.status == 200) {
          setModelos(apiCall.data.data);
        }



      } catch (e) {

        Alert('Algo salió mal modelo');
      }
    },
    [],
  )


  const rangeYear = () => {
    const max = new Date().getFullYear() + 1

    const min = max - 33
    const years = []

    for (let i = max; i >= min; i--) {
      years.push(i)
    }
    setYears(years);
  }

  const filterProducts = (valueMaker, valueModel,valueYear) => {
    setShowLoader(true);

    let filtrado = []
    if (valueMaker) {
      if (valueModel) {
       
        setShowLoader(true)
        let itemData;
        let itemModel;
       
        const marca = productsCategoria.filter((item) => {
          itemData = item.maker ? item?.maker?._id : '';
          
          let searchTextData = valueMaker;
          let searchTextData2 = valueModel;
          
          let match = matchesForModel(searchTextData2,item,valueYear);
          
          return itemData.indexOf(searchTextData) > -1 || match ;
      })
  
        const modelo = marca.filter((item) => {
          itemModel = item.model ? item?.model?._id : '';
          let searchTextData = valueModel;
          
          let match = matchesForModel(searchTextData,item,valueYear);
          
          return itemModel.indexOf(searchTextData) > -1 || match ;
      })
        filtrado = modelo ? modelo : []
       
        setShowLoader(false)
      }else{
          setShowLoader(true)
          const marca = productsCategoria.filter((item) => {
            let itemData = item.maker ? item?.maker?._id : '';
            
            let searchTextData = valueMaker;
                
            return itemData.indexOf(searchTextData) > -1  ;
          })
        
          filtrado = marca ? marca : []
        
          setShowLoader(false)
      }

    }else{
      filtrado = productsCategoria
     
    }

    if (valueYear) {
      
      let match = filtrado.filter((item) => {
        
      
      
        let compatible = item?.matchs.find(element =>  {
          let model = valueModel ? element?.model === valueModel : ""
          let result = betweenNumber(element?.de,element?.al,valueYear)
          
          if (result && model) {
            return element
          }else{
            return false
          }
        });
        
        // console.log({
        //   name:item.name,
        //   bde:item?.aplicacion?.de,
        //   bbollDe: item?.aplicacion?.de <= valueYear,
        //   al:item?.aplicacion?.al,
        //   aboolAl:item?.aplicacion?.al >= valueYear,
        //   valueYear,
        //   compatible
        // });

        if (valueYear >= item?.aplicacion?.de  && valueYear <= item?.aplicacion?.al || compatible ) {
         
          return item
        }

      })
      
      setProductsFilter(match)
    }else{
      setProductsFilter(filtrado)
    }
    setShowLoader(false);
    
    
    
   
  }

    const  betweenNumber = (startingNumber, endingNumber, givenNumber) => {

      if(givenNumber >= startingNumber && givenNumber <= endingNumber){
          // console.log(`número dado ${givenNumber} cae entre ${startingNumber} y ${endingNumber}`);
          return true
      }else{
        // console.log(`número dado ${givenNumber} no cae entre ${startingNumber} y ${endingNumber}`);
          return false;
      }
    }


    const matchesForModel = (id,searchId,year) => {
       
        if (searchId?.matchs.length > 0) {
            let match;
            
           
              match = searchId?.matchs.filter(element => element?.model === id );
    
            
           
            if (match.length > 0 ) {
                return searchId;
            }else{
                return false;
            }
     
        }
        return false;
        
    }



  useEffect(() => {
    getCategorias()
  }, [])


  useEffect(() => {

    getMarcas()


  }, [])

  useEffect(() => {
    rangeYear()
  }, [])

  useEffect(() => {
    getMyProducts()
  }, [])
  





  return {
    products,
    showLoader,
    getMyProducts,
    categorias,
    setSelectedcategory,
    subcategories,
    getSubCategories,
    productSubCategoria,
    selectedCategory,
    productsCategoria,
    marcas,
    modelos,
    getModelo,
    years,
    productsFilter,
    filterProducts,
    setShowLoader,
    business_profile,
    business
  }

}