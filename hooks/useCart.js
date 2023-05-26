import { useCallback, useContext, useEffect, useState } from 'react';
import * as CartActions from '../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useDispatch, useSelector } from 'react-redux';
import { showToaster } from '../util/constants';

import { useCompras } from '../hooks/useCompras';
import { ProductContext } from '../util/context/Product/ProductContext';



export const useCart = () => {
    const dispatch = useDispatch();
    const cartProductIds = useSelector(state => state?.cart?.cart_items_ids);
    const businessIdInCart = useSelector(state => state.cart.businessId);
    const products = useSelector(state => state.cart.cart_items);
    const montoTotal = useSelector(state => state.cart.total_amount);
    const businessId = useSelector(state => state?.cart?.businessId);
    const [businessProfiles, setBusinessProfiles] = useState([]);
    const {
      comision,
    } = useContext(ProductContext);
    const [inCart, setInCart] = useState(false)
    const {aplicarCupones,isLoading} = useCompras()
    const [aplicado, setAplicado] = useState('')
    const [cupon, setCupon] = useState(null)

    
    
    const addItemToCart = (item) => {
        
       
        // Si el articulo existe se elimina del carrito
        if(cartProductIds.includes(item?._id)) {
          dispatch(CartActions.deleteItemFromCart(item?._id));
         
          return false ;
        }
        
        // Si el articulo es de vendedor diferente se prohibe agregar
        if(item?.business_id != businessIdInCart && businessIdInCart != null) {
          showToaster('Solo puede agregar artículos al carrito de una tienda a la vez');
          
          return false;
        }

        // Si no cumple ninguna se agrega al carrito
        dispatch(CartActions.addItemToCart({
          ...item,
          quantity:1
        }))

        return true
       
       
    }

    const inTheCart = (item) => {
       

        return  cartProductIds?.includes(item?._id);
    }


    const applyCupon = async(valor) => {
     
      
      if (valor) {
        if (valor?.type == '%') {
          let desc = montoTotal / 100 * valor?.descuento;
          
          await dispatch(CartActions.descuentoToCart(desc,valor));
          return
        } else { 
          
          let desc =  valor?.descuento;
          
          await dispatch(CartActions.descuentoToCart(desc,valor));
          return;
        }
      }
      return 
    }



  const aplicar = useCallback(
    async (txtCupon) => {
        
      try {
        const total = Number(montoTotal) + Number((comision * montoTotal) / 100)
        const result = await aplicarCupones(txtCupon,total);
        
        
        if (result?.status == 200) {
          setAplicado(result?.cupon?.data)
          applyCupon(result?.cupon?.data)
          setCupon(result)
        }
            
        } catch (e) {
          // console.log(e?.response?.status);
          showToaster('ESTE DESCUENTO YA FUE APLICADO.');
          return {status:e?.response?.status}
        }
      }, 
  [montoTotal]);


  const borrarDescuento = async() => {
    await dispatch(CartActions.descuentoToCart(0,false));
    // setAplicado(null);
  }
  
  useEffect(async() => {
    if (!cupon) {
      borrarDescuento()
    }
  }, [cupon])
  
  


    



    return {
        addItemToCart,
        cartProductIds,
        inCart,
        inTheCart,
        products,businessProfiles,
        businessId,
        applyCupon,
        aplicar,
        cupon,
        aplicado,
       
    }
}