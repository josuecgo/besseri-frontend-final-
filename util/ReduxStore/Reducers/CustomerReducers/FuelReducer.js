import moment from "moment"
import { ADD_DRIVER, ADD_FUEL, ADD_KM_RECORRIDO, GET_ALL_DRIVERS, GET_ALL_FUEL_CONSUMPTION } from "../../Actions/CustomerActions/FuelActions"



const initialState = {
    drivers:[],
    consumption:[],
    kmPerByDay:null,
    totalKmTraveled:null,
    daysPassed:null,
    fuelTotal:null,
    amountTotal:null
    
}
export default (state = initialState, action) => {
   
    switch (action.type) {
        
        case ADD_DRIVER:
        const updateDrivers = [...state.drivers,action.data]
        return {
            ...state,
            drivers: updateDrivers,
            
        }
      
        case GET_ALL_DRIVERS:
           
            return {
                ...state,
                drivers: action.data,
            } 
        case ADD_FUEL:
                const updateFuel = [...state.consumption,action.data]
            return {
                    ...state,
                    consumption: updateFuel,
                    
            }
        case GET_ALL_FUEL_CONSUMPTION:
            return {
                ...state,
                consumption: action.data,
              
            } 
        case ADD_KM_RECORRIDO:
            
            return {
                ...state,
                // kmPerByDay:action.data?.kmPerByDay,
                // totalKmTraveled:action.data?.totalKmTraveled,
                // daysPassed:action.data?.daysPassed
                ...action.data
            }
       
        default:
            return state
    }
}