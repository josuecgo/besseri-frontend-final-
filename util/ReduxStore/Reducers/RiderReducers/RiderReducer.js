import { RELOAD_EARNINGS, SET_RIDER_EARNINGS, SET_WALLET_DETAILS } from "../../Actions/RiderActions/RiderActions"


const initialState = {
    actionMessage:{},
    earnings:{},
    wallet:null,
    reloadEarnings:false
}
export default (state = initialState,action) => {
    switch(action.type) {
        case SET_RIDER_EARNINGS:
            return {
                ...state,
                earnings:action.data

            }    
        case RELOAD_EARNINGS:
            return {
                ...state,
                reloadEarnings:!state.actionMessage.reloadEarnings
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