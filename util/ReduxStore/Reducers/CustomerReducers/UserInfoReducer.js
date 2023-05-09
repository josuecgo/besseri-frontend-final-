import { ADD_ADDRESS, ADD_CARS_TO_USER, ADD_CAR_ACTIVE_TO_USER } from "../../Actions/CustomerActions/UserInfoActions"


const initialState = {
  user:null,
  userId: null,
  address:null,
  cars:[],
  carActive: null
}
export default (state = initialState, action) => {
    switch (action.type) {
 
        case ADD_ADDRESS:
            
            return {
                ...state,
                address: action.data,
            }
        case ADD_CAR_ACTIVE_TO_USER:
            
            return {
                ...state,
                carActive: action.data,
            }
        case ADD_CARS_TO_USER:
            // let existCar = state.cars.find( el => el._id === action.data._id );
            
            // if (existCar) {
            //     return {
            //         ...state,
            //     }
            // }
            return {
                ...state,
                cars: action.data,
            }      
        default:
            return state
    }
}