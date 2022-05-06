import React from 'react';
import {CUSTOMER_HOME_SCREEN_ROUTES, LOGIN_SIGNUP_FORGOT_ROUTES} from '../../util/constants';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomerHomeViewScreen from './customer.home-view.screen';
import CustomerProductsViewScreen from './customer.products-view.screen';
import CustomerServicesViewScreen from './customer.services-view.screen';
import CustomHeaderComponent from '../../components/customer-components/custom-header.component';
import CustomDrawerComponent from '../../components/customer-components/custom-drawer.component';
import CustomerAppointmentsViewScreen from './customer.appointments-view.screen';
import CustomerOrdersViewScreen from './customer.orders-view.screen';
import CustomerCartScreen from '../customer/customer.cartscreen';
import CustomerOrderSummaryScreen from '../customer/customer.ordersummary.screen';
import CustomerMapStores from './customer.mapstores.screen';
import CustomerAddressesScreen from './customer.addresses.screen';
import CustomerOrderDetail from './customer.orderdetail.screen';
import CustomerMoreProductsScreen from './customer.moreProducts.screen';
import CustomerStoreScreen from './customer.store.screen';
import CustomerAppointments from './customer.bookings.screen';
import CustomerServiceBook from './customer.servicebook.screen';
import CustomerBookingDetail from './customer.bookingDetail.screen';
import CustomerSearchScreen from './customer.search.screen';
import CustomerProductDetailScreen from './customer.productdetail.screen';
import { iniciar } from './customer.iniciar.screen';
import LoginScreen from '../login.screen';
import SignUpScreen from '../sign-up.screen';
import SignUpScreenCustomer from '../sign-up.screen-customer';
import { OrderSuccessful } from './customer.order-successful';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const PartsServicesFunctionsDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerComponent {...props} />}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.HOME}
      screenOptions={{headerShown: false}}>
      {/* <Drawer.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SERVICE}
        component={CustomerServicesViewScreen}
        options={{
          headerShown: true,
          header: props => <CustomHeaderComponent {...props} name="Service" />,
        }}
      /> */}
      <Drawer.Screen
        name={'Autopartes'}
        component={CustomerHomeStack}
      />
        <Drawer.Screen
        name={'Servicios'}
        component={CustomerServicesViewScreen}
        options={{
          headerShown: true,
          header: props => (
            <CustomHeaderComponent {...props} name="Servicios" isService={true} showSearch={true} />
          ),
        }}
      />
       <Drawer.Screen
        name={'Mi dirección'}
        component={CustomerAddressesScreen}
      />
      <Drawer.Screen
        name={'Pedidos'}
        component={OrdersNavigator}
        // options={{
        //   headerShown: true,
        //   header: props => (
        //     <CustomHeaderComponent {...props} name="My Orders" />
        //   ),
        // }}
      />
      <Drawer.Screen
        name={'Reservaciones'}
        component={BookingsStack}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};
const OrdersNavigator = () => {
  return (
    <Stack.Navigator
    screenOptions={{headerShown: false}}
    >
      <Stack.Screen name={CUSTOMER_HOME_SCREEN_ROUTES.ORDERS} component={CustomerOrdersViewScreen}/>
      <Stack.Screen name={CUSTOMER_HOME_SCREEN_ROUTES.ORDER_DETAIL} component={CustomerOrderDetail}/>
    </Stack.Navigator>
  )
}

const OrderStack = () => {
  return (
    <Stack.Navigator
    screenOptions={{headerShown: false}}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.HOME}
    >
       <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.CART}
        component={CustomerCartScreen}
      />
       <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ORDER_SUMMARY}
        component={CustomerOrderSummaryScreen}
      />
    </Stack.Navigator>
  )
}
export const CustomerHomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
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
       <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SEARCH}
        component={CustomerSearchScreen}
      />
       <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SERVICE}
        component={CustomerServicesViewScreen}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.INICIAR}
        component={iniciar}
      />
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
        name={'OrderSuccessful'}
        component={OrderSuccessful}
      />
    </Stack.Navigator>
  );
};


export const AutoPartsAndServices = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
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
    <Stack.Navigator screenOptions={{headerShown:false}}
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
      <Stack.Screen/>
    </Stack.Navigator>
  )
}

export const BookingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
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
