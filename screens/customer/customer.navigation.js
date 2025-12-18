import React, { useContext, useEffect } from 'react';
import { CUSTOMER_HOME_SCREEN_ROUTES, LOGIN_SIGNUP_FORGOT_ROUTES } from '../../util/constants';
import { createStackNavigator } from '@react-navigation/stack';
import CustomerHomeViewScreen from './customer.home-view.screen';
import CustomerProductsViewScreen from './customer.products-view.screen';
import CustomerServicesViewScreen from './customer.services-view.screen';
import CustomHeaderComponent from '../../components/customer-components/custom-header.component';


import CustomerMapStores from './customer.mapstores.screen';
import CustomerMoreProductsScreen from './customer.moreProducts.screen';
import CustomerStoreScreen from './customer.store.screen';

import CustomerServiceBook from './customer.servicebook.screen';

import CustomerProductDetailScreen from './customer.productdetail.screen';
import LoginScreen from '../login.screen';
import SignUpScreen from '../sign-up.screen';
import SignUpScreenCustomer from '../sign-up.screen-customer';
import { SearchScreen } from './SearchScreen';
import { CustomerNotificationViewScreen } from './customer.notificaciones';

import { ProfileScreen } from './ProfileScreen';

import { ProductContext } from '../../util/context/Product/ProductContext';

import { PrivateScreen } from '../Chat/PrivateScreen';

import CustomerOrderDetail from './Orders/customer.orderdetail.screen';


import { SearchAddressScreen } from './Address/SearchAddressScreen';

import { ServiciosScreen } from './Home/ServiciosScreen';
import { MapServiceScreen } from './Home/MapServiceScreen';
import { BookingScreen } from './Bookings/BookingScreen';
import { BookingDetailsScreen } from './Bookings/BookingDetailsScreen';
import { CreateCarScreen } from './Garage/customer.createCar.screen';
import { HeaderTitle } from '../../components/Customer/HeaderTitle';


const Stack = createStackNavigator();

export const PartsServicesFunctionsDrawer = () => {


  const {
    comision, getMarcas, getModelo,
    valueMaker, getComision
  } = useContext(ProductContext)



  useEffect(() => {
    const fetchComision = async () => {
      if (!comision) {
        await getComision();
      }
    };
  
    let abortController = new AbortController();
  
    fetchComision();
  
    return () => {
      abortController.abort();  // Esta línea está bien
    };
  }, [comision]);
  


  useEffect(() => {
    const fetchMarcas = async () => {
      await getMarcas();
    };
  
    let abortController = new AbortController();
  
    fetchMarcas();
  
    return () => {
      abortController.abort();
    };
  }, []);
  


  useEffect(() => {
    const fetchModelo = async () => {
      if (valueMaker) {
        await getModelo(valueMaker);
      }
    };
  
    let abortController = new AbortController();
  
    fetchModelo();
  
    return () => {
      abortController.abort();
    };
  }, [valueMaker]);
  


  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={'AddAddress'}
        component={SearchAddressScreen}


      />
      <Stack.Screen
        name={'AddMyCar'}
        component={CreateCarScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props}
              titulo="Mi Auto"
              nav={props.navigation.goBack}
            />
          ),
        }}
      />

    </Stack.Navigator>

  );
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
    // initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.HOME}
    >


      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SHOW_REFACCIONES}
        component={CustomerProductsViewScreen}
        options={{
          headerShown: true,
          header: props => (
            <CustomHeaderComponent {...props} name="Home" />
          ),
        }}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SERVICIO}
        component={ServiciosScreen}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.MAP_SERVICES}
        component={MapServiceScreen}
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



export const BookingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.HOME}
    >
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.APPOINTMENTS}
        component={BookingScreen}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.BOOKING_DETAIL}
        component={BookingDetailsScreen}
      />
    </Stack.Navigator>
  );
};
