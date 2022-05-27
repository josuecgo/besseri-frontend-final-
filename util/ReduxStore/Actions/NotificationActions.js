export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const types = {
    new_notification: 'NEW NOTIFICATION'
}

export const getNotification = ({titulo,products})=> {
    return {
        type:types.new_notification,
        payload:{
            titulo,
            products
        }
    }
}

export const addNotification = (item) => {
    
    return({
        type:ADD_NOTIFICATION,
        data:item,
        _id:item?._id,
        isView:false
    })
}