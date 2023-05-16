import { GET_PEDIDOS_USER } from "../../Actions/CustomerActions/PedidosAction"


const initialState = {
  orders:[],
  isLoading:false,

}
export default (state = initialState, action) => {
   
    switch (action.type) {
        
        case GET_PEDIDOS_USER:
            
        return {
            ...state,
            orders: action.data,
            isLoading:false
        }


        default:
            return state
    }
}