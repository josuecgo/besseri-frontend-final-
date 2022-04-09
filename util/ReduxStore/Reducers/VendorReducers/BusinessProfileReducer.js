import { SET_BUSINESS_ACTION_MESSAGE, SET_BUSINESS_EARNINGS, SET_WALLET_DETAILS } from "../../Actions/VendorActions/BusinessProfleActions"

const initialState = {
    actionMessage:{},
    earnings:{},
    wallet:null
}
export default (state = initialState,action) => {
    switch(action.type) {
        case SET_BUSINESS_ACTION_MESSAGE:
            return {
                ...state,
                actionMessage:action.data
            }
        case SET_BUSINESS_EARNINGS:
            return {
                ...state,
                earnings:action.data

            }    
        case SET_WALLET_DETAILS:
            return {
                ...state,
                wallet:action.data
            }    
        default:
            return state    
    }
}