// Main stack
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { LSFS } from '../../screens/login.navigation';
import { VendorNavigation } from '../../screens/vendor/vendor.navigation';
import { AutoPartsAndServices, PartsServicesFunctionsDrawer } from '../../screens/customer/customer.navigation';
import Splash from '../../screens/splash.screen';
import VendorAddProductScreen from '../../screens/vendor/vendor.addproduct.screen';
import { LOGIN_SIGNUP_FORGOT_ROUTES, MAIN_ROUTES, SHARED_ROUTES, VENDOR_DETAILS_ROUTES } from '../constants';
import VendorAddServiceScreen from '../../screens/vendor/vendor-addservice.screen';
import ShareServiceDetail from '../../screens/servicedetail.sharescreen';
import { RiderNavigation } from '../../screens/rider/rider.navigation';
import PrivacyPolicy from '../../screens/privacypolicy.screen';
import { ChatStack } from './ChatStack';
import { UpdateScreen } from '../../screens/UpdateScreen';

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
        name={'VendorStack'}
        component={VendorNavigation}
      />
      <Stack.Screen
        name={'CustomerStack'}
        component={PartsServicesFunctionsDrawer}
      />
      <Stack.Screen
        name={'RiderStack'}
        component={RiderNavigation}
      />
       <Stack.Screen
        name={MAIN_ROUTES.CHATSCREEN}
        component={ChatStack}
      />
      <Stack.Screen
      name={VENDOR_DETAILS_ROUTES.CREATE_PRODUCT}
      component={VendorAddProductScreen}
      />
        <Stack.Screen
      name={VENDOR_DETAILS_ROUTES.CREATE_SERVICE}
      component={VendorAddServiceScreen}
      />
      <Stack.Screen
      name={SHARED_ROUTES.SERVICE_DETAIL}
      component={ShareServiceDetail}
      />
        <Stack.Screen
      name={LOGIN_SIGNUP_FORGOT_ROUTES.PRIVACY_POLICY}
      component={PrivacyPolicy}
      />
    </Stack.Navigator>
  );
};
