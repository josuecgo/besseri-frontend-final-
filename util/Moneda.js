import 'intl';
import 'intl/locale-data/jsonp/en';



export const  moneda = (value) => {
    const formato = new Intl.NumberFormat('en-US' , {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits:2
    })

    return formato.format(value);

}

export const comisionMoneda = (price,comision) => {
   
    const valor = Number(price);
  
    const porcentaje = Number(comision) / 100;
    const resultado = valor * porcentaje;

    return moneda(resultado + valor)
}

export const comisionFormatted = (price,comision) => {
   
    const valor = Number(price);
  
    const porcentaje = Number(comision) / 100;
    const resultado = valor * porcentaje;

    return resultado + valor
}