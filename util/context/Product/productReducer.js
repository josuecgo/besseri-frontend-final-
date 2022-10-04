export const productReducer = (state, action) => {


    switch (action.type) {
        case 'getProductos' : 
        return {
            ...state,
            errorMessage:'',
            productos: action.payload.productos,
            // categorias:action.payload.categorias
        }
        case 'filterProducts' : 
        return {
            ...state,
            errorMessage:'',
            productFiltrado: action.payload.productos,
            
        }
        case 'getCategorias' : 
        return {
            ...state,
            categorias:action.payload.categorias
        }
        case 'getServicios' : 
        return {
            ...state,
            errorMessage:'',
            servicios: action.payload.servicios
        }
        case 'getComision':
            return {
                ...state,
                comision:action.payload.comision
            }
        case 'getMarcas':
            return {
                ...state,
                marcas:action.payload.marcas
            }
    
        default:
            return state;
    }
};