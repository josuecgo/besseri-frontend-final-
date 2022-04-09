import React from 'react';
import Colors from '../../util/styles/colors';
import VendorOrdersScreen from './vendor-orders.screen';
import VendorProfileScreen from './vendor-profile.screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import VendorProductsScreen from './vendor-products.screen';
import {
  BOTTOM_TAB_VENDOR_ROUTES,
  CUSTOMER_HOME_SCREEN_ROUTES,
  SHARED_ROUTES,
  VENDOR_DETAILS_ROUTES,
} from '../../util/constants';
import VendorDashboardScreen from './vendor-dashboard.screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import VendorNotificationsScreen from './vendor-notifications.screen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStackNavigator} from '@react-navigation/stack';
import VendorProductDetailsScreen from './vendor-product-details.screen';
import VendorOrderDetailsScreen from './vendor-order-details.screen';
import VendorProfileDetailScreen from './vendor.profile-details';
import VendorSettingsScreen from './vendor.settings';
import VendorAddProduct from './vendor.addproduct.screen';
import VendorServicesScreen from './vendor.services.screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
const BottomTab = createBottomTabNavigator();
import ShareServiceDetail from '../servicedetail.sharescreen';
import VendorBookingDetail from './vendor.bookingdetail.screen';
import VendorLocationScreen from './vendor.businessLocation'
export const VendorNavigation = () => {
  return (
    <BottomTab.Navigator
      initialRouteName={BOTTOM_TAB_VENDOR_ROUTES.DASHBOARD}
      screenOptions={{
        tabBarActiveTintColor: Colors.white,
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: Colors.primaryColor,
        tabBarItemStyle: {borderRadius: 8, margin: 2},
        headerShown: false,
      }}>
      <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.PRODUCTS}
        component={ProductNavigator}
        options={{
          title: BOTTOM_TAB_VENDOR_ROUTES.PRODUCTS,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome name="product-hunt" size={size} color={color} />
          ),
        }}
      />
       <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.SERVICES}
        component={ServiceNavigator}
        options={{
          title: BOTTOM_TAB_VENDOR_ROUTES.SERVICES,
          tabBarIcon: ({focused, color, size}) => (
            <MaterialIcons name="miscellaneous-services" size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.ORDERS}
        component={OrderNavigator}
        options={{
          title: BOTTOM_TAB_VENDOR_ROUTES.ORDERS,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome name="first-order" size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.DASHBOARD}
        component={VendorDashboardScreen}
        options={{
          title: BOTTOM_TAB_VENDOR_ROUTES.DASHBOARD,
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      {/* <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.NOTIFICATION}
        component={VendorNotificationsScreen}
        options={{
          title: BOTTOM_TAB_VENDOR_ROUTES.NOTIFICATION,
          tabBarIcon: ({focused, color, size}) => (
            <AntDesign name="notification" size={size} color={color} />
          ),
        }}
      /> */}
      <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.PROFILE}
        component={ProfileNavigator}
        options={{
          title: BOTTOM_TAB_VENDOR_ROUTES.PROFILE,
          tabBarIcon: ({focused, color, size}) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const ProfileStack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName={VENDOR_DETAILS_ROUTES.PRODUCT_LISTING}>
      <ProfileStack.Screen
        name={VENDOR_DETAILS_ROUTES.VENDOR_PROFILE}
        component={VendorProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name={VENDOR_DETAILS_ROUTES.VENDOR_PROFILE_DETAIL}
        component={VendorProfileDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name={VENDOR_DETAILS_ROUTES.VENDOR_SETTINGS}
        component={VendorSettingsScreen}
        options={{
          headerShown: false,
        }}
      />
       <ProfileStack.Screen
        name={VENDOR_DETAILS_ROUTES.BUSINESS_LOCATION}
        component={VendorLocationScreen}
        options={{
          headerShown: false,
        }}
      />
    </ProfileStack.Navigator>
  );
};


const ServicesStack = createStackNavigator();

const ServiceNavigator = () => {
  return (
    <ServicesStack.Navigator
      initialRouteName={BOTTOM_TAB_VENDOR_ROUTES.ServiceNavigator}>
      <ServicesStack.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.SERVICES}
        component={VendorServicesScreen}
        options={{
          headerShown: false,
        }}
      />
      <ServicesStack.Screen
        name={SHARED_ROUTES.SERVICE_DETAIL}
        component={ShareServiceDetail}
        options={{
          headerShown: false,
        }}
      />
        {/* <ServicesStack.Screen
        name={VENDOR_DETAILS_ROUTES.CREATE_PRODUCT}
        component={VendorAddProduct}
        options={{
          headerShown: false,
        }}
      /> */}
    </ServicesStack.Navigator>
  );
};


const ProductStack = createStackNavigator();

const ProductNavigator = () => {
  return (
    <ProductStack.Navigator
      initialRouteName={VENDOR_DETAILS_ROUTES.PRODUCT_LISTING}>
      <ProductStack.Screen
        name={VENDOR_DETAILS_ROUTES.PRODUCT_LISTING}
        component={VendorProductsScreen}
        options={{
          headerShown: false,
        }}
      />
      <ProductStack.Screen
        name={VENDOR_DETAILS_ROUTES.PRODUCT_DETAILS}
        component={VendorProductDetailsScreen}
        options={{
          headerShown: false,
        }}
      />
        {/* <ProductStack.Screen
        name={VENDOR_DETAILS_ROUTES.CREATE_PRODUCT}
        component={VendorAddProduct}
        options={{
          headerShown: false,
        }}
      /> */}
    </ProductStack.Navigator>
  );
};

const OrderStack = createStackNavigator();

const OrderNavigator = () => {
  return (
    <OrderStack.Navigator
      initialRouteName={VENDOR_DETAILS_ROUTES.ORDER_LISTING}>
      <OrderStack.Screen
        name={VENDOR_DETAILS_ROUTES.ORDER_LISTING}
        component={VendorOrdersScreen}
        options={{
          headerShown: false,
        }}
      />
      <OrderStack.Screen
        name={VENDOR_DETAILS_ROUTES.ORDER_DETAILS}
        component={VendorOrderDetailsScreen}
        options={{
          headerShown: true,
        }}
      />
       <OrderStack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.BOOKING_DETAIL}
        component={VendorBookingDetail}
        options={{
          headerShown: false,
        }}
      />
    </OrderStack.Navigator>
  );
};
