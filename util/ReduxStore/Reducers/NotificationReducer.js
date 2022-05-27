import { types } from "../Actions/NotificationActions";

export const notificationReducer = (state={}, action) => {
    
    switch (action.type) {
        case types.new_notification:
            
            return {
                titulo:action.payload.titulo,
                products:action.payload.products,
                isView: false
            }
    
        default:
            break;
    }
}