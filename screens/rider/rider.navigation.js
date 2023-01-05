import React,{useContext, useEffect} from 'react';
import { Platform, View} from 'react-native';
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
import { deviceHeight } from '../../util/Dimentions';
import { RiderNotification } from './rider.notification';
import { Badge } from '../../components/Badge';
import { NotificationContext } from '../../util/context/NotificationContext';
import { useLocation } from '../../hooks/useLocation';
import { VendorDescription } from '../vendor/vendor-description';



const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();


export const RiderNavigation = () => {

  const {userLocation,getLocationHook} = useLocation()
  const {countRider,iosPermisoss,getToken} = useContext(NotificationContext);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      
      iosPermisoss();
      
    }
    getToken();
    
}, [])

useEffect(() => {
  getLocationHook()
}, [])
  // console.log({countRider,notificaciones});
  return (
    <BottomTab.Navigator
      initialRouteName={BOTTOM_TAB_RIDER_ROUTES.DUMMY_SCREEN}
      screenOptions={ ({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primarySolid,
        // tabBarInactiveTintColor: Colors.primarySolid,
        // tabBarActiveBackgroundColor:Colors.primarySolid,
        
        tabBarIcon: ({color,focused,size}) => {
            
            let iconName  = '';
    
            switch (route.name) {
                case BOTTOM_TAB_RIDER_ROUTES.DUMMY_SCREEN:
                iconName = 'two-wheeler';
                break;
                case BOTTOM_TAB_RIDER_ROUTES.RIDER_EXPLORE:
                iconName = 'explore';
                break;
                case BOTTOM_TAB_RIDER_ROUTES.RIDER_NOTIFICATION:
                iconName = 'notifications'
                break;

                case BOTTOM_TAB_RIDER_ROUTES.RIDER_ORDERS:
                iconName = 'list-alt'
                break;

                case BOTTOM_TAB_RIDER_ROUTES.RIDER_PROFILE:
                iconName = 'person'
                break;

                
                default:
                    iconName = 'person'
                    break;
            }
    
            return  (
                <View>
                  {
                    route?.name === BOTTOM_TAB_RIDER_ROUTES.RIDER_NOTIFICATION && (
                      <Badge count={countRider} />
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
        name={BOTTOM_TAB_RIDER_ROUTES.DUMMY_SCREEN}
        component={RiderDummyScreen}
        options={{
          title:'Repartidor',
  
        }}
      />
      <BottomTab.Screen
        name={BOTTOM_TAB_RIDER_ROUTES.RIDER_EXPLORE}
        component={RiderExplore}
        options={{
          title:'Explore',
          
        }}
      />
      <BottomTab.Screen
        name={BOTTOM_TAB_RIDER_ROUTES.RIDER_NOTIFICATION}
        component={NotificationNavigator}
        options={{
          title:'News'
        }}
      />
      <BottomTab.Screen
        name={BOTTOM_TAB_RIDER_ROUTES.RIDER_ORDERS}
        component={OrdersNavigator}
        options={{
          title:'Pedidos',
          
        }}
      />
        <BottomTab.Screen
        name={BOTTOM_TAB_RIDER_ROUTES.RIDER_PROFILE}
        component={RiderProfileScreen}
        options={{
          title: 'Perfil',
      
        }}
      />
    </BottomTab.Navigator>
  );
};



const OrdersNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name={BOTTOM_TAB_RIDER_ROUTES.RIDER_ORDERS2}
        component={RidersOrdersViewScreen}
      />
      <Stack.Screen name={RIDER_STACK_ROUTES.RIDER_ORDER_DETAIL}
      component={RiderOrderDetail}
      />
      <Stack.Screen name={RIDER_STACK_ROUTES.DESCRIPTION}
      component={VendorDescription}
      />
  </Stack.Navigator>
  );
};



const NotificationNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen  
      name={'Notificaciones'}
      component={RiderNotification}
      />
      <Stack.Screen name={RIDER_STACK_ROUTES.RIDER_ORDER_DETAIL}
      component={RiderOrderDetail}/
      >
    </Stack.Navigator>
  )
}