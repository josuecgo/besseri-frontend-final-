import React, { useEffect,useContext } from 'react';
import {  StatusBar,useColorScheme } from 'react-native';

import { KeysStripe } from './util/constants';
import { NavigationContainer } from '@react-navigation/native';


import { MainNavigation } from './util/Routes/navigation.routes';
import { combineReducers, createStore,applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { Provider } from 'react-redux';
import CartReducer from './util/ReduxStore/Reducers/CustomerReducers/CartReducer';
import { StripeProvider } from '@stripe/stripe-react-native';

import messaging from '@react-native-firebase/messaging';
import {  NativeBaseProvider,  Text,  extendTheme } from 'native-base';

import { NotificationContext, NotificationProvider } from './util/context/NotificationContext';

import { ProductProvider } from './util/context/Product/ProductContext';

import { ChatProvider } from './util/context/Chat/ChatContext';

import FeedbackReducer from './util/ReduxStore/Reducers/CustomerReducers/FeedbackReducer';
import UserInfoReducer from './util/ReduxStore/Reducers/CustomerReducers/UserInfoReducer';
import PedidosReducer from './util/ReduxStore/Reducers/CustomerReducers/PedidosReducer';
import FuelReducer from './util/ReduxStore/Reducers/CustomerReducers/FuelReducer';


const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const customTheme = extendTheme({ config });


const rootReducer = combineReducers({
  cart: CartReducer,
  feedback: FeedbackReducer,
  user: UserInfoReducer,
  pedidos: PedidosReducer,
  fuel: FuelReducer,
});

// Crear tienda Redux con middleware (redux-thunk)
const store = createStore(rootReducer, applyMiddleware(thunk));




const App = () => {
   
  
  return(
    <StripeProvider
    publishableKey={KeysStripe.TEST_KEY}
    >
    <Provider store={store}>
    
        <NotificationProvider>  
          
          <ProductProvider>
            <ChatProvider>
              <NativeBaseProvider theme={customTheme} >
                <App2/>
              </NativeBaseProvider>
            </ChatProvider>
          </ProductProvider>
       
        </NotificationProvider>
      
      
    
    </Provider>
  </StripeProvider>
  )
}
const App2 = () => {
 


  const {
    iosPermisoss,
    getToken,
  } = useContext(NotificationContext);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      iosPermisoss();
    }
    getToken();
  }, []);


  
  const isDarkMode = useColorScheme() === 'dark';

  return (
  
      <NavigationContainer>
        
        
        <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
        {/* {showSplashScreen ? <SplashScreen /> : <MainNavigation />} */}
        <MainNavigation />
      
      </NavigationContainer>
    




  );
};

export default App;
