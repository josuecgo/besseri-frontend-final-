import { GET_PEDIDOS_USER, IS_LOADING_DATA } from "../../Actions/CustomerActions/PedidosAction"


const initialState = {
  orders:[],
  isLoading:true,

}
export default (state = initialState, action) => {
   
    switch (action.type) {
        
        case GET_PEDIDOS_USER:
            
        return {
            ...state,
            orders: action.data,
            isLoading:false
        }

        case IS_LOADING_DATA:
            
        return {
            ...state,
            isLoading:action.data
        }


        default:
            return state
    }
}