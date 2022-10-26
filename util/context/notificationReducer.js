export const notificationReducer = (state, action) => {


    switch (action.type) {
        case 'getProductos' : 
            return {
                ...state,
                errorMessage:'',
                productos: action.payload.productos
            }
        case 'getServicios' : 
            return {
                ...state,
                errorMessage:'',
                servicios: action.payload.servicios
            }
        case 'getNotification' : 
            return {
                ...state,
                notificaciones:action.payload.notificaciones,
                countRider:action.payload.countRider,
                count:action.payload.count,
                countCustomer:action.payload.countCustomer,
            }
        
        default:
            return state;
    }
};
