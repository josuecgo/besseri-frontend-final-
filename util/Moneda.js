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

export const formatNumberWithCommas = (number) => {
    
    if (number === null || isNaN(number)) {
        return ' '; // Si no es un número válido o es null, no retornamos nada
    }
   
    return `${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} km`;
}

export const aplicarDescuento = (precioOriginal, discount) => {
    if (discount >= 100) {
      return 0
    }
    if (discount === 0) {
      
      return precioOriginal
    }
    if (typeof discount !== 'number' || discount < 0 || discount > 100) {
        throw new Error('El descuento debe ser un número entre 0 y 100');
    }
    const descuentoAplicado = (precioOriginal * discount) / 100;
    const precioFinal = precioOriginal - descuentoAplicado;
    return precioFinal;
  }