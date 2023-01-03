import axios from 'axios';
import { useState,useEffect, useCallback, useContext } from 'react';
import { api_statuses, customer_api_urls, vendor_api_urls } from '../util/api/api_essentials';
import { showToaster } from '../util/constants';
import { ProductContext } from '../util/context/Product/ProductContext';
import { getUserId } from '../util/local-storage/auth_service';

export const useFiltrado = ( isServicios ) => {
    const [productFilter, setProductFilter] = useState([]);
    const [serviciosFiltrados, setServiciosFiltrados] = useState([])
    const {
        productos,
        servicios,
        carActive,
        valueMaker,
        valueModel, valueYear,carCompatible,modelo
    } = useContext(ProductContext)
    const [loadingFilter, setLoadingFilter] = useState(false)




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

    const makerFilter = () => {
        if (valueModel && valueYear && modelo) {
            let carModel = modelo.find((item) => item._id === valueModel )
            carCompatible({model:carModel,year:valueYear})
        }else{
            carCompatible(false)
        }
        setLoadingFilter(true)
        let filtrado = []
        if (valueMaker) {
          if (valueModel) {
           
            
            let itemData;
            let itemModel;
           
            const marca = productos.filter((item) => {
                // console.log(item);
              itemData = item.maker ? item?.maker?._id : '';
            //   let itemAplicacion = item.aplicacion ? item.aplicacion : ''
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
           
           
          }else{
             
              const marca = productos.filter((item) => {
                let itemData = item.maker ? item?.maker?._id : '';
                
                let searchTextData = valueMaker;
                    
                return itemData.indexOf(searchTextData) > -1  ;
              })
            
              filtrado = marca ? marca : []
            
             
          }
          
    
        }else{
          filtrado = productos
         
        }
    
        // console.log(filtrado);
        if (valueYear) {
          
            let match = filtrado.filter((item) => {
           
                
            let compatible = item?.matchs.find(element =>  {
                // console.log(element?.model._id);
                // console.log({modell:valueModel});
                let model = valueModel ? element?.model._id === valueModel : ""

                let result = betweenNumber(element?.de,element?.al,valueYear)
              
                if (result && model ) {
                    return element
                }else{
                    return false
                }
            });
            
            let value = valueModel === item.model._id && betweenNumber(item?.aplicacion?.de,item?.aplicacion?.al,valueYear)
            // console.log({
            //     value , compatible
            // });
            if (value || compatible ) {
            
              return item
            }
    
          })
            setLoadingFilter(false)
            // console.log(match);
            setProductFilter(match)
        }else{
            setLoadingFilter(false)
            setProductFilter(filtrado)
        }
       
        
        
        
       
    }

    

    const  betweenNumber = (startingNumber, endingNumber, givenNumber) => {

        if(givenNumber >= startingNumber && givenNumber <= endingNumber){
            console.log(`número dado ${givenNumber} cae entre ${startingNumber} y ${endingNumber}`);
            return true
        }else{
          console.log(`número dado ${givenNumber} no cae entre ${startingNumber} y ${endingNumber}`);
            return false;
        }
    }

    const matchesForModel = (id,searchId) => {
        // console.log(searchId?.matchs);
        
        if (searchId?.matchs.length > 0) {
            // console.log({id});
            // console.log(searchId?.matchs);
            const match = searchId?.matchs.filter(element => element?.model._id === id);
            
            if (match.length > 0) {
                
                return searchId;
            }else{
                return false;
            }
     
        }
        return false;
        
    }



   
    

    useEffect(() => {

        makerFilter();
    }, [productos,valueMaker,valueModel,valueYear])
   
 


    
    
    
   

    return {
        productFilter,
        serviciosFiltrados,
        loadingFilter
    }

}
