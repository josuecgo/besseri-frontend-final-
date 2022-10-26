import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import { ChatsScreen } from '../../screens/Chat/ChatsScreen';
import { PrivateScreen } from '../../screens/Chat/PrivateScreen';







const Stack = createStackNavigator();


export const ChatStack = () => {

    return (
        <Stack.Navigator 
        screenOptions={{headerShown:false}}
        >
            <Stack.Screen name={'CHATS'}
            component={ChatsScreen}
            />
            <Stack.Screen name={'PRIVATE'}
            component={PrivateScreen}
            />
        </Stack.Navigator>
    );
};