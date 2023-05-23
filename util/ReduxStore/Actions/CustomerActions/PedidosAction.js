export const GET_PEDIDOS_USER = 'GET_PEDIDOS_USER';
export const IS_LOADING_DATA = 'IS_LOADING_DATA';


export const getOrdersUser = (item) => {
   
  return({
      type:GET_PEDIDOS_USER,
      data:item,
     
  })
}

export const isLoadingOrdersUser = () => {
   
  return({
      type:IS_LOADING_DATA,
     
     
  })
}