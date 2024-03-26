export const ADD_DRIVER = 'ADD_DRIVER';

export const GET_ALL_DRIVERS = 'GET_ALL_DRIVERS';
export const GET_ALL_FUEL_CONSUMPTION = 'GET_ALL_FUEL_CONSUMPTION';
export const ADD_FUEL = 'ADD_FUEL';

export const addToDriver = (item) => {
   
  return({
      type:ADD_DRIVER,
      data:item,
     
  })
}






export const getAllDrivers = (item) => {
    
  return({
      type:GET_ALL_DRIVERS,
      data:item,
     
  })
}

export const getAllFuelConsumption = (item) => {
    
    return({
        type:GET_ALL_FUEL_CONSUMPTION,
        data:item,
       
    })
  }

  export const addToFuel = (item) => {
   
    return({
        type:ADD_FUEL,
        data:item,
       
    })
  }



