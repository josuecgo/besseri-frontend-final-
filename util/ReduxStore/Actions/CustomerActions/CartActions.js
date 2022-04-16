export const ADD_ITEM_TO_CART = 'ADD_ITEM_TO_CART';
export const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
export const DECRASE_QUANTITY = 'DECRASE_QUANTITY';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const RESET_CART = 'RESET_CART';

export const addItemToCart = (item) => {
    
    return({
        type:ADD_ITEM_TO_CART,
        data:item,
        _id:item?._id
    })
}

export const removeItemFromCart = (item) => {
    return({
        type:REMOVE_ITEM,
        data:item,
        _id:item?._id
    })
}

export const increaseQuantity = (productId,price) => {
    return({
        type:INCREASE_QUANTITY,
        data:productId,
        price:price
    })
}

export const decreaseQuantity = (productId,price) => {
    return({
        type:DECRASE_QUANTITY,
        data:productId,
        price:price
    })
}

export const resetCart = () => {
    return({
        type:RESET_CART
    })
}

export const deleteItemFromCart = (productId,price) => {
    return({
        type:DELETE_ITEM,
        data:productId,
        price:price,
    })
}