export const ADD_ADDRESS = 'ADD_ADDRESS';
export const ADD_CAR_ACTIVE_TO_USER = 'ADD_CAR_ACTIVE_TO_USER';
export const ADD_CARS_TO_USER = 'ADD_CARS_TO_USER'
export const addAddressToUser = (item) => {
    
  return({
      type:ADD_ADDRESS,
      data:item,
     
  })
}

export const addCarActiveToUser = (item) => {
    
  return({
      type:ADD_CAR_ACTIVE_TO_USER,
      data:item,
     
  })
}

export const addCarsToUser = (item) => {
    
  return({
      type:ADD_CARS_TO_USER,
      data:item,
     
  })
}
