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