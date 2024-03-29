import React, { useEffect, useState,useContext } from 'react';
import {  Platform, StatusBar,useColorScheme } from 'react-native';

import { KeysStripe, ROLES } from './util/constants';
import { NavigationContainer } from '@react-navigation/native';
import { USER_ROLE } from './util/local-storage';

import { useAsyncStorage } from '@react-native-async-storage/async-storage';

import { MainNavigation } from './util/Routes/navigation.routes';
import { combineReducers, createStore } from 'redux';
import businessProfileReducer from './util/ReduxStore/Reducers/VendorReducers/BusinessProfileReducer';
import { Provider } from 'react-redux';
import CartReducer from './util/ReduxStore/Reducers/CustomerReducers/CartReducer';
import { StripeProvider } from '@stripe/stripe-react-native';
import RiderReducer from './util/ReduxStore/Reducers/RiderReducers/RiderReducer';

import messaging from '@react-native-firebase/messaging';
import { NativeBaseProvider } from 'native-base';

import { NotificationContext, NotificationProvider } from './util/context/NotificationContext';

import { ProductProvider } from './util/context/Product/ProductContext';

import { ChatContext, ChatProvider } from './util/context/Chat/ChatContext';
import { useChat } from './hooks/useChat';
import FeedbackReducer from './util/ReduxStore/Reducers/CustomerReducers/FeedbackReducer';




const App = () => {


  const { getItem: getStoreRole } = useAsyncStorage(USER_ROLE);
  const store = combineReducers({
    businessActions: businessProfileReducer,
    cart: CartReducer,
    rider: RiderReducer,
    feedback: FeedbackReducer
    
  });
  const reduxStore = createStore(store);
  const [showSplashScreen, setSplashScreen] = useState(true);
  const [userRole, setUserRole] = useState(ROLES.UNSET);

  useEffect(() => {
    (async () => {
      const data = await getStoreRole();
      if (data) {
        setUserRole(data);
      }
      setSplashScreen(false);
    })();
  }, []);

      
   
  
  return(
    <StripeProvider
    publishableKey={KeysStripe.LIVE_KEY}
    >
    <Provider store={reduxStore}>
    
        <NotificationProvider>  
          
          <ProductProvider>
            <ChatProvider>
              <NativeBaseProvider>
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
