
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

import { ServiciosScreen } from '../Home/ServiciosScreen';
import { MapServiceScreen } from '../Home/MapServiceScreen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useContext } from 'react';
import { NotificationContext } from '../../../util/context/NotificationContext';

import HeaderStore from '../../../components/Customer/HeaderStore';
import HomeStoreScreen from '../Store/HomeStoreScreen';
import ProductDetailScreen from '../Store/ProductDetailScreen';
import { LavadoMaps } from '../Home/LavadoMaps';
import { AddCarScreen } from '../Account/AddCarScreen';
import { CreateCarScreen } from '../Garage/customer.createCar.screen';
import { CategoriesServicesScreen } from '../Home/CategoriesServicesScreen';
import { MyAccountScreen } from '../Account/MyAccountScreen';
import PrivacyPolicy from '../../privacypolicy.screen';
import CustomerAddressesScreen from '../customer.addresses.screen';
import { SearchAddressScreen } from '../Address/SearchAddressScreen';
import { AccountAddressScreen } from '../Account/AccountAddressScreen';

import messaging from '@react-native-firebase/messaging';
import { HeaderPedidos } from '../../../components/Customer/HeaderPedidos';
import { ValetHomeScreen } from '../Home/ValetHomeScreen';
import { useLocation } from '../../../hooks/useLocation';
import { ProductContext } from '../../../util/context/Product/ProductContext';
import { useSelector } from 'react-redux';
import { RecentProductsScreen } from '../Account/RecentProductsScreen';
import { useInfoUser } from '../../../hooks/useInfoUsers';
import { useIsFocused } from '@react-navigation/native';
import { QuoteFormScreen } from '../Store/QuoteFormScreen';
import { MyQuoteScreen } from '../Store/MyQuoteScreen';
import { MyQuoteDetailScreen } from '../Store/MyQuoteDetailScreen';

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();


export const BottomTabHome = (props) => {
  const {
    iosPermisoss,
    getToken,
    showNotification, 
    listenerBack, 
    onForegroundMessageRecived 
  } = useContext(NotificationContext);
  const isFocused = useIsFocused()
  const {
    comision, getMarcas, getModelo,
    valueMaker, getComision
  } = useContext(ProductContext)
  const {getNotificaciones,getPedidosUser} = useInfoUser();
  
  


  useEffect(() => {
    if (isFocused) {
      
      getNotificaciones()
    }
    
  }, [isFocused])

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


  useEffect(() => {
    if (Platform.OS === 'ios') {
      iosPermisoss();
    }
    getToken();
  }, []);





  useEffect(() => {
    let isMounted = true;
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      if (isMounted) {


        showNotification(remoteMessage, props.navigation)
      }

    })
    return () => {
      isMounted = false; // Marcamos el componente como desmontado al limpiar
    };
  }, [])




  useEffect(() => {
    let isMounted = true;

    messaging().onMessage(async (msg) => {


      if (isMounted) {
        onForegroundMessageRecived(msg, props.navigation)
      }




    })

    return () => {
      isMounted = false; // Marcamos el componente como desmontado al limpiar
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      listenerBack(props.navigation)
    }

    return () => {
      isMounted = false;
    }
  }, [])


  return (
    <BottomTab.Navigator
      initialRouteName={BOTTOM_TAB_CUSTOMER_ROUTES.HOME_SCREEN}
      tabBar={props => <FooterNav {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.primarySolid,
      })
      }


    >
      <BottomTab.Screen
        name={BOTTOM_TAB_CUSTOMER_ROUTES.HOME_SCREEN}
        component={CustomerHomeStack}

      />

      <BottomTab.Screen
        name={BOTTOM_TAB_CUSTOMER_ROUTES.ACCOUNT}
        component={CustomerAccountStack}

      />

      <BottomTab.Screen
        name={BOTTOM_TAB_CUSTOMER_ROUTES.NOTIFICATION_STACK}
        // name='StackNoti'
        component={NotificationScreen}

      />


    </BottomTab.Navigator>
  );
}

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

export const CustomerHomeStack = () => {

  const { user } = useSelector(state => state?.user)

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      
      
    >
      {
        user?.role === 'client' || !user && (
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
       )
      } 


      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.QUOTE_FORM_SCREEN}
        component={QuoteFormScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderStore {...props}
              titulo="BESSER"
              // nav={props.navigation.goBack}
              tienda={true}
            />
          ),
        }}
      />


      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SHOW_REFACCIONES}
        component={HomeStoreScreen}
        options={{
          animationEnabled: false,
          headerShown: true,
          header: props => (
            <HeaderStore {...props}
              titulo="Tienda"
              nav={props.navigation.goBack}
              tienda={true}
            />
          ),
        }}
      />


      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.SERVICES_CATEGORIES}
        component={CategoriesServicesScreen}
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
        name={CUSTOMER_HOME_SCREEN_ROUTES.SERVICES_STACK}
        component={ServiciosScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props}
              titulo="Tipo de servicio"
              nav={props.navigation.goBack}
            />
          ),
        }}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.MAP_SERVICES}
        component={MapServiceScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props}
              titulo="Servicios cercanos"
              nav={props.navigation.goBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.HOME_VALET}
        component={ValetHomeScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props}
              titulo="Tipo de servicio"
              nav={props.navigation.goBack}
            />
          ),
        }}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.LAVADO}
        component={LavadoMaps}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props}
              titulo="Lavado"
              nav={props.navigation.goBack}
            />
          ),
        }}
      />



      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.PRODUCT_DETAIL}
        component={ProductDetailScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderStore {...props}
              titulo="Detalle de producto"
              nav={props.navigation.goBack}
              tienda={true}
            />
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
        name={CUSTOMER_HOME_SCREEN_ROUTES.MY_ACCOUNT}
        component={MyAccountScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props}
              titulo="Mi cuenta"
              nav={props.navigation.goBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_RECENT_PRODUCTS}
        component={RecentProductsScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props}
              titulo="Artículos recientes"
              nav={props.navigation.goBack}
            />
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
        name={CUSTOMER_HOME_SCREEN_ROUTES.PRIVACY_POLICY}
        component={PrivacyPolicy}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props}
              titulo="Politicas de privacidad"
              nav={props.navigation.goBack}
            />
          ),
        }}
      />
      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_ADDRESS}
        component={AddressStack}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props}
              titulo="Dirección"
              nav={props.navigation.goBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ADD_MY_CAR}
        component={AddCarScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props}
              titulo="Agregar auto"
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
            <HeaderPedidos {...props}
              titulo="Historial"
              nav={props.navigation}
            />
          ),
        }}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_MY_QUOTE}
        component={MyQuoteScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderTitle {...props}
              titulo="Mis cotizaciones"
              nav={props.navigation.goBack}
            />
          ),
        }}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_DETAIL_QUOTE}
        component={MyQuoteDetailScreen}
        options={{
          headerShown: true,
          header: props => (
            <HeaderPedidos {...props}
              titulo="Cotizacion"
              nav={props.navigation}
            />
          ),
        }}
      />




    </Stack.Navigator>
  );
};



const AddressStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_VIEW_MY_ADDRESS}
        component={AccountAddressScreen}
      />

      <Stack.Screen
        name={CUSTOMER_HOME_SCREEN_ROUTES.ACCOUNT_SEARCH_MY_ADDRESS}
        component={SearchAddressScreen}
      />
    </Stack.Navigator>
  )
}