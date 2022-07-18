import React, { useContext } from 'react';
import { View} from 'react-native';
import Colors from '../../util/styles/colors';
import VendorOrdersScreen from './vendor-orders.screen';
import VendorProfileScreen from './vendor-profile.screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import VendorProductsScreen from './vendor-products.screen';
import {
  BOTTOM_TAB_VENDOR_ROUTES,
  CUPON_ROUTES,
  CUSTOMER_HOME_SCREEN_ROUTES,
  SHARED_ROUTES,
  VENDOR_DETAILS_ROUTES,
} from '../../util/constants';
import VendorDashboardScreen from './vendor-dashboard.screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import VendorNotificationsScreen from './vendor-notifications.screen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

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
import { EditProfile } from './vendor-edit-profile';
import { Badge } from '../../components/Badge';
import { NotificationContext } from '../../util/context/NotificationContext';
import { HomeScreen } from './vendor-home.screen';
export const VendorNavigation = () => {

  const {count} = useContext(NotificationContext);


  

  return (
    <BottomTab.Navigator
      initialRouteName={BOTTOM_TAB_VENDOR_ROUTES.DASHBOARD}
      screenOptions={ ({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primarySolid,
        // tabBarInactiveTintColor: Colors.primarySolid,
        // tabBarActiveBackgroundColor:Colors.primarySolid,
        
        tabBarIcon: ({color,focused,size}) => {
            
            let iconName  = '';
    
            switch (route.name) {
                case BOTTOM_TAB_VENDOR_ROUTES.PRODUCTS:
                iconName = 'drive-eta';
                break;
                case BOTTOM_TAB_VENDOR_ROUTES.SERVICES:
                iconName = 'build';
                break;
                case BOTTOM_TAB_VENDOR_ROUTES.ORDERS:
                iconName = 'assignment-turned-in'
                break;

                case BOTTOM_TAB_VENDOR_ROUTES.DASHBOARD:
                  iconName = 'notifications'
                break;
                
                case BOTTOM_TAB_VENDOR_ROUTES.CUPON:
                  iconName = 'local-offer'
                break;
                
                default:
                    iconName = 'person'
                    break;
            }
    
            return  (
                <View>
                  {
                    route?.name === BOTTOM_TAB_VENDOR_ROUTES.DASHBOARD && (
                      <Badge count={count} />
                    )
                  }
                   
                    <MaterialIcons name={iconName}  size={size} color={color} />   
                </View>
                
            )
        },
        
      })
      }
      >
      <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.PRODUCTS}
        component={ProductNavigator}
        options={{
          title: 'Productos',
          // tabBarIcon: ({ focused, color, size }) => (
        
          //   <MaterialIcons name='drive-eta'  size={size} color={color} />
          // ),
        }}
      />
      <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.SERVICES}
        component={ServiceNavigator}
        options={{
          title: 'Servicios'
        }}
      />
      <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.CUPON}
        component={CuponNavigator}
        options={{
          title: 'Cupón'
        }}
      />
      <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.ORDERS2}
        component={OrderNavigator}
        options={{
          title: 'Pedidos'
        }}
      />
      <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.DASHBOARD}
        component={NotificationNavigator}
        options={{
          title: 'News',
          
        }}
      />
      <BottomTab.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.PROFILE}
        component={ProfileNavigator}
        options={{
          title: 'Perfil',
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

      <ProfileStack.Screen
        name={VENDOR_DETAILS_ROUTES.VENDOR_EDIT_PROFILE}
        component={EditProfile}
        options={{
          headerShown: false,
        }}
      />
    </ProfileStack.Navigator>
  );
};

const NotificationStack = createStackNavigator();

const NotificationNavigator = () => {
  return (
    <NotificationStack.Navigator
      initialRouteName={'NotificationScreen'}
      >
      <NotificationStack.Screen
         name={'NotificationScreen'}
         component={VendorDashboardScreen}
         options={{
          headerShown:false
         }}
      />
      <NotificationStack.Screen
         name={'NotificationDetail'}
         component={VendorOrderDetailsScreen}
         options={{
           headerShown: false,
         }}
      />
     
    </NotificationStack.Navigator>
  );
};


const ServicesStack = createStackNavigator();

const ServiceNavigator = () => {
  return (
    <ServicesStack.Navigator
      initialRouteName={BOTTOM_TAB_VENDOR_ROUTES.ServiceNavigator}>
      <ServicesStack.Screen
        name={BOTTOM_TAB_VENDOR_ROUTES.SERVICES2}
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
          headerShown: false,
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

const CuponStack = createStackNavigator();

const CuponNavigator = () => {

  return (
    <CuponStack.Navigator>
      <CuponStack.Screen
        name={CUPON_ROUTES.HOME_CUPON}
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

    </CuponStack.Navigator>
  );
};
