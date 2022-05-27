export const notificationReducer = (state, action) => {


    switch (action.type) {
        case 'addNotification':
            return {
                ...state,
                notification: action.payload,
                view: false,
             
            };

        case 'removeNotification':
            return {
                ...state,
                view: true,
            };
      
        default:
            return state;
    }
};
