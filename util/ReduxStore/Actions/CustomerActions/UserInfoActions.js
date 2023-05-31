export const ADD_USER = 'ADD_USER';
export const ADD_ADDRESS = 'ADD_ADDRESS';
export const ADD_CAR_ACTIVE_TO_USER = 'ADD_CAR_ACTIVE_TO_USER';
export const ADD_CARS_TO_USER = 'ADD_CARS_TO_USER';
export const GET_MAKERS_CARS = 'GET_MAKERS_CARS';
export const GET_MODELS_CARS = 'GET_MODELS_CARS';
export const GET_MAKER_VALUE_CARS = 'GET_MAKER_VALUE_CARS';
export const GET_MODEL_VALUE_CARS = 'GET_MODEL_VALUE_CARS';
export const GET_YEARS_CARS = 'GET_YEARS_CARS';
export const GET_YEAR_VALUE_CAR = 'GET_YEAR_VALUE_CAR';
export const SAVE_NOTIFICATION = 'SAVE_NOTIFICATION';


export const addToUser = (item) => {
   
  return({
      type:ADD_USER,
      data:item,
     
  })
}


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

export const getMakersCars = (item) => {
    
  return({
      type:GET_MAKERS_CARS,
      data:item,
     
  })
}

export const getModelsCars = (item) => {
    
  return({
      type:GET_MODELS_CARS,
      data:item,
     
  })
}

export const getMakerValueCars = (item) => {
    
  return({
      type:GET_MAKER_VALUE_CARS,
      data:item,
     
  })
}

export const getModelValueCars = (item) => {
    
  return({
      type:GET_MODEL_VALUE_CARS,
      data:item,
     
  })
}

export const getYearsCars = (item) => {
    
  return({
      type:GET_YEARS_CARS,
      data:item,
     
  })
}

export const getYearValueCar = (item) => {
    
  return({
      type:GET_YEAR_VALUE_CAR,
      data:item,
     
  })
}

export const saveNotification = (item) => {
    
  return({
      type:SAVE_NOTIFICATION,
      data:item,
     
  })
}