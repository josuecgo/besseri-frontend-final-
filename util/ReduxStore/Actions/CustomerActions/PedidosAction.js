export const GET_PEDIDOS_USER = 'GET_PEDIDOS_USER';



export const getOrdersUser = (item) => {
   
  return({
      type:GET_PEDIDOS_USER,
      data:item,
     
  })
}