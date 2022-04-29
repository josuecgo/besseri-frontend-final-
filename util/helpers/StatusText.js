import { useState } from "react";
import { CREDENTIAL_KEYS, SCREEN_TYPES } from "../../screens/vendor/vendor-addservice.screen";
import { SCREEN_TYPES as ProductScreen, CREDENTIAL_KEYS as KEYS_PRODUCT } from '../../screens/vendor/vendor.addproduct.screen'
import { LOGIN_SIGNUP_FORGOT_ROUTES } from "../constants";
export const TranslateStatus = (value) => {
    // [ORDER_STATUSES.PENDING]: '#0bda51',
    // [ORDER_STATUSES.PROCESSING]: '#007bff',
    // [ORDER_STATUSES.PACKED]: '#6c757d',
    // [ORDER_STATUSES.CANCELLED]: '#dc3545',
    // [ORDER_STATUSES.COMPLETED]: 'green',
    // [ORDER_STATUSES.ON_GOING]:'orange',
    // [ORDER_STATUSES.PARCEL_DELIVERED]:'green'

    
    let texto;
        switch (value) {
            case 'PARCEL DELIVERED':
                return text = 'PAQUETE ENTREGADO';
            case 'PARCEL_DELIVERED':
                return text = 'ENTREGADO';
            case 'PACKED':
                return text = 'EMPACADO';
            case 'ON_GOING':
                return texto = 'En Curso';
            case 'PENDING':
                return texto = 'Pendiente';
            case 'CANCELLED':
                return texto = 'Cancelado';
            case 'COMPLETED':
                return texto = 'Terminado';
            case 'PROCESSING':
                return texto = 'PROCESANDO';
            case 'ORDER_ONGOING':
                return texto = 'PEDIDO EN CURSO';   
            case 'COMPLETION_REQUEST_PENDING':
                 return texto = 'SOLICITUD DE FINALIZACIÓN PENDIENTE';
                 
            default:
                return texto = 'Sin datos';
        }    
        
}

export const screenFocus = (value) => {
   

    
    switch (value) {
        case SCREEN_TYPES.SERVICE_NAME:
            console.log('lo lee');
            return CREDENTIAL_KEYS.NAME
           
        case SCREEN_TYPES.SERVICE_DESCRIPTION:
            return CREDENTIAL_KEYS.DESCRIPTION;
            
        case SCREEN_TYPES.CHOOSE_MAKER:
            return CREDENTIAL_KEYS.PRODUCT_MAKER;
            
        case SCREEN_TYPES.CHOOSE_MODEL:
            return CREDENTIAL_KEYS.PRODUCT_MODEL;
          
        case SCREEN_TYPES.SERVICE_PRICE:
            return CREDENTIAL_KEYS.PRICE;
           
        case SCREEN_TYPES.CHOOSE_CATEGORY:
            return CREDENTIAL_KEYS.PRODUCT_CATEGORY;
            
        case SCREEN_TYPES.UPLOAD_IMAGE:
            console.log('foto');
            break;
        default:
            console.log('estas en nombre');
            break;
    }

}
export const screenFocusProduct = (value) => {
   

    
    switch (value) {
        case ProductScreen.PRODUCT_NAME:
            
            return KEYS_PRODUCT.NAME
           
        case ProductScreen.PRODUCT_DESCRIPTION:
            return KEYS_PRODUCT.DESCRIPTION;
            
        case ProductScreen.PRODUCT_PRICE:
            return KEYS_PRODUCT.PRICE;
            
        case ProductScreen.CHOOSE_MAKER:
            return KEYS_PRODUCT.PRODUCT_MAKER;
          
        case ProductScreen.CHOOSE_MODEL:
            return KEYS_PRODUCT.PRODUCT_MODEL;
        
        case ProductScreen.CHOOSE_CATEGORY:
            return KEYS_PRODUCT.PRODUCT_CATEGORY;
           
        case ProductScreen.CHOOSE_SUB_CATEGORY:
            return KEYS_PRODUCT.PRODUCT_CATEGORY;
        case ProductScreen.PRODUCT_BRAND:
            return KEYS_PRODUCT.PRODUCT_BRAND;

        case ProductScreen.PRODUCT_CONDITION:
            return KEYS_PRODUCT.PRODUCT_CONDITION;

        default:
            
            break;
    }

}

export const stringIsEmpty  = (v) => {
    
    if (v.name) {
        if (v.name.length > 0) {
    
            return true;
        }else{
            
            return false;
        }
    }
    
    if (v.length > 0) {
    
        return true;
    }else{
        
        return false;
    }
}