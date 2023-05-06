
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BOTTOM_TAB_CUSTOMER_ROUTES, CUSTOMER_HOME_SCREEN_ROUTES } from '../../../util/constants';
import CustomHeaderComponent from '../../../components/customer-components/custom-header.component';

import { HomeScreen } from '../Home/HomeScreen';
import Colors from '../../../util/styles/colors';
import { FooterNav } from '../../../components/Customer/FooterNav';
import { NotificationScreen } from '../Notifications/NotificationScreen';
import { AccountScreen } from '../Account/AccountScreen';
import { MyCarsScreen } from '../Account/MyCarsScreen';
import { HeaderTitle } from '../../../components/Customer/HeaderTitle';
import { PedidosScreen } from '../Account/PedidosScreen';


const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();


export const BottomTabHome = () => {
  return (
    <BottomTab.Navigator
      initialRouteName={BOTTOM_TAB_CUSTOMER_ROUTES.HOME_SCREEN}
      tabBar={props => <FooterNav {...props} />}
      
      screenOptions={ ({route}) => ({
        headerShown: false,
        tabBarShowLabel:false,
        tabBarActiveTintColor: Colors.primarySolid,
       
        
      })
      }

      
      >
      <BottomTab.Screen
        name={BOTTOM_TAB_CUSTOMER_ROUTES.HOME_SCREEN}
        component={CustomerHomeStack}
        options={{
          title:'Home',
  
        }}
      />
      
      <BottomTab.Screen
        name={BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT}
        component={CustomerAccountStack}

      />

      <BottomTab.Screen
        name={BOTTOM_TAB_CUSTOMER_ROUTES.NOTIFICATION_STACK}
        // name='StackNoti'
        component={CustomerNotificationStack}

      />
      
      
    </BottomTab.Navigator>
  );
}

export const CustomerHomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.HOME}
    >
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SHOW_AUTO_PARTS}
        component={HomeScreen}
        options={{
          headerShown: true,
          header: props => (
            <CustomHeaderComponent {...props} name="Home" />
          ),
        }}
      />

    

    </Stack.Navigator>
  );
};

export const CustomerAccountStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_HOME}
    >
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_HOME}
        component={AccountScreen}
        options={{
          headerShown: true,
          header: props => (
            <CustomHeaderComponent {...props} name="Home" />
          ),
        }}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_CARS}
        component={MyCarsScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props} 
            titulo="Mis autos" 
            nav={props.navigation.goBack}
            />
          ),
        }}
      />
      
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_PEDIDOS}
        component={PedidosScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props} 
            titulo="Pedidos" 
            nav={props.navigation.goBack}
            />
          ),
        }}
      />
    

    </Stack.Navigator>
  );
};

export const CustomerNotificationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={CUSTOMER_HOME_SCREEN_ROUTES.NOTIFICATION_HOME}
    >
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.NOTIFICATION_HOME}
        component={NotificationScreen}
        options={{
          headerShown: true,
          header: props => (
            <CustomHeaderComponent {...props} name="Home" />
          ),
        }}
      />

    

    </Stack.Navigator>
  );
};