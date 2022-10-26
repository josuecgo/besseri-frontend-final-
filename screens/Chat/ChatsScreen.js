import { Image, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { Box, FlatList, Avatar, HStack, VStack, Text, Spacer } from "native-base";
import { HeaderTitle } from '../../components/Customer/HeaderTitle'
import { ChatContext } from '../../util/context/Chat/ChatContext'
import {  base_url } from '../../util/api/api_essentials';
import Colors from '../../util/styles/colors';

export const ChatsScreen = ({navigation}) => {
    const { chats} = useContext(ChatContext);

    const goChatPv = (data) => {
        console.log(data);
        navigation.navigate('PRIVATE',data)
    }
    
    const renderItem = ({item}) => {

       
        let img = `${base_url}/${item?.room?.productImg}`
        return (
            <Box 
            py="2"  
            borderColor={Colors.textSecundary} bg={Colors.white} 
            
            >
                <TouchableOpacity
                activeOpacity={0.5}
                onPress={()=> goChatPv(item.room)}
                >
                <HStack 
                space={[2, 3]} 
                justifyContent="space-between"
                style={{marginHorizontal:8,alignItems:'center'}}
                borderBottomWidth="0.5"
                // marginY={1}
                padding={2}
                >
                 
                    
                        
                  
                   
                    <Avatar size="48px" source={{
                        uri:img
                    }} 
                    />
                        <VStack>
                            <Text _dark={{
                                color: "warmGray.50"
                                }} color="coolGray.800" bold>
                                {item?.room?.name}
                            </Text>
                            <Text 
                            color="coolGray.600" _dark={{
                                color: "warmGray.200"
                            }}
                            >
                            {item.recentText}
                          </Text>
                        </VStack>
                        <Spacer />
                        <Text fontSize="xs" _dark={{
                        color: "warmGray.50"
                        }} 
                        color="coolGray.800" alignSelf="flex-start"
                        >
                          {item.timeStamp}
                        </Text>
                      
                </HStack>
                </TouchableOpacity>
            </Box>
            
        )
    }
    return (
        <View>
            <HeaderTitle 
            titulo={'CHATS'} 
            iconName='keyboard-backspace'
            nav={()=> navigation.goBack()}
            />

            <FlatList
            data={chats}
            renderItem={renderItem}
            />
        
        </View>
    )
}

