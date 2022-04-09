import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {BOTTOM_TAB_RIDER_ROUTES, RIDER_STACK_ROUTES} from '../../util/constants';
import Colors from '../../util/styles/colors';
import RiderDummyScreen from './rider.dummy-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RiderExplore from './rider.explore.screen';
import RidersOrdersViewScreen from './rider.orders-screen';
import RiderProfileScreen from './rider.profile-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import RiderOrderDetail from './rider.orderdetails.screen';
const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();
export const RiderNavigation = () => {
  return (
    <BottomTab.Navigator
      initialRouteName={BOTTOM_TAB_RIDER_ROUTES.DUMMY_SCREEN}
      screenOptions={{
        tabBarActiveTintColor: Colors.white,
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: Colors.primaryColor,
        tabBarItemStyle: {borderRadius: 8, margin: 2},
        headerShown: false,
      }}>
      <BottomTab.Screen
        name={BOTTOM_TAB_RIDER_ROUTES.DUMMY_SCREEN}
        component={RiderDummyScreen}
        options={{
          title: BOTTOM_TAB_RIDER_ROUTES.DUMMY_SCREEN,
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons
              name="motorbike"
              color={color}
              size={size}
            />
          ),
        }}
      />
          <BottomTab.Screen
        name={BOTTOM_TAB_RIDER_ROUTES.RIDER_EXPLORE}
        component={RiderExplore}
        options={{
          title: BOTTOM_TAB_RIDER_ROUTES.RIDER_EXPLORE,
          tabBarIcon: ({focused, color, size}) => (
            <MaterialIcons name='explore' color={color} size={size}/>
          
          ),
        }}
      />
       <BottomTab.Screen
        name={BOTTOM_TAB_RIDER_ROUTES.RIDER_ORDERS}
        component={OrdersNavigator}
        options={{
          title: BOTTOM_TAB_RIDER_ROUTES.RIDER_ORDERS,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome5Icon
              name="tasks"
              color={color}
              size={size}
            />
          ),
        }}
      />
        <BottomTab.Screen
        name={BOTTOM_TAB_RIDER_ROUTES.RIDER_PROFILE}
        component={RiderProfileScreen}
        options={{
          title: BOTTOM_TAB_RIDER_ROUTES.RIDER_PROFILE,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome5Icon
              name="user-alt"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const OrdersNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name={BOTTOM_TAB_RIDER_ROUTES.RIDER_ORDERS}
        component={RidersOrdersViewScreen}/>
        <Stack.Screen name={RIDER_STACK_ROUTES.RIDER_ORDER_DETAIL}
        component={RiderOrderDetail}/>
    </Stack.Navigator>
  )
}