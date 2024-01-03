import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import { ChecksCarScreen } from '../../screens/customer/Garage/customer.checksCar.screen';
import { HeaderTitle } from '../../components/Customer/HeaderTitle';








const Stack = createStackNavigator();


export const ChecksStack = (props) => {
   

    return (
        <Stack.Navigator 
        screenOptions={{headerShown:false}}
        >
            <Stack.Screen name={'ChecksCarScreen'}
            component={ChecksCarScreen}
            initialParams={props?.route?.params?.checks}
            options={{
                headerShown: true,
                header: props => (
                  <HeaderTitle {...props}
                    titulo="Diagnósticos"
                    nav={props.navigation.goBack}
                  />
                ),
              }}
            />
         
        </Stack.Navigator>
    );
};