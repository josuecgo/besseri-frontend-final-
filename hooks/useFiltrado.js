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
        valueYear,
        filterProduct
    } = useContext(ProductContext)
    

    // const makerFilter = () => {
    //     if (isServicios === 'Servicios') {
    //         servicesFilter();
    //         return;
    //     }
    //     let filtrado = []
    //     if (valueMaker) {
    //         if (valueModel) {
               
    //             let itemData;
    //             let itemModel;
    //             const marca = productos.filter((item) => {
    //                 itemData = item.maker ? item?.maker?._id : '';
    //                 let searchTextData = valueMaker;
    //                 let searchTextData2 = valueModel;
    //                 let match = matchesForModel(searchTextData2,item);
    //                 return itemData.indexOf(searchTextData) > -1 || match;
    //             })
                
    //             const modelo = marca.filter((item) => {
                    
    //                 itemModel = item.model ? item?.model?._id : '';
    //                 let searchTextData = valueModel;

    //                 let match = matchesForModel(searchTextData,item);
                    
    //                 return itemModel.indexOf(searchTextData) > -1 || match;
    //             })

    //             filtrado = modelo ? modelo : []

    //             // setProductFilter(modelo ? modelo : []);
    //             // filterProduct(modelo ? modelo : []);
               
    //         } else {
                
    //         const marca = productos.filter((item) => {
    //             let itemData = item.maker ? item?.maker?._id : '';
                
    //             let searchTextData = valueMaker;
                
    //             return itemData.indexOf(searchTextData) > -1  ;
    //         })
    //             filtrado = marca ? marca : []
    //             // setProductFilter();
    //             // filterProduct(marca ? marca : [])
    //         }

            
          
    //     }else{  
    //         filtrado = productos
    //         // filterProduct(productos)
    //         // setProductFilter(productos)
    //     }

    //     if (valueYear) {
      
    //         let match = filtrado.filter((item) => {
              
            
            
    //           let compatible = item?.matchs.find(element =>  {
      
    //             let result = betweenNumber(element?.de,element?.al,valueYear)
                
    //             if (result) {
    //               return element
    //             }else{
    //               return false
    //             }
    //           });
              
    //           // console.log({
    //           //   name:item.name,
    //           //   bde:item?.aplicacion?.de,
    //           //   bbollDe: item?.aplicacion?.de <= valueYear,
    //           //   al:item?.aplicacion?.al,
    //           //   aboolAl:item?.aplicacion?.al >= valueYear,
    //           //   valueYear,
    //           //   compatible
    //           // });
      
    //           if (valueYear >= item?.aplicacion?.de  && valueYear <= item?.aplicacion?.al || compatible ) {
               
    //             return item
    //           }
      
    //         })
            
    //         filterProduct(match)
    //         setProductFilter(match)
    //       }else{
    //         filterProduct(filtrado)
    //         setProductFilter(filtrado)
            
    //       }

        
       
    // };


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
       
    
        let filtrado = []
        if (valueMaker) {
          if (valueModel) {
           
            
            let itemData;
            let itemModel;
           
            const marca = productos.filter((item) => {
              itemData = item.maker ? item?.maker?._id : '';
              itemAplicacion = item.aplicacion ? item.aplicacion : ''
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
    
        if (valueYear) {
          
          let match = filtrado.filter((item) => {
            

            let compatible = item?.matchs.find(element =>  {
                let model = valueModel ? element?.model === valueModel : ""

                let result = betweenNumber(element?.de,element?.al,valueYear)
              
                if (result && model ) {
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
            let value = betweenNumber(item?.aplicacion?.de,item?.aplicacion?.al,valueYear)
    
            if (value || compatible ) {
             
              return item
            }
    
          })
          
            setProductFilter(match)
        }else{
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
        
        if (searchId?.matchs.length > 0) {
            // console.log({id,searchId:searchId?.matchs});
            const match = searchId?.matchs.filter(element => element?.model === id);
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
    }, [productos,valueMaker,valueModel,servicios,valueYear])
    
   
 
  

    return {
        productFilter,
        serviciosFiltrados
    }

}
