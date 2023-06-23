export const GET_PEDIDOS_USER = 'GET_PEDIDOS_USER';
export const IS_LOADING_DATA = 'IS_LOADING_DATA';
export const RESET_PEDIDOS_USER = 'RESET_PEDIDOS_USER'

export const getOrdersUser = (item) => {
   
  return({
      type:GET_PEDIDOS_USER,
      data:item,
     
  })
}

export const isLoadingOrdersUser = (item) => {
   
  return({
    type:IS_LOADING_DATA,
    data:item
     
  })
}

export const resetOrdersUser = (item) => {
   
  return({
    type:RESET_PEDIDOS_USER,
    data:item
     
  })
}