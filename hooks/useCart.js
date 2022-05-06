import { useEffect, useState, useRef } from 'react';
import * as CartActions from '../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useDispatch, useSelector } from 'react-redux';
import { showToaster } from '../util/constants';




export const useCart = () => {
    const dispatch = useDispatch();
    const cartProductIds = useSelector(state => state.cart.cart_items_ids);
    const businessIdInCart = useSelector(state => state.cart.businessId);
    const [inCart, setInCart] = useState(false)
   
    const addItemToCart = (item) => {
        
       
        // Si el articulo existe se elimina del carrito
        if(cartProductIds.includes(item?._id)) {
          dispatch(CartActions.deleteItemFromCart(item?._id));
         
          return;
        }
        
        // Si el articulo es de vendedor diferente se prohibe agregar
        if(item?.business_id != businessIdInCart && businessIdInCart != null) {
          showToaster('Solo puede agregar artículos al carrito de una tienda a la vez');
          
          return;
        }

        // Si no cumple ninguna se agrega al carrito
        dispatch(CartActions.addItemToCart({
          ...item,
          quantity:1
        }))

       
       
    }

    const inTheCart = (item) => {
       

        return  cartProductIds?.includes(item?._id);
    }
    

    return {
        addItemToCart,
        cartProductIds,
        inCart,
        inTheCart
    }
}