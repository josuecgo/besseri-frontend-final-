import { Image, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { Box, FlatList, Avatar, HStack, VStack, Text, Spacer } from "native-base";
import { HeaderTitle } from '../../components/Customer/HeaderTitle'
import { ChatContext } from '../../util/context/Chat/ChatContext'
import { base_url } from '../../util/api/api_essentials';
import Colors from '../../util/styles/colors';
import { getBusinessProfile } from '../../util/local-storage/auth_service';

export const ChatsScreen = ({ navigation }) => {
    const { chats, getChats, loadingChats, activarChat, uid } = useContext(ChatContext);

    const goChatPv = async (data) => {
       
        await activarChat({
            de: data.de,
            para: data.para._id,
            room: data.product._id
        })
        navigation.navigate('PRIVATE', { data });
    }

    const allChats = async () => {


        getChats(uid)
    }

    const renderItem = ({ item }) => {
        const { product, para } = item;
       
        let img = `${base_url}/${product?.productImg}`
        return (
            <Box
                py="2"
                borderColor={Colors.textSecundary} bg={Colors.white}

            >
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => goChatPv(item)}
                >
                    <HStack
                        space={[2, 3]}
                        justifyContent="space-between"
                        style={{ marginHorizontal: 8, alignItems: 'center' }}
                        borderBottomWidth="0.5"
                        // marginY={1}
                        padding={2}
                    >
                        <Avatar size="48px" source={{
                            uri: img
                        }}
                        />
                        <VStack>
                            <Text _dark={{
                                color: "warmGray.50"
                            }} color="coolGray.800" bold>
                                {product.name}
                            </Text>
                            <Text fontSize="xs" _dark={{
                                color: "warmGray.50"
                            }}
                                color="coolGray.800" alignSelf="flex-start"
                            >
                                {para.name}
                            </Text>
                            <Text
                                color="coolGray.600" _dark={{
                                    color: "warmGray.200"
                                }}
                            >
                                {para.email}

                            </Text>
                            

                        </VStack>
                        <Spacer />
                        
                       

                    </HStack>
                </TouchableOpacity>
            </Box>

        )
    }

    useEffect(() => {
        allChats()
    }, [])


    return (
        <View>
            <HeaderTitle
                titulo={'CHATS'}
                iconName='keyboard-backspace'
                nav={() => navigation.goBack()}
            />

            <FlatList
                data={chats}
                renderItem={renderItem}
            />

        </View>
    )
}

