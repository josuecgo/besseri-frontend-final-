import axios from 'axios';
import { useState,useEffect, useCallback, useContext } from 'react';
import { api_statuses, customer_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import { showToaster } from '../util/constants';
import { ProductContext } from '../util/context/Product/ProductContext';
import { getUserId } from '../util/local-storage/auth_service';
import { matchMaker, matchModel, matchYear } from '../util/utility-functions';
import { useSelector } from 'react-redux';

export const useFiltrado = ( isServicios ) => {
    const [productFilter, setProductFilter] = useState([]);
    const [serviciosFiltrados, setServiciosFiltrados] = useState([])
    const {
        productos,
        servicios,
    } = useContext(ProductContext)
    const [loadingFilter, setLoadingFilter] = useState(false)

    const {carActive} = useSelector(state => state.user);

   

    const servicesFilter = ()=> {
        

        if (valueMaker) {
            if (valueModel) {
               
                let itemData;
                let itemModel;
                const marca = servicios.filter((item) => {
                    itemData = item.makersIds ? item?.makersIds : '';
                    let searchTextData = valueMaker;
                   
                    return itemData.indexOf(searchTextData) > -1;
                })
                
                const modelo = marca.filter((item) => {
                    
                    itemModel = item.model ? item?.model?._id : '';
                    let searchTextData = valueModel;
                   
                    return itemModel.indexOf(searchTextData) > -1;
                })

                setServiciosFiltrados(modelo ? modelo : []);
               
               
            } else {
                const marca = servicios.filter((item) => {
                    
                    let itemData = item.makersIds ? item?.makersIds : '';
                    let searchTextData = valueMaker;
                    return itemData.indexOf(searchTextData) > -1;
                })
                
                setServiciosFiltrados(marca ? marca : []);
            }

            
          
        }else{  
           
            setServiciosFiltrados(servicios)
        }
    }

    const makerFilter = async() => {
        let valueMaker = carActive?.maker?._id
        let valueModel = carActive?.model?._id;
        let valueYear = carActive?.year;
        
      
        setLoadingFilter(true)
        
        let filtrado = []
        if (valueMaker) {
            if (valueModel) {
              
                const modelo = await matchModel(productos,valueMaker,valueModel,valueYear)
        
        
                filtrado = modelo ? modelo : []
            
            
            }else{
                
                
                const marca = matchMaker(productos,valueMaker,valueYear);

                filtrado = marca ? marca : []
                
                
            }
          
    
        }else{
          filtrado = productos
         
        }
    
       
        if (valueYear) {
            let match = matchYear(filtrado,valueModel,valueYear)
           
            setLoadingFilter(false)
           
            setProductFilter(match)
        }else{
            setLoadingFilter(false)
            setProductFilter(filtrado)
        }
       
        
        
        
       
    }



   
    

    useEffect(() => {
        if (productos) {
            makerFilter();
        }
        
    }, [productos,carActive])
   
 


    
    
    
   

    return {
        productFilter,
        serviciosFiltrados,
        loadingFilter
    }

}
