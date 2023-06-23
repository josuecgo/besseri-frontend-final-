import moment from 'moment';


export const horaMes = ( fecha ) => {

    const hoyMes = moment( fecha );

    return hoyMes.format('HH:mm a | MMMM Do');

}

export const dateFeedback = ( fecha ) => {

    const hoyMes = moment( fecha );

    return hoyMes.format(' DD MMM YYYY');

}

export const fechaMensaje = ( fecha ) => {
    const now = moment()
    const hoyMes = moment( fecha );
    // //console.log(now);
    let diff = now.diff(hoyMes,'days');
   
    if (diff <= 0) {
        return hoyMes.format('HH:mm a');
    }

    if (diff <= 1) {
        return 'ayer';
    }

    return hoyMes.format('DD/MM/YY');
    

}