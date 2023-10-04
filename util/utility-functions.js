import moment from "moment";

export const getFormattedDate = () => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dateObj = new Date();
  const month = monthNames[dateObj.getMonth()];
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  return month + ' ' + day + ',' + year;
};


export const matchMaker = (productos,valueMaker,valueYear) => {

  let itemData;
  
  let marca = productos.filter((item) => {

    itemData = item.maker ? item?.maker?._id : '';

    let searchTextData = valueMaker;
   
    let all = itemData === '639cb2cacd30bfa4463f12a7' ? true : false;
    // let match = matchesForModel(searchTextData2,item,valueYear);
  
    return itemData.indexOf(searchTextData) > -1 || all ;
  })

  return marca;
}

export const matchModel = (productos,valueMaker,valueModel,valueYear) => {

  
  let itemData;
  let itemModel;
 
  const marca = productos.filter((item) => {
    itemData = item.maker ? item?.maker?._id : '';

    let searchTextData = valueMaker;
    let searchTextData2 = valueModel;
    
    let all = itemData === '639cb2cacd30bfa4463f12a7' ? true : false;
    
   
    let match = matchesForModel(searchTextData2,item,valueYear);
    
    return itemData.indexOf(searchTextData) > -1 || match || all ;
})

  const modelo = marca.filter((item) => {
    itemModel = item.model ? item?.model?._id : '';
    let searchTextData = valueModel;
    let allModel = itemModel === '639cb2dbcd30bfa4463f12af' ? true : false;
    let match = matchesForModel(searchTextData,item,valueYear);
    
    return itemModel.indexOf(searchTextData) > -1 || match || allModel ;
})

  return modelo;
}

export const matchYear = (filtrado,valueModel = '',valueYear) => {
  let match = filtrado.filter((item) => {
    let all = item.maker._id === '639cb2cacd30bfa4463f12a7' ? true : false;    
    let allModel = item.model._id === '639cb2dbcd30bfa4463f12af' ? true : false;

    let compatible = item?.matchs.find(element =>  {
        // //console.log(element?.model._id);
        // //console.log({modell:valueModel});
        let model = valueModel ? element?.model._id === valueModel : ""

        let result = betweenNumber(element?.de,element?.al,valueYear)

        // //console.log(result,'result');
        // //console.log(model,'model');
        if (result && model ) {
            return element
        }else{
            return false
        }
    });
    
    let value = valueModel === item.model._id && betweenNumber(item?.aplicacion?.de,item?.aplicacion?.al,valueYear)

    if (value || compatible || all || allModel) {
    
      return item
    }

  })

  return match;
}


const  betweenNumber = (startingNumber, endingNumber, givenNumber) => {

  if(givenNumber >= startingNumber && givenNumber <= endingNumber){
      // //console.log(`número dado ${givenNumber} cae entre ${startingNumber} y ${endingNumber}`);
      return true
  }else{
    // //console.log(`número dado ${givenNumber} no cae entre ${startingNumber} y ${endingNumber}`);
      return false;
  }
}

const matchesForModel = (id,searchId) => {

  if (searchId?.matchs.length > 0) {
      
      const match = searchId?.matchs.filter(element => element?.model?._id === id);
      
      

      if (match.length > 0) {
          
          return searchId;
      }else{
          return false;
      }

  }
  return false;
  
}

export const dateToHour = (date) => {
  
 
const d = moment(date).add(1,'hour')


return d.format('HH:mm');
  // const d = moment(date)

  // return d.format("HH:mm:ss");
}

export const numberToKm = (number) => {
  if(!number){
    return 0
  }
  const formattedNumber = number.toLocaleString('en-US', { style: 'decimal' });


  return formattedNumber
}
