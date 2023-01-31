import React, { useContext, useEffect } from 'react';
import { CUSTOMER_HOME_SCREEN_ROUTES, LOGIN_SIGNUP_FORGOT_ROUTES, MAIN_ROUTES } from '../../util/constants';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomerHomeViewScreen from './customer.home-view.screen';
import CustomerProductsViewScreen from './customer.products-view.screen';
import CustomerServicesViewScreen from './customer.services-view.screen';
import CustomHeaderComponent from '../../components/customer-components/custom-header.component';
import CustomDrawerComponent from '../../components/customer-components/custom-drawer.component';

import CustomerCartScreen from '../customer/customer.cartscreen';
import CustomerOrderSummaryScreen from '../customer/customer.ordersummary.screen';
import CustomerMapStores from './customer.mapstores.screen';
import CustomerAddressesScreen from './customer.addresses.screen';
import CustomerMoreProductsScreen from './customer.moreProducts.screen';
import CustomerStoreScreen from './customer.store.screen';
import CustomerAppointments from './customer.bookings.screen';
import CustomerServiceBook from './customer.servicebook.screen';
import CustomerBookingDetail from './customer.bookingDetail.screen';

import CustomerProductDetailScreen from './customer.productdetail.screen';

import LoginScreen from '../login.screen';
import SignUpScreen from '../sign-up.screen';
import SignUpScreenCustomer from '../sign-up.screen-customer';
import { OrderSuccessful } from './customer.order-successful';
import { SearchScreen } from './SearchScreen';
import { CustomerNotificationViewScreen } from './customer.notificaciones';
import { NotificationContext } from '../../util/context/NotificationContext';
import { EnvioScreen } from './customer.envio.screen';
import CustomerOrderSummaryFree from './customer.orderSummaryFree.screen';
import { MetodoScreen } from './customer.metodoscreen';
import { CustomerCardsScreen } from './customer.cards.screen';
import { CreateCardScreen } from './customer.createCard.screen';
import PrivacyPolicy from '../privacypolicy.screen';
import { CartScreen } from './Cart/CartScreen';
import { ChatScreen } from './Chat/ChatScreen';
import { ProfileScreen } from './ProfileScreen';
import { Platform } from 'react-native';
import { ProductContext } from '../../util/context/Product/ProductContext';
import { GarageScreen } from './Garage/customer.garage.screen';
import { ListChatsScreen } from './Chat/ListChatsScreen';
import { ChatStack } from '../../util/Routes/ChatStack';
import { PrivateScreen } from '../Chat/PrivateScreen';
import CustomerOrdersViewScreen from './Orders/customer.orders-view.screen';
import { CustomerOrdersAllScreen } from './Orders/customer.orders.all.screen';
import { CustomerOrdersPending } from './Orders/customer.orders.pending.screen';
import CustomerOrderDetail from './Orders/customer.orderdetail.screen';
import { CustomerOrdersSending } from './Orders/customer.orders.sending';
import { CustomerOrdersDelivered } from './Orders/customer.orders.delivered';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const PartsServicesFunctionsDrawer = () => {
  const { 
    countCustomer, 
    getNotificaciones, 
    iosPermisoss,
    getToken,
    deleteNotificaciones
  } = useContext(NotificationContext);

  const {getCategorias, getProducts, 
    comision, getMarcas, getServices, getModelo, 
    valueMaker,getComision 
  } = useContext(ProductContext)







  useEffect(() => {
    if (Platform.OS === 'ios') {
      iosPermisoss();
    }
    getToken();
  }, [])

  useEffect(async () => {
    let abortController = new AbortController();
    
    if (!comision) {
      getComision()
    }

    return () => {
      abortController.abort();
    }
  }, [comision])

  useEffect(() => {
    let abortController = new AbortController();
    getCategorias()
    return () => {
      // abortController.abort();  
      abortController.abort();
    }
  }, [])

  useEffect(async () => {
    
    let abortController = new AbortController();
    getProducts()
    return () => {
      abortController.abort();
    }
  }, [])



  // useEffect(async () => {
  //   let abortController = new AbortController();
  //   getServices();
  //   return () => {
  //     abortController.abort();
  //   }
  // }, [])


  useEffect(async () => {


    let abortController = new AbortController();
    getMarcas();
    return () => {
      abortController.abort();
    }


  }, [])


  useEffect(async () => {
    let abortController = new AbortController();
    if (valueMaker) {
      getModelo(valueMaker);
    }
    return () => {
      abortController.abort();
    }
  }, [valueMaker])


  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerComponent 
        {...props} 
        countCustomer={countCustomer} 
        getNotificaciones={getNotificaciones} 
        deleteNotificaciones={deleteNotificaciones}
        />}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.HOME}
      screenOptions={{
        headerShown: false,
      }}>

      <Drawer.Screen
        name={'Autopartes'}
        component={CustomerHomeStack}
      />
     
      <Drawer.Screen
        name={'Notificaciones'}
        component={CustomerNotificationStack}
      />
      <Drawer.Screen
        name={MAIN_ROUTES.CHATSCREEN}
        component={ChatStack}
      />

      <Drawer.Screen
        name={'Garage'}
        component={GarageScreen}
      />

      <Drawer.Screen
        name={'Mi dirección'}
        component={CustomerAddressesScreen}
      />
      <Drawer.Screen
        name={'Pedidos'}
        component={OrdersNavigator}

      />
      <Drawer.Screen
        name={'Reservaciones'}
        component={BookingsStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={'Términos y condiciones'}
        component={PrivacyPolicy}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={'Perfil'}
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />


    </Drawer.Navigator>
  );
}
const OrdersNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      
      <Stack.Screen name={CUSTOMER_HOME_SCREEN_ROUTES.ORDERS} component={CustomerOrdersViewScreen} />
      <Stack.Screen name={CUSTOMER_HOME_SCREEN_ROUTES.ORDERS_ALL} component={CustomerOrdersAllScreen} />
      <Stack.Screen name={CUSTOMER_HOME_SCREEN_ROUTES.ORDERS_PENDING} component={CustomerOrdersPending} />
      <Stack.Screen name={CUSTOMER_HOME_SCREEN_ROUTES.ORDERS_SENDING} component={CustomerOrdersSending} />
      <Stack.Screen name={CUSTOMER_HOME_SCREEN_ROUTES.ORDERS_DELIVERED} component={CustomerOrdersDelivered} />
     
      <Stack.Screen name={CUSTOMER_HOME_SCREEN_ROUTES.ORDER_DETAIL} component={CustomerOrderDetail} />
    </Stack.Navigator>
  )
}



const OrderStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.HOME}
    >
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.CART}
        component={CustomerCartScreen}
      // component={CartScreen}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ENVIO}
        component={EnvioScreen}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.METODO}
        component={MetodoScreen}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ORDER_SUMMARY}
        component={CustomerOrderSummaryScreen}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ORDER_SUMMARY_FREE}
        component={CustomerOrderSummaryFree}
      />
      <Stack.Screen
        name={'OrderSuccessful'}
        component={OrderSuccessful}
      />
    </Stack.Navigator>
  )
}

export const CustomerNotificationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={'NotificacionesHome'}
        component={CustomerNotificationViewScreen}
        options={{
          headerShown: true,
          header: props => (
            <CustomHeaderComponent {...props} name="Notificaciones" />
          ),
        }}
      />
      <Stack.Screen
        name={'OrdersHome'}
        component={CustomerHomeStack}

      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ORDER_DETAIL}
        component={CustomerOrderDetail}
      />

    </Stack.Navigator>
  );
};
export const CustomerHomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.HOME}>
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS}
        component={CustomerProductsViewScreen}
        options={{
          headerShown: true,
          header: props => (
            <CustomHeaderComponent {...props} name="Autopartes" />
          ),
        }}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK}
        component={OrderStack}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.MAP_STORES}
        component={CustomerMapStores}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ORDER_DETAIL}
        component={CustomerOrderDetail}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.MORE_PRODUCTS}
        component={CustomerMoreProductsScreen}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL}
        component={CustomerProductDetailScreen}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.STORE_SCREEN}
        component={CustomerStoreScreen}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.BOOK_SERVICE}
        component={CustomerServiceBook}
      />

      {/* <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SEARCH}
        component={CustomerSearchScreen}
      /> */}

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SEARCH}
        component={SearchScreen}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SERVICE}
        component={CustomerServicesViewScreen}
      />

      {/* <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.INICIAR}
        component={iniciar}
      /> */}
      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.LOGIN}
        component={LoginScreen}
      />

      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.SIGN_UP}
        component={SignUpScreen}
      />
      <Stack.Screen
        name={LOGIN_SIGNUP_FORGOT_ROUTES.SIGN_UP_CUSTOMER}
        component={SignUpScreenCustomer}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.CHAT_SCREEN}
        component={PrivateScreen}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.PERFIL}
        component={ProfileScreen}
      />
      {/* <Stack.Screen
        name={'LSFS'}
        component={LSFS}
      /> */}
    </Stack.Navigator>
  );
};


export const AutoPartsAndServices = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.HOME}>
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.HOME}
        component={CustomerHomeViewScreen}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.DRAWER}
        component={PartsServicesFunctionsDrawer}
      />
    </Stack.Navigator>
  );
};

const CustomerServicesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES?.SERVICE}
    >
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SERVICE}
        component={CustomerServicesViewScreen}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.BOOK_SERVICE}
        component={CustomerServiceBook}
      />
      <Stack.Screen />
    </Stack.Navigator>
  )
}

export const BookingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.HOME}>
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.APPOINTMENTS}
        component={CustomerAppointments}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.BOOKING_DETAIL}
        component={CustomerBookingDetail}
      />
    </Stack.Navigator>
  );
};
