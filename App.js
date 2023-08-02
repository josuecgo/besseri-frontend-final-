import React, { useEffect,useContext } from 'react';
import {  StatusBar,useColorScheme } from 'react-native';

import { KeysStripe } from './util/constants';
import { NavigationContainer } from '@react-navigation/native';


import { MainNavigation } from './util/Routes/navigation.routes';
import { combineReducers, createStore,applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import CartReducer from './util/ReduxStore/Reducers/CustomerReducers/CartReducer';
import { StripeProvider } from '@stripe/stripe-react-native';

import messaging from '@react-native-firebase/messaging';
import {  NativeBaseProvider,  extendTheme } from 'native-base';

import { NotificationContext, NotificationProvider } from './util/context/NotificationContext';

import { ProductProvider } from './util/context/Product/ProductContext';

import { ChatProvider } from './util/context/Chat/ChatContext';
import { useChat } from './hooks/useChat';
import FeedbackReducer from './util/ReduxStore/Reducers/CustomerReducers/FeedbackReducer';
import UserInfoReducer from './util/ReduxStore/Reducers/CustomerReducers/UserInfoReducer';
import PedidosReducer from './util/ReduxStore/Reducers/CustomerReducers/PedidosReducer';


const config = {
  useSystemColorMode: false,
  initialColorMode: 'dark',
};

const customTheme = extendTheme({ config });

const App = () => {


  
  const store = combineReducers({
    cart: CartReducer,
    feedback: FeedbackReducer,
    user: UserInfoReducer,
    pedidos:PedidosReducer
    
  });
  const reduxStore = createStore(store,applyMiddleware(thunk));





   
  
  return(
    <StripeProvider
    publishableKey={KeysStripe.LIVE_KEY}
    >
    <Provider store={reduxStore}>
    
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
 
  const {showNotification,notificaciones  } = useContext(NotificationContext);

  const { allChats}  = useChat()
  


  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    
      showNotification(remoteMessage)
      
    
    });
  },[])

  useEffect(() => {
    
  
    messaging().onMessage(msg => {
     
      showNotification(msg)
     


    })

    
  },[]);


  useEffect(() => {
    allChats()
  }, [notificaciones])


  



  
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
