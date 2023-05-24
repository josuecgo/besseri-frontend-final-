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
        case 'activeCar' : 
        return {
            ...state,
            carActive: action.payload.car,
            
        }
        case 'getCategorias' : 
        return {
            ...state,
            categorias:action.payload.categorias,
            activeCategory:action.payload.active,
        }
        case 'activeCategoria' : 
        return {
            ...state,
            activeCategory:action.payload.active,
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
        case 'getStore':
           
            return {
                ...state,
                store:action.payload.store
            }
        case 'productStore' : 
            return {
                ...state,
                errorMessage:'',
                productosStore: action.payload.productos,
                // categorias:action.payload.categorias
            }
        case 'filterProductsStore' : 
            return {
                ...state,
                errorMessage:'',
                productFiltradoStore: action.payload.productFiltradoStore,
                
            }
        default:
            return state;
    }
};