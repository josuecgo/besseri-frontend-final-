import { ADD_ITEM_TO_CART, INCREASE_QUANTITY,DECRASE_QUANTITY, REMOVE_ITEM,RESET_CART,DELETE_ITEM, DESCUENTO } from "../../Actions/CustomerActions/CartActions"
import { ADD_NOTIFICATION } from "../../Actions/NotificationActions"

const initialState = {
    cart_items: [],
    cart_items_ids: [],
    total_amount:0,
    businessId:null,
    notifications:[],
    descuento:0,
    idDesc:false
}
export default (state = initialState, action) => {
    switch (action.type) {
 
        case ADD_ITEM_TO_CART:
            
            return {
                ...state,
                cart_items: state.cart_items.concat(action.data),
                cart_items_ids: state.cart_items_ids.concat(action.data?._id),
                total_amount:state.total_amount + Number(action.data.price),
                businessId:action?.data?.business_id,
            }
        case DESCUENTO:
            
            return {
                ...state,
                descuento:action.descuento,
                idDesc:action.id
            }
        case DELETE_ITEM:
            const selectedItem = state.cart_items.filter(item => item?._id == action.data);
            const productAmount = Number(selectedItem[0]?.price) * selectedItem[0]?.quantity;
            let id = state.cart_items.length == 1 ?  null : state.businessId;
            return {
                ...state,
                cart_items:state?.cart_items?.filter(item => item?._id != action?.data),
                cart_items_ids:state?.cart_items_ids?.filter(item => item != action?.data),
                total_amount:state?.total_amount - productAmount,
                businessId:id
                
            }  
        case REMOVE_ITEM:
            
            const removeItem = state?.cart_items?.filter(item => item?._id != action?.data._id)
            
            return {
                ...state
                    
            }  
        case RESET_CART:
            return {
                ...state,
                cart_items:[], 
                cart_items_ids:[],
                total_amount:0,
                businessId: null
            }      
        case INCREASE_QUANTITY:
            const item = state.cart_items.find(
                product => product._id === action.data,
            );

            if (item) {
                return {
                    ...state,
                    cart_items: state.cart_items.map(item => item._id === action.data
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item
                    ),
                    total_amount:state.total_amount + Number(action.price)
                };
            }
            return {
                ...state,
                cart_items: [...state.cart_items, action.data]
            }

        case DECRASE_QUANTITY:
            const item2 = state.cart_items.find(
                product => product._id === action.data,
            );

            if (item2) {
                return {
                    ...state,
                    cart_items: state.cart_items.map(item => item._id === action.data
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                        }
                        : item
                    ),
                    total_amount:state.total_amount - Number(action.price)
                };
            }
            return {
                ...state,
                cart_items: [...state.cart_items, action.data]
            }
           
        default:
            return state
    }
}