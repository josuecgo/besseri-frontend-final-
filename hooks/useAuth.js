

import { useContext, useState } from 'react';
import { logout } from '../util/local-storage/auth_service';
import { NotificationContext } from '../util/context/NotificationContext';
import { deleteToUser } from '../util/ReduxStore/Actions/CustomerActions/UserInfoActions';
import { resetOrdersUser } from '../util/ReduxStore/Actions/CustomerActions/PedidosAction';
import { Platform } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { showToaster } from '../util/constants';
import { resetCart } from '../util/ReduxStore/Actions/CustomerActions/CartActions';
import { useDispatch } from 'react-redux';

export const useAuth = () => {
    const dispatch = useDispatch()
    const {deleteNotificaciones} = useContext(NotificationContext)

    const logoutOff = async (navigation) => {
        try {
            await logout()
            await deleteNotificaciones()
            dispatch(deleteToUser())
            dispatch(resetOrdersUser())
            dispatch(resetCart())
            if (Platform.OS === 'ios') {
                PushNotificationIOS.setApplicationIconBadgeNumber(0);
            }
            navigation.replace('Splash', { logout: true });
        } catch (error) {
            console.log(error,'logout');
            
            showToaster('Ocurrió un error.')
        }
    }

    return {
        logoutOff
    }

}