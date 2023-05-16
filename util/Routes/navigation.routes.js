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
        name={MAIN_ROUTES.CHATSCREEN}
        component={ChatStack}
      />
      
       
  
        <Stack.Screen
      name={LOGIN_SIGNUP_FORGOT_ROUTES.PRIVACY_POLICY}
      component={PrivacyPolicy}
      />
    </Stack.Navigator>
  );
};
