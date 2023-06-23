import { ADD_ADDRESS, ADD_CARS_TO_USER, ADD_CAR_ACTIVE_TO_USER, ADD_USER, DELETE_TO_USER, GET_MAKERS_CARS, GET_MAKER_VALUE_CARS, GET_MODELS_CARS, GET_MODEL_VALUE_CARS, GET_YEARS_CARS, GET_YEAR_VALUE_CAR, RESET_FILTROS, SAVE_NOTIFICATION } from "../../Actions/CustomerActions/UserInfoActions"


const initialState = {
  user:null,
  userId: null,
  address:null,
  addresses:[],
  cars:[],
  carActive: null,
  marcas:[],
  modelos:[],
  marcaValue:'',
  modeloValue:'',
  yearValue:'',
  isLoading:false,
  years:[],
  notificaciones:[],
  count:0
}
export default (state = initialState, action) => {
   
    switch (action.type) {
        
        case ADD_USER:
            
        return {
            ...state,
            user: action.data,
            userId:action.data._id,
            isLoading:false
        }
        case DELETE_TO_USER:
            
        return {
            ...state,
            user:null,
            userId: null,
            address:null,
            cars:[],
            carActive: null,
            marcaValue:'',
            modeloValue:'',
            yearValue:'',
            isLoading:false,
            notificaciones:[],
            count:0
        }
        case ADD_ADDRESS:
            
            return {
                ...state,
                address: action.data[0],
                addresses:action.data,
                isLoading:false
            }
        case ADD_CAR_ACTIVE_TO_USER:
            
            return {
                ...state,
                carActive: action.data,
                isLoading:false
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
                isLoading:false
        } 
        case GET_MAKERS_CARS:
           
            return {
                ...state,
                marcas: action.data,
                isLoading:false
            } 
        case GET_MODELS_CARS:
           
            return {
                ...state,
                modelos: action.data,
                isLoading:false
            }
        case GET_MAKER_VALUE_CARS:
           
            return {
                ...state,
                marcaValue: action.data,
                modeloValue: null,
                isLoading:false
            } 
        case RESET_FILTROS:
           
            return {
                ...state,
                marcaValue: '',
                modeloValue: '',
                yearValue:'',
                isLoading:false
            } 
        case GET_MODEL_VALUE_CARS:
           
            return {
                ...state,
                modeloValue: action.data,
                isLoading:false
            }     
        case GET_YEARS_CARS:
           
            return {
                ...state,
                years: action.data,
                isLoading:false
            }
        case GET_YEAR_VALUE_CAR:
            return {
                ...state,
                yearValue: action.data,
                isLoading:false
            }
        case SAVE_NOTIFICATION:
            return {
                ...state,
                notificaciones:action.data?.data,
                count:action.data?.count
            }
        default:
            return state
    }
}