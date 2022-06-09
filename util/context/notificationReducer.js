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
        
        default:
            return state;
    }
};
