
export const addImgs = (item) => {
    
  return({
      type:'UPLOAD',
      data:item,
      
  })
}


export const resetForm = (item) => {
    
  return({
      type:'RESET',
      
  })
}

