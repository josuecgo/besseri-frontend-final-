// Main stack
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { LSFS } from '../../screens/login.navigation';
import { VendorNavigation } from '../../screens/vendor/vendor.navigation';
import { AutoPartsAndServices, PartsServicesFunctionsDrawer } from '../../screens/customer/customer.navigation';
import Splash from '../../screens/splash.screen';
import VendorAddProductScreen from '../../screens/vendor/vendor.addproduct.screen';
import { CUSTOMER_HOME_SCREEN_ROUTES, LOGIN_SIGNUP_FORGOT_ROUTES, MAIN_ROUTES, SHARED_ROUTES, VENDOR_DETAILS_ROUTES } from '../constants';
import VendorAddServiceScreen from '../../screens/vendor/vendor-addservice.screen';
import ShareServiceDetail from '../../screens/servicedetail.sharescreen';
import { RiderNavigation } from '../../screens/rider/rider.navigation';
import PrivacyPolicy from '../../screens/privacypolicy.screen';
import { ChatStack } from './ChatStack';
import { UpdateScreen } from '../../screens/UpdateScreen';
import { BottomTabHome } from '../../screens/customer/navigation/BottomTabHome';
import { AppointmentScreen } from '../../screens/customer/Home/AppointmentScreen';
import { HeaderTitle } from '../../components/Customer/HeaderTitle';
import { ServiceDetailsScreen } from '../../screens/customer/Home/ServiceDetailsScreen';
import { AgendarScreen } from '../../screens/customer/Home/AgendarScreen';
import { DetalleScreen } from '../../screens/customer/Account/DetalleScreen';
import { SeguimientoScreen } from '../../screens/customer/Account/SeguimientoScreen';
import CustomerCartScreen from '../../screens/customer/customer.cartscreen';
import { EnvioScreen } from '../../screens/customer/customer.envio.screen';
import { MetodoScreen } from '../../screens/customer/customer.metodoscreen';
import CustomerOrderSummaryFree from '../../screens/customer/customer.orderSummaryFree.screen';
import { OrderSuccessful } from '../../screens/customer/customer.order-successful';
import HeaderStore from '../../components/Customer/HeaderStore';
import { CartScreen } from '../../screens/customer/Store/CartScreen';
import PaymentScreen, { PayScreen } from '../../screens/customer/Store/PayScreen';
import { OrderSummary } from '../../screens/customer/Store/OrderSummary';
import CustomerOrderSummary from '../../screens/customer/customer.ordersummary.screen';
import { ChecksStack } from './ChecksStack';

const Stack = createStackNavigator();

export const MainNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
      name={'Splash'}
      component={Splash}
      />
      <Stack.Screen
        name={'AuthStack'}
        component={LSFS}
      />
      <Stack.Screen
        name={'UpdateScreen'}
        component={UpdateScreen}
      />

      <Stack.Screen
        name={'CustomerStack'}
        component={PartsServicesFunctionsDrawer}
      />
      <Stack.Screen
        name={'CustomerHomeStack'}
        component={BottomTabHome}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.DETAILS_SERVICES}
        component={ServiceDetailsScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props} 
            titulo="Detalles de servicio" 
            nav={props.navigation.goBack}
            />
          ),
        }}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.APPOINTMENT_SERVICES}
        component={AppointmentScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props} 
            titulo="Servicios" 
            nav={props.navigation.goBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.AGENDAR}
        component={AgendarScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props} 
            titulo="Agendar" 
            nav={props.navigation.goBack}
            />
          ),
        }}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.PAYMENT}
        component={PaymentScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props} 
            titulo="Pagar" 
            nav={props.navigation.goBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.DETALLE}
        component={DetalleScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props} 
            titulo="Detalle" 
            nav={props.navigation.goBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SEGUIMIENTO}
        component={SeguimientoScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props} 
            titulo="Seguimiento" 
            nav={props.navigation.goBack}
            />
          ),
        }}
      />
      
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ORDER_STACK}
        component={CartScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderStore {...props} 
            titulo="Resumen de pago" 
            nav={props.navigation.goBack}
            tienda={true}
            />
          ),
        }}
        
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.PAGO}
        // component={OrderSummary}
        component={CustomerOrderSummary}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props} 
            titulo="Pago" 
            nav={props.navigation.goBack}
            tienda={false}
            />
          ),
        }}
        
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.PAGO_COMPLETED}
        component={OrderSuccessful}
      />
      <Stack.Screen
        name={MAIN_ROUTES.CHATSCREEN}
        component={ChatStack}
      />


      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.CHECK_STACK}
        component={ChecksStack}
      />  
      
       
  
        <Stack.Screen
      name={LOGIN_SIGNUP_FORGOT_ROUTES.PRIVACY_POLICY}
      component={PrivacyPolicy}
      />
    </Stack.Navigator>
  );
};


const OrderStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.HOME}
    >
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.CART}
        component={CartScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderStore {...props} 
            titulo="Resumen de pago" 
            nav={props.navigation.goBack}
            tienda={true}
            />
          ),
        }}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.PAGO}
        component={PayScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderStore {...props} 
            titulo="PAGO" 
            nav={props.navigation.goBack}
            tienda={false}
            />
          ),
        }}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.METODO}
        component={MetodoScreen}
      />
      {/* <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ORDER_SUMMARY}
        component={CustomerOrderSummaryScreen}
      /> */}
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