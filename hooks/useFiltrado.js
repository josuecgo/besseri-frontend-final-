import axios from 'axios';
import { useState,useEffect, useCallback, useContext } from 'react';
import { customer_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import { showToaster } from '../util/constants';
import { ProductContext } from '../util/context/Product/ProductContext';

export const useFiltrado = ( isServicios ) => {
    
    

    const [productFilter, setProductFilter] = useState([]);
    const [serviciosFiltrados, setServiciosFiltrados] = useState([])
    const {
        productos,
        valueMaker, 
        valueModel,
        servicios,
        
    } = useContext(ProductContext)
    
    
    const makerFilter = () => {
        if (isServicios === 'Servicios') {
            servicesFilter();
            return;
        }

        if (valueMaker) {
            if (valueModel) {
               
                let itemData;
                let itemModel;
                const marca = productos.filter((item) => {
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
                
                const marca = productos.filter((item) => {
                    let itemData = item.maker ? item?.maker?._id : '';
                    let searchTextData = valueMaker;
                    return itemData.indexOf(searchTextData) > -1;
                })
                
                setProductFilter(marca ? marca : []);
            }

            
          
        }else{  
           
            setProductFilter(productos)
        }
       
    };

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

   
    useEffect(() => {
      makerFilter();
    }, [productos,valueMaker,valueModel,servicios])
    
   
   
  

    return {
        productFilter,
        serviciosFiltrados
    }

}
