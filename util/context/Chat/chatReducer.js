

// const initialState = {
//     uid: '',
//     chatActivo: null, // UID del usuario al que yo quiero enviar mensajes
//     usuarios: [], // Todos los usuarios de la base datos
//     mensajes: [], // El chat seleccionado
// }

export const chatReducer = ( state, action ) => {


    switch ( action.type ) {
        
        case 'userActive':
            return {
                ...state,
                uid: action.payload 
            }
        
        case 'activarChat':
            if ( state.chatActivo === action.payload ) return state;

            return {
                ...state,
                chatActivo: action.payload,
                mensajes: []
            }


        case 'nuevoMensaje':
            if ( state.chatActivo === action.payload.de || 
                 state.chatActivo === action.payload.para   
            ) {
                return {
                    ...state,
                    mensajes: [ ...state.mensajes, action.payload ]
                }
            } else {
                return state;
            }

        case 'cargarMensajes':
            return {
                ...state,
                mensajes: [ ...action.payload ]
            }
        case 'enviando':
            return {
                ...state,
                sending: action.payload 
            }
        case 'chats':
            return {
                ...state,
                chats: action.payload 
            }
        default:
            return state;
    }

}

